import { Trash2, Check } from 'lucide-react';
import type { ContaCaixaPessoalDTO } from '../../../interface/CaixaPessoalDTO';

interface Props {
  conta: ContaCaixaPessoalDTO;
  onPagar: (id: string) => void;
  onRemover: (id: string) => void;
}

function ItemConta({ conta, onPagar, onRemover }: Props) {
  const venc = conta.vencimento ? conta.vencimento : '';
  let vencFormat = venc;
  // tenta formatar YYYY-MM-DD para DD/MM/YYYY sem dependências
  if (venc && /^\d{4}-\d{2}-\d{2}$/.test(venc)) {
    const [y, m, d] = venc.split('-');
    vencFormat = `${d}/${m}/${y}`;
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-muted border border-border">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-foreground">{conta.descricao}</span>
        <span className="text-xs text-muted-foreground">{conta.tipo === 'pagar' ? 'A Pagar' : 'A Receber'}</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm font-medium">R$ {conta.valor.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">Vence: {vencFormat}</div>
        </div>

        {!conta.pago ? (
          <button
            onClick={() => onPagar(conta.id)}
            className="px-3 py-2 bg-primary text-white rounded-lg hover:opacity-90"
            title="Marcar como pago"
          >
            <Check size={16} />
          </button>
        ) : (
          <span className="text-sm text-success font-semibold">Pago</span>
        )}

        <button
          onClick={() => onRemover(conta.id)}
          className="p-2 rounded-lg hover:bg-muted"
          title="Remover conta"
        >
          <Trash2 size={16} className="text-destructive" />
        </button>
      </div>
    </div>
  );
}

export default ItemConta;
