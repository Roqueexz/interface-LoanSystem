import { TrendingUp } from "lucide-react";
import { formatarMoeda } from "../../../services/Utilitario";

interface CardSaldoProps {
  saldo: number;
}

// ============================================================
// CardSaldo — card principal do módulo
// Destaque visual maior que os CardResumo.
// Sprint 2: somará o total do cofre físico ao saldo.
// Sprint 4: exibirá separação entre disponível e reservado.
// ============================================================

function CardSaldo({ saldo }: CardSaldoProps) {
  return (
    <div
      className="rounded-2xl p-6 shadow-sm border border-indigo-200 dark:border-indigo-500/20"
      style={{ background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-indigo-100">Saldo Atual</p>
        <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
          <TrendingUp size={18} className="text-white" />
        </div>
      </div>

      <p className="text-3xl font-bold text-white tracking-tight">
        {formatarMoeda(saldo)}
      </p>

      <p className="text-xs text-indigo-200 mt-2">
        Dinheiro físico + movimentações registradas
      </p>
    </div>
  );
}

export default CardSaldo;