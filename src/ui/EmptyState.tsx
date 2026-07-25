import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

// ============================================================
// EmptyState — componente global reutilizável
// Colocado em ui/ pois será usado em múltiplos módulos.
// Qualquer lista vazia do sistema pode usar este componente.
// ============================================================

interface EmptyStateProps {
  mensagem: string;
  descricao?: string;
  icone?: ReactNode;
}

function EmptyState({ mensagem, descricao, icone }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-3">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
        {icone ?? <Inbox size={26} className="text-muted-foreground/50" />}
      </div>
      <p className="font-semibold text-foreground text-sm">{mensagem}</p>
      {descricao && (
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          {descricao}
        </p>
      )}
    </div>
  );
}

export default EmptyState;