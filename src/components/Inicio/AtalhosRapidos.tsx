import { useNavigate } from 'react-router-dom';
import { CreditCard, Users, Wallet, Calendar } from 'lucide-react';

export function AtalhosRapidos() {
  const navigate = useNavigate();

  // As 4 opções solicitadas: Cliente, Empréstimo, Caixa e Calendário
  const atalhos = [
    {
      label: 'Cliente',
      icon: Users,
      path: '/clientes',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40',
      description: 'Cadastros & Lista',
    },
    {
      label: 'Empréstimo',
      icon: CreditCard,
      path: '/emprestimos',
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/40',
      description: 'Gerenciar & Criar',
    },
    {
      label: 'Caixa',
      icon: Wallet,
      path: '/caixa',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40',
      description: 'Fluxo & Contas',
    },
    {
      label: 'Calendário',
      icon: Calendar,
      path: '/calendario',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
      description: 'Agenda & Contas',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold tracking-wide text-foreground">Ações Principais</h3>
      </div>

      {/* Grid responsiva de 4 colunas */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {atalhos.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 sm:p-3.5 rounded-2xl bg-card border border-border hover:border-primary/50 shadow-sm active:scale-95 transition-all text-center group"
            >
              <div className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border ${item.color} group-hover:scale-110 transition-transform`}>
                <IconComponent size={20} className="sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="text-[11px] sm:text-xs font-bold text-foreground block leading-tight truncate">
                  {item.label}
                </span>
                <span className="text-[10px] text-muted-foreground hidden sm:block mt-0.5">
                  {item.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AtalhosRapidos;
