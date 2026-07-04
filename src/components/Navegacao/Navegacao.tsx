import { Link, useLocation } from 'react-router-dom';
import { Home, Users, CreditCard, Wallet } from 'lucide-react';

function Navegacao() {
  const location = useLocation();

  const links = [
    { to: '/', icon: Home, label: 'Início' },
    { to: '/clientes', icon: Users, label: 'Clientes' },
    { to: '/emprestimos', icon: CreditCard, label: 'Empréstimos' },
    { to: '/caixa', icon: Wallet, label: 'Caixa' },
  ];

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            LoanSystem
          </Link>

          <div className="flex items-center gap-1">
            {links.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === to
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navegacao;