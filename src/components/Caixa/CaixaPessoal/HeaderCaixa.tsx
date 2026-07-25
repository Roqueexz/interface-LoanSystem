import { Wallet } from "lucide-react";

// ============================================================
// HeaderCaixa — cabeçalho do módulo Caixa Pessoal
// Componente puramente visual, sem lógica.
// Sprint 5: poderá receber ações (exportar relatório, config).
// ============================================================

function HeaderCaixa() {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
        <Wallet size={24} className="text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground">Caixa Pessoal</h2>
        <p className="text-sm text-muted-foreground">
          Gerencie seu dinheiro pessoal, reservas e movimentações.
        </p>
      </div>
    </div>
  );
}

export default HeaderCaixa;