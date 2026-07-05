import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import AuthRequests from "../../fetch/AuthRequests";
import Navegacao from "../Navegacao/Navegacao";
import Rodape from "../Rodape/Rodape";
import TemaToggle from "../../ui/Tema/TemaToggle";

type Props = {
  children: ReactNode;
};

function Layout({ children }: Props) {
  const navigate = useNavigate();

  const nome = localStorage.getItem("nome") || "Usuário";
  const iniciais = nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    const confirmacao = confirm("Tem certeza que deseja sair?");
    if (confirmacao) {
      AuthRequests.removeToken();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navegacao />

      <main className="flex-1 w-full bg-background">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-background">
          {/* Header com avatar e acoes */}
          <div className="flex justify-end items-center gap-3 mb-4">
            <TemaToggle />

            <button
              onClick={() => navigate("/perfil")}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-muted transition-colors"
            >
              <div className="avatar avatar-sm">
                {iniciais || "U"}
              </div>
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

          {children}
        </div>
      </main>

      <Rodape />
    </div>
  );
}

export default Layout;