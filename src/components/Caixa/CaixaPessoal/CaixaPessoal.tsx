import { Wallet, Plus } from "lucide-react";

function CaixaPessoal() {
  // FUTURO: Implementar com categorias dinâmicas
  // - Adicionar movimentações (entrada/saída)
  // - Criar categorias personalizadas
  // - Ver saldo total
  // - Histórico de transações

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">Caixa Pessoal</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie suas finanças pessoais
          </p>
        </div>
        <button
          disabled
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold opacity-50 cursor-not-allowed"
        >
          <Plus size={18} />
          Nova Movimentação
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-muted/50 rounded-xl p-4 text-center">
          <p className="text-xs font-medium text-muted-foreground mb-1">Saldo Total</p>
          <p className="text-xl font-bold text-foreground">R$ 0,00</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4 text-center">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">Entradas</p>
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">R$ 0,00</p>
        </div>
        <div className="bg-red-50 dark:bg-red-500/10 rounded-xl p-4 text-center">
          <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">Saídas</p>
          <p className="text-xl font-bold text-red-700 dark:text-red-400">R$ 0,00</p>
        </div>
      </div>

      <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-xl">
        <Wallet size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">Funcionalidade em desenvolvimento</p>
        <p className="text-xs mt-1">
          Em breve você poderá gerenciar suas finanças pessoais aqui.
        </p>
      </div>
    </div>
  );
}

export default CaixaPessoal;