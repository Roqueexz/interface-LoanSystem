import { Edit3, Trash2 } from 'lucide-react';
import type { MetaFinanceiraDTO } from '../../../interface/CaixaPessoalDTO';

interface ItemMetaProps {
  meta: MetaFinanceiraDTO;
  onEdit: (meta: MetaFinanceiraDTO) => void;
  onRemove: (id: string) => void;
}

function ItemMeta({ meta, onEdit, onRemove }: ItemMetaProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h4 className="text-sm font-semibold text-foreground">{meta.nome}</h4>
          {meta.descricao ? (
            <p className="text-xs text-muted-foreground mt-1">{meta.descricao}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(meta)}
            className="inline-flex items-center justify-center rounded-full border border-border bg-muted p-2 text-sm text-foreground hover:bg-muted/90"
          >
            <Edit3 size={14} />
          </button>
          <button
            type="button"
            onClick={() => onRemove(meta.id)}
            className="inline-flex items-center justify-center rounded-full border border-border bg-muted p-2 text-sm text-destructive hover:bg-destructive/10"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground mb-3">
        <span>Atual: R$ {meta.valorAtual.toFixed(2)}</span>
        <span>Meta: R$ {meta.valorAlvo.toFixed(2)}</span>
      </div>

      <div className="rounded-xl bg-muted h-2 overflow-hidden mb-3">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, meta.percentual))}%` }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>{meta.percentual.toFixed(2)}% concluído</span>
        {meta.prazo ? (
          <span>{meta.diasRestantes !== undefined ? `${meta.diasRestantes} dia(s) restantes` : `Prazo: ${meta.prazo}`}</span>
        ) : (
          <span>Sem prazo definido</span>
        )}
      </div>
    </div>
  );
}

export default ItemMeta;
