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
  Menu,
  User,
  Shield,
} from "lucide-react";
import NotificacoesRequests from "../../fetch/NotificacoesRequests";
import MenuDrawer from "./MenuDrawer";

function Navegacao() {
  const location = useLocation();
  const [naoLidas, setNaoLidas] = useState(0);
  const [drawerAberto, setDrawerAberto] = useState(false);

  const role = localStorage.getItem('role');
  const nome = localStorage.getItem('nome') || 'Usuário';
  const iniciais = nome
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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
    { to: "/emprestimos", icon: CreditCard, label: "Empréstimos" },
    { to: "/clientes", icon: Users, label: "Clientes" },
    { to: "/caixa", icon: Wallet, label: "Caixa" },
    { to: "/dashboard", icon: BarChart2, label: "Dashboard" },
    { to: "/calendario", icon: Calendar, label: "Calendário" },
    { to: "/notificacoes", icon: Bell, label: "Notificações" },
    ...(role === 'admin' ? [{ to: "/admin", icon: Shield, label: "⚡ Admin" }] : []),
  ];

  return (
    <>
      <nav className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
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

            {/* Desktop Nav Links */}
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

            {/* Avatar do usuário (Desktop) — acesso rápido ao Perfil */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/perfil"
                title={`Perfil de ${nome}`}
                aria-label="Ir para o perfil"
                className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold text-sm text-white shadow-sm transition-all hover:scale-105 active:scale-95 ring-2 ring-transparent hover:ring-primary/40 ${
                  location.pathname === '/perfil' ? 'ring-primary/60' : ''
                }`}
                style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
              >
                {iniciais || <User size={14} />}
              </Link>
            </div>

            {/* Mobile Header: Hamburger Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDrawerAberto(true)}
                className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card hover:bg-muted active:scale-95 transition-all text-foreground"
                aria-label="Abrir menu principal"
                title="Menu"
              >
                <Menu size={20} />
                {naoLidas > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-background">
                    {naoLidas > 9 ? "9+" : naoLidas}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu Drawer Mobile */}
      <MenuDrawer
        isOpen={drawerAberto}
        onClose={() => setDrawerAberto(false)}
        naoLidas={naoLidas}
      />
    </>
  );
}

export default Navegacao;
