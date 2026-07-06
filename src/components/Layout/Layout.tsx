import type { ReactNode } from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import AuthRequests from "../../fetch/AuthRequests";
import Navegacao from "../Navegacao/Navegacao";
import Rodape from "../Rodape/Rodape";
import TemaToggle from "../../ui/Tema/TemaToggle";
import ModalConfirmacao from "../../ui/Modal/ModalConfirmacao";
import { useToast } from "../../hooks/useToast";

type Props = {
  children: ReactNode;
};

function Layout({ children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const prevChildrenRef = useRef<ReactNode>(children);
  const [displayChildren, setDisplayChildren] = useState<ReactNode>(children);
  const [modalLogoutOpen, setModalLogoutOpen] = useState(false);

  useEffect(() => {
    const previous = prevChildrenRef.current;
    setDisplayChildren(previous);

    const timer = requestAnimationFrame(() => {
      setDisplayChildren(children);
      prevChildrenRef.current = children;
    });

    return () => cancelAnimationFrame(timer);
  }, [children, location.key]);

  const nome = localStorage.getItem("nome") || "Usuário";
  const iniciais = nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    setModalLogoutOpen(true);
  };

  const confirmarLogout = () => {
    try {
      AuthRequests.removeToken();
      toast.success('👋 Até logo!');
      navigate("/");
    } catch (error) {
      toast.error('❌ Erro ao sair do sistema. Tente novamente.');
      console.error('[Layout] Erro no logout:', error);
    } finally {
      setModalLogoutOpen(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navegacao />

      <main className="flex-1 w-full bg-background">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-background">
          <div className="flex justify-end items-center gap-3 mb-4">
            <TemaToggle />

            <button
              onClick={() => navigate("/perfil")}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-muted transition-colors"
            >
              <div className="avatar avatar-sm">{iniciais || "U"}</div>
              <span className="text-sm font-semibold text-foreground hidden sm:block">
                {nome}
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Sair"
            >
              <LogOut size={18} />
            </button>
          </div>

          <div className="transition-opacity duration-150">
            {displayChildren}
          </div>
        </div>
      </main>

      <Rodape />

      {/* Modal de Confirmacao para Logout */}
      <ModalConfirmacao
        isOpen={modalLogoutOpen}
        onClose={() => setModalLogoutOpen(false)}
        onConfirm={confirmarLogout}
        title="Sair do Sistema"
        message="Tem certeza que deseja sair? Você será redirecionado para a tela de login."
        confirmText="Sair"
        cancelText="Cancelar"
        variant="warning"
      />
    </div>
  );
}

export default Layout;