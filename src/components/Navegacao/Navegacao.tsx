import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Menu,
  X,
  TrendingUp,
  UserPlus,
  HandCoins,
} from "lucide-react";

function Navegacao() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    {
      to: "/",
      label: "Início",
      icon: <LayoutDashboard size={18} />,
    },
    {
      to: "/clientes",
      label: "Clientes",
      icon: <Users size={18} />,
    },
    {
      to: "/emprestimos",
      label: "Empréstimos",
      icon: <CreditCard size={18} />,
    },
    {
      to: "/novo-cliente",
      label: "Novo Cliente",
      icon: <UserPlus size={18} />,
    },
    {
      to: "/novo-emprestimo",
      label: "Novo Empréstimo",
      icon: <HandCoins size={18} />,
    },
  ];

  return (
    <nav className="bg-indigo-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white"
          >
            <TrendingUp size={24} />
            <span className="font-semibold text-lg">
              LoanSystem
            </span>
          </button>

          <div className="hidden md:flex items-center gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? "bg-white/20 text-white font-semibold"
                      : "text-indigo-100 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-indigo-700 px-4 py-2 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
                  isActive
                    ? "bg-white/20 text-white font-semibold"
                    : "text-indigo-100 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navegacao;