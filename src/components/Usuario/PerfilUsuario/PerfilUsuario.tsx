import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, LogOut, Calendar, DollarSign } from "lucide-react";
import AuthRequests from "../../../fetch/AuthRequests";
import { useToast } from "../../../hooks/useToast";
import ModalConfirmacao from "../../../ui/Modal/ModalConfirmacao";

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
        return "Usuario";
      default:
        return role;
    }
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{usuario?.nome || "Usuario"}</h1>
                <p className="text-indigo-100 text-sm">{formatarRole(usuario?.role || "admin")}</p>
              </div>
            </div>
          </div>

          {/* Informacoes */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <Mail size={20} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="font-medium text-slate-700">{usuario?.email || "Nao informado"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <Shield size={20} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Tipo de usuario</p>
                  <p className="font-medium text-slate-700">{formatarRole(usuario?.role || "admin")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <Calendar size={20} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">ID do usuario</p>
                  <p className="font-medium text-slate-700">#{usuario?.id_usuario || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <DollarSign size={20} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Historico de emprestimos</p>
                  <p className="font-medium text-slate-700">Em breve</p>
                </div>
              </div>
            </div>

            {/* Historico de emprestimos (futuro) */}
            <div className="border-t border-slate-100 pt-6">
              <h2 className="text-lg font-semibold text-slate-700 mb-4">
                Historico de Emprestimos
              </h2>
              <div className="bg-slate-50 rounded-xl p-8 text-center">
                <p className="text-slate-400">
                  A funcionalidade de historico de emprestimos do usuario
                  <br />
                  sera implementada em breve.
                </p>
              </div>
            </div>

            {/* Botoes */}
            <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-all"
              >
                Voltar ao inicio
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-all"
              >
                <LogOut size={20} />
                SAIR DO SISTEMA
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmacao para Logout */}
      <ModalConfirmacao
        isOpen={modalLogoutOpen}
        onClose={() => setModalLogoutOpen(false)}
        onConfirm={confirmarLogout}
        title="Sair do Sistema"
        message="Tem certeza que deseja sair? Voce sera redirecionado para a tela de login."
        confirmText="Sair"
        cancelText="Cancelar"
        variant="warning"
      />
    </div>
  );
}

export default PerfilUsuario;