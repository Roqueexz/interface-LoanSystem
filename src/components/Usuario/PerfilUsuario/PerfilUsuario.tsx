import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, LogOut, Calendar, ArrowLeft, Activity } from "lucide-react";
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

  // Pega as iniciais do nome
  const iniciais = usuario?.nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  // Stats do usuario (dados reais ou placeholders)
  const stats = [
    { label: "Clientes Gerenciados", value: "8" },
    { label: "Empréstimos Ativos", value: "8" },
    { label: "Total Movimentado", value: "R$ 116k" },
  ];

  const userInfo = [
    { label: "Nome Completo", value: usuario?.nome || "Não informado" },
    { label: "E-mail", value: usuario?.email || "Não informado" },
    { label: "Função", value: formatarRole(usuario?.role || "admin") },
    { label: "ID do Usuário", value: `#${usuario?.id_usuario || "N/A"}` },
    { label: "Data de Cadastro", value: "01/01/2024" },
    { label: "Último Acesso", value: new Date().toLocaleString("pt-BR") },
  ];

  const activity = [
    { action: "Novo empréstimo registrado", detail: "Felipe Augusto Nunes — R$ 1.000,00", time: "Hoje, 10:30", dot: "bg-indigo-500" },
    { action: "Pagamento recebido", detail: "Ana Carolina Ferreira — R$ 200,00", time: "Hoje, 09:15", dot: "bg-emerald-500" },
    { action: "Cliente cadastrado", detail: "Henrique Vieira Pinto", time: "Ontem, 14:20", dot: "bg-violet-500" },
    { action: "Empréstimo marcado em atraso", detail: "Carla Beatriz Lima — R$ 3.000,00", time: "02/07, 08:00", dot: "bg-red-500" },
    { action: "Parcela recebida", detail: "Elaine Barbosa Santos — R$ 250,00", time: "01/07, 15:45", dot: "bg-emerald-500" },
  ];

  if (carregando) {
    return <SkeletonDetalhes />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      {/* Profile header card */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="h-28 relative" style={{ background: "linear-gradient(135deg, #4338ca 0%, #4f46e5 50%, #6366f1 100%)" }}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at 70% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)" }} />
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div
              className="w-20 h-20 rounded-2xl font-bold text-2xl flex items-center justify-center border-4 border-card shadow-lg"
              style={{ background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)", color: "#4338ca" }}
            >
              {iniciais}
            </div>
            <div className="flex gap-2 pb-1">
              <button className="px-3 py-1.5 border border-border rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                Editar Perfil
              </button>
              <button className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                Alterar Senha
              </button>
            </div>
          </div>
          <h2 className="text-xl font-bold text-foreground leading-none mb-1">{usuario?.nome || "Usuário"}</h2>
          <p className="text-sm text-muted-foreground">{formatarRole(usuario?.role || "admin")}</p>
          <div className="flex items-center gap-4 mt-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online agora
            </span>
            <span className="text-xs text-muted-foreground">Membro desde Janeiro de 2024</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-2xl border border-border p-4 text-center shadow-sm">
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* User info */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
        <h3 className="font-bold text-foreground mb-4">Informações do Usuário</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {userInfo.map((item) => (
            <div key={item.label} className="p-3.5 bg-muted/30 rounded-xl border border-border/50">
              <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">{item.label}</p>
              <p className="text-sm font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity history */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
        <h3 className="font-bold text-foreground mb-4">Histórico de Atividades</h3>
        <div className="space-y-1">
          {activity.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors">
              <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${item.dot}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{item.action}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0 pt-0.5">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/")}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-card border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar ao Início
        </button>
        <button
          onClick={handleLogout}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <LogOut size={16} />
          Sair do Sistema
        </button>
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