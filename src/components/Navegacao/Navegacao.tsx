import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  CreditCard,
  Wallet,
  DollarSign,
  BarChart2,
  Calendar,
} from "lucide-react";

function Navegacao() {
  const location = useLocation();

  const links = [
    { to: "/", icon: Home, label: "Início" },
    { to: "/dashboard", icon: BarChart2, label: "Dashboard" },
    { to: "/calendario", icon: Calendar, label: "Calendário" },
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
            {links.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === to
                    ? "bg-secondary/50 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Icon size={14} />
                  <span>{label}</span>
                </span>
              </Link>
            ))}
          </div>

          {/* Mobile menu placeholder - sera expandido depois */}
          <div className="md:hidden flex items-center gap-1">
            {links.map(({ to, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`p-2 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === to
                    ? "bg-secondary/50 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon size={18} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navegacao;
