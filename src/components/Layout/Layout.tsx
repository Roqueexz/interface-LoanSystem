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

      <main className="flex-1 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-end items-center gap-3 mb-4">
            <TemaToggle />

            <button
              onClick={() => navigate("/perfil")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium"
            >
              <User size={18} />
              <span className="hidden sm:inline">Meu Perfil</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-all text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 text-sm font-medium"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Sair</span>
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