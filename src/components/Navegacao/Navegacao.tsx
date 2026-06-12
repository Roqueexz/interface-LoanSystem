import type { JSX } from "react";
import { useState } from "react";
import "./Navegacao.module.css";

interface NavegacaoProps {
  onNavegar?: (pagina: string) => void;
  paginaAtiva?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  descricao: string;
}

const menuItems: MenuItem[] = [
  {
    id: "inicio",
    label: "Início",
    icon: "🏠",
    descricao: "Página inicial do sistema",
  },
  {
    id: "clientes",
    label: "Clientes",
    icon: "👥",
    descricao: "Gerenciar clientes",
  },
  {
    id: "emprestimos",
    label: "Empréstimos",
    icon: "💰",
    descricao: "Gerenciar empréstimos",
  },
  {
    id: "novo-cliente",
    label: "Novo Cliente",
    icon: "➕",
    descricao: "Cadastrar novo cliente",
  },
  {
    id: "novo-emprestimo",
    label: "Novo Empréstimo",
    icon: "💵",
    descricao: "Cadastrar novo empréstimo",
  },
  {
    id: "relatorios",
    label: "Relatórios",
    icon: "📊",
    descricao: "Visualizar relatórios",
  },
];

function Navegacao({ onNavegar, paginaAtiva = "inicio" }: NavegacaoProps): JSX.Element {
  const [menuAberto, setMenuAberto] = useState(false);
  const [submenuAberto, setSubmenuAberto] = useState(false);

  const handleNavegacao = (pagina: string) => {
    onNavegar?.(pagina);
    setMenuAberto(false);
  };

  const gruposMenu = {
    principais: menuItems.slice(0, 3),
    secundarios: menuItems.slice(3),
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavegacao("inicio")}>
            <span className="text-2xl">💳</span>
            <span className="text-white font-bold text-lg">LoanSystem</span>
          </div>

          {/* Menu Desktop - Navegação Principal */}
          <div className="hidden md:flex items-center gap-1">
            {gruposMenu.principais.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavegacao(item.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  paginaAtiva === item.id
                    ? "bg-white text-indigo-600 shadow-md"
                    : "text-white hover:bg-white hover:bg-opacity-20"
                }`}
                title={item.descricao}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}

            {/* Submenu - Ações Secundárias */}
            <div className="relative ml-4">
              <button
                onClick={() => setSubmenuAberto(!submenuAberto)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  submenuAberto
                    ? "bg-white text-indigo-600 shadow-md"
                    : "text-white hover:bg-white hover:bg-opacity-20"
                }`}
              >
                <span>⚙️</span>
                <span>Ações</span>
                <span className={`transform transition-transform ${submenuAberto ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              {submenuAberto && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl py-2 min-w-48">
                  {gruposMenu.secundarios.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavegacao(item.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors flex items-center gap-3 ${
                        paginaAtiva === item.id ? "bg-indigo-100 text-indigo-600 font-semibold" : "text-gray-700"
                      }`}
                    >
                      <span>{item.icon}</span>
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.descricao}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Menu Mobile - Hambúrguer */}
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="md:hidden text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            aria-label="Toggle menu"
          >
            <span className="text-2xl">{menuAberto ? "✕" : "☰"}</span>
          </button>
        </div>

        {/* Menu Mobile - Dropdown */}
        {menuAberto && (
          <div className="md:hidden bg-indigo-700 border-t border-indigo-500 py-2">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavegacao(item.id)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                    paginaAtiva === item.id
                      ? "bg-white text-indigo-600 font-semibold"
                      : "text-white hover:bg-indigo-600"
                  }`}
                >
                  <span>{item.icon}</span>
                  <div>
                    <div>{item.label}</div>
                    <div className="text-xs opacity-75">{item.descricao}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navegacao;
