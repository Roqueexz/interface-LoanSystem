import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import AuthRequests from "../../fetch/AuthRequests";
import Navegacao from "../Navegacao/Navegacao";
import Rodape from "../Rodape/Rodape";

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
    <div className="min-h-screen flex flex-col">
      <Navegacao />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-end items-center gap-3 mb-4">
            <button
              onClick={() => navigate("/perfil")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100 transition-all text-slate-600 hover:text-indigo-600 text-sm font-medium"
            >
              <User size={18} />
              Meu Perfil
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-50 transition-all text-slate-600 hover:text-red-600 text-sm font-medium"
            >
              <LogOut size={18} />
              Sair
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