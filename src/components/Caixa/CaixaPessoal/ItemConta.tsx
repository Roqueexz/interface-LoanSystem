import { Trash2, Check, Home, Zap, Wifi, Users, FileText, Tag } from 'lucide-react';
import type { ContaCaixaPessoalDTO } from '../../../interface/CaixaPessoalDTO';

interface Props {
  conta: ContaCaixaPessoalDTO;
  onPagar: (id: string) => void;
  onRemover: (id: string) => void;
}

const ICONE_CATEGORIA: Record<string, typeof Home> = {
  Aluguel: Home,
  Energia: Zap,
  Internet: Wifi,
  Funcionários: Users,
  Impostos: FileText,
};

function ItemConta({ conta, onPagar, onRemover }: Props) {
  const venc = conta.vencimento ? conta.vencimento : '';
  let vencFormat = venc;
  if (venc && /^\d{4}-\d{2}-\d{2}$/.test(venc)) {
    const [y, m, d] = venc.split('-');
    vencFormat = `${d}/${m}/${y}`;
  }

  const CategoriaIcon = ICONE_CATEGORIA[conta.categoria ?? ''] ?? Tag;

  const statusLabel = conta.status ? conta.status.charAt(0).toUpperCase() + conta.status.slice(1) : 'Pendente';
  const statusStyles: Record<string, string> = {
    programada: 'bg-slate-100 text-slate-700',
    pendente: 'bg-amber-100 text-amber-800',
    atrasada: 'bg-red-100 text-red-700',
    paga: 'bg-emerald-100 text-emerald-800',
    cancelada: 'bg-muted text-muted-foreground',
  };

  const prioridadeStyles: Record<string, string> = {
    alta: 'bg-red-200 text-red-800',
    media: 'bg-yellow-200 text-yellow-800',
    baixa: 'bg-emerald-200 text-emerald-800',
  };

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-muted border border-border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <CategoriaIcon size={18} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{conta.descricao}</span>
              <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${statusStyles[conta.status ?? 'pendente']}`}>
                {statusLabel}
              </span>
              {conta.prioridade ? (
                <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${prioridadeStyles[conta.prioridade]}`}>
                  {conta.prioridade.charAt(0).toUpperCase() + conta.prioridade.slice(1)}
                </span>
              ) : null}
            </div>
            <div className="text-xs text-muted-foreground">
              {conta.tipo === 'pagar' ? 'A Pagar' : 'A Receber'} · Vence: {vencFormat}
            </div>
            {conta.observacao ? (
              <div className="mt-1 text-xs text-muted-foreground">
                {conta.observacao}
              </div>
            ) : null}
            {conta.tags?.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {conta.tags.map((tag) => (
                  <span key={tag} className="text-[11px] rounded-full bg-muted px-2 py-1 text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-semibold text-foreground">R$ {conta.valor.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">{conta.prioridade ? `Prioridade: ${conta.prioridade}` : 'Sem prioridade'}</div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        {!conta.pago ? (
          <button
            onClick={() => onPagar(conta.id)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:opacity-90"
            title="Marcar como pago"
          >
            <Check size={16} /> Pagar
          </button>
        ) : (
          <span className="text-sm text-success font-semibold">Pago</span>
        )}

        <button
          onClick={() => onRemover(conta.id)}
          className="inline-flex items-center justify-center p-2 rounded-lg border border-border hover:bg-muted"
          title="Remover conta"
        >
          <Trash2 size={16} className="text-destructive" />
        </button>
      </div>
    </div>
  );
}

export default ItemConta;
