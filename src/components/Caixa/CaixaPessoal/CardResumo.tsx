import type { ReactNode } from "react";
import { formatarMoeda } from "../../../services/Utilitario";

interface CardResumoProps {
  titulo: string;
  valor: number;
  icone: ReactNode;
  corIcone: "emerald" | "red" | "amber" | "indigo";
}

// ============================================================
// CardResumo — card genérico reutilizável
// Um único componente serve todos os cards de resumo.
// Recebe cor, ícone e valor via props — sem duplicação.
// Segue exatamente o padrão visual do ResumoCaixa.tsx.
// Sprint 3+: valores virão de hook com dados reais.
// ============================================================

const coresMap = {
  emerald: {
    icone: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    valor: "text-emerald-700 dark:text-emerald-400",
  },
  red: {
    icone: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400",
    valor: "text-red-700 dark:text-red-400",
  },
  amber: {
    icone: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
    valor: "text-amber-700 dark:text-amber-400",
  },
  indigo: {
    icone: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    valor: "text-indigo-700 dark:text-indigo-400",
  },
};

function CardResumo({ titulo, valor, icone, corIcone }: CardResumoProps) {
  const cores = coresMap[corIcone];

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cores.icone}`}>
          {icone}
        </div>
      </div>
      <p className="text-xs font-semibold text-muted-foreground mb-1">{titulo}</p>
      <p className={`text-xl font-bold ${cores.valor}`}>{formatarMoeda(valor)}</p>
    </div>
  );
}

export default CardResumo;