import { useState } from "react";
import { Wallet, Plus, TrendingUp, TrendingDown, Loader2 } from "lucide-react";

function CaixaPessoal() {
  const [carregando, setCarregando] = useState(false);

  // FUTURO: Implementar com categorias dinâmicas
  // - Adicionar movimentações (entrada/saída)
  // - Criar categorias personalizadas
  // - Ver saldo total
  // - Histórico de transações

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Caixa Pessoal</h2>
          <p className="text-sm text-slate-400">
            Gerencie suas finanças pessoais
          </p>
        </div>
        <button
          disabled
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold opacity-50 cursor-not-allowed"
        >
          <Plus size={18} />
          Nova Movimentação
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-500 font-medium mb-1">Saldo Total</p>
          <p className="text-xl font-bold text-slate-800">R$ 0,00</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 text-center">
          <p className="text-xs text-emerald-600 font-medium mb-1">Entradas</p>
          <p className="text-xl font-bold text-emerald-700">R$ 0,00</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <p className="text-xs text-red-600 font-medium mb-1">Saídas</p>
          <p className="text-xl font-bold text-red-700">R$ 0,00</p>
        </div>
      </div>

      <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
        <Wallet size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">
          Funcionalidade em desenvolvimento
        </p>
        <p className="text-xs mt-1">
          Em breve você poderá gerenciar suas finanças pessoais aqui.
        </p>
      </div>
    </div>
  );
}

export default CaixaPessoal;