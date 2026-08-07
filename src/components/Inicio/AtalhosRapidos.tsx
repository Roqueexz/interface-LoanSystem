import { useNavigate } from 'react-router-dom';
import { CreditCard, Users, Wallet } from 'lucide-react';

export function AtalhosRapidos() {
  const navigate = useNavigate();

  // Apenas as 3 opções principais solicitadas
  const atalhos = [
    {
      label: 'Empréstimo',
      icon: CreditCard,
      path: '/emprestimos',
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/40',
      description: 'Gerenciar & Criar',
    },
    {
      label: 'Cliente',
      icon: Users,
      path: '/clientes',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40',
      description: 'Cadastros & Lista',
    },
    {
      label: 'Caixa',
      icon: Wallet,
      path: '/caixa',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40',
      description: 'Fluxo & Contas',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold tracking-wide text-foreground">Ações Principais</h3>
      </div>

      {/* Grid responsiva limpa de 3 colunas */}
      <div className="grid grid-cols-3 gap-3">
        {atalhos.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-card border border-border hover:border-primary/50 shadow-sm active:scale-95 transition-all text-center group"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${item.color} group-hover:scale-110 transition-transform`}>
                <IconComponent size={22} />
              </div>
              <div>
                <span className="text-xs font-bold text-foreground block leading-tight">
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
