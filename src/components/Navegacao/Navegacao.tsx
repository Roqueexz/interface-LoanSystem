import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  CreditCard,
  Wallet,
  DollarSign,
  BarChart2,
  Calendar,
  Bell,
} from "lucide-react";
import NotificacoesRequests from "../../fetch/NotificacoesRequests";

function Navegacao() {
  const location = useLocation();
  const [naoLidas, setNaoLidas] = useState(0);

  useEffect(() => {
    let isActive = true;

    const carregarResumo = async () => {
      try {
        const dados = await NotificacoesRequests.listar();
        if (isActive && dados) {
          setNaoLidas(dados.resumo.naoLidas);
        }
      } catch (error) {
        console.error("[Navegacao] Não foi possível carregar o resumo de notificações", error);
      }
    };

    carregarResumo();
    return () => {
      isActive = false;
    };
  }, []);

  const links = [
    { to: "/", icon: Home, label: "Início" },
    { to: "/dashboard", icon: BarChart2, label: "Dashboard" },
    { to: "/calendario", icon: Calendar, label: "Calendário" },
    { to: "/notificacoes", icon: Bell, label: "Notificações" },
    { to: "/clientes", icon: Users, label: "Clientes" },
    { to: "/emprestimos", icon: CreditCard, label: "Empréstimos" },
    { to: "/caixa", icon: Wallet, label: "Caixa" },
  ];

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
              }}
            >
              <DollarSign size={16} className="text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-foreground">
              Loan<span className="text-primary">System</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {links.map(({ to, icon: Icon, label }) => {
              const mostrarBadge = to === "/notificacoes" && naoLidas > 0;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === to
                      ? "bg-secondary/50 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon size={14} />
                    <span>{label}</span>
                  </span>
                  {mostrarBadge ? (
                    <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {naoLidas}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu placeholder - sera expandido depois */}
          <div className="md:hidden flex items-center gap-1">
            {links.map(({ to, icon: Icon }) => {
              const mostrarBadge = to === "/notificacoes" && naoLidas > 0;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative p-2 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === to
                      ? "bg-secondary/50 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon size={18} />
                  {mostrarBadge ? (
                    <span className="absolute -right-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                      {naoLidas > 9 ? "9+" : naoLidas}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navegacao;
