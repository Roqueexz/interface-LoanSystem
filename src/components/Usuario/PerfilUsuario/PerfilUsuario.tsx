import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, LogOut, Calendar, DollarSign, ArrowLeft } from "lucide-react";
import AuthRequests from "../../../fetch/AuthRequests";
import { useToast } from "../../../hooks/useToast";
import ModalConfirmacao from "../../../ui/Modal/ModalConfirmacao";
import { SkeletonDetalhes } from "../../../ui/Skeleton";

interface UsuarioInfo {
  id_usuario: number;
  nome: string;
  email: string;
  role: string;
}

function PerfilUsuario() {
  const navigate = useNavigate();
  const toast = useToast();
  const [usuario, setUsuario] = useState<UsuarioInfo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [modalLogoutOpen, setModalLogoutOpen] = useState(false);

  useEffect(() => {
    const nome = localStorage.getItem("nome") || "";
    const email = localStorage.getItem("email") || "";
    const role = localStorage.getItem("role") || "admin";
    const id_usuario = Number(localStorage.getItem("idUsuario")) || 0;

    setUsuario({
      id_usuario,
      nome,
      email,
      role,
    });
    setCarregando(false);
  }, []);

  const handleLogout = () => {
    setModalLogoutOpen(true);
  };

  const confirmarLogout = () => {
    toast.success('👋 Até logo!');
    AuthRequests.removeToken();
    navigate("/");
    setModalLogoutOpen(false);
  };

  const formatarRole = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "user":
        return "Usuário";
      default:
        return role;
    }
  };

  if (carregando) {
    return <SkeletonDetalhes />;
  }

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <div className="card overflow-hidden shadow-xl">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-8">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
              <User size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{usuario?.nome || "Usuário"}</h1>
              <p className="text-indigo-100 text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                {formatarRole(usuario?.role || "admin")}
              </p>
            </div>
          </div>
        </div>

        {/* Informacoes */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Mail size={18} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Email</p>
                <p className="font-medium text-foreground">{usuario?.email || "Não informado"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Shield size={18} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Tipo de usuário</p>
                <p className="font-medium text-foreground">{formatarRole(usuario?.role || "admin")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Calendar size={18} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">ID do usuário</p>
                <p className="font-medium text-foreground">#{usuario?.id_usuario || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <DollarSign size={18} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Histórico de empréstimos</p>
                <p className="font-medium text-foreground">Em breve</p>
              </div>
            </div>
          </div>

          {/* Historico de emprestimos (futuro) */}
          <div className="border-t border-border pt-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Histórico de Empréstimos
            </h2>
            <div className="bg-muted rounded-xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3">
                <DollarSign size={24} className="text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-muted-foreground">
                A funcionalidade de histórico de empréstimos do usuário
                <br />
                será implementada em breve.
              </p>
            </div>
          </div>

          {/* Botoes */}
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 flex-1 bg-muted hover:bg-accent text-foreground py-3 rounded-xl font-bold transition-all"
            >
              <ArrowLeft size={18} />
              Voltar ao início
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/25"
            >
              <LogOut size={18} />
              SAIR DO SISTEMA
            </button>
          </div>
        </div>
      </div>

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

export default PerfilUsuario;