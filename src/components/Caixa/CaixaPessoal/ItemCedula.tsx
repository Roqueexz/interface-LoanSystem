import { Minus, Plus, Loader2 } from 'lucide-react';
import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { formatarMoeda } from '../../../services/Utilitario';
import type { EstadoCedula } from '../../../hooks/useCofre';

interface ItemCedulaProps {
  cedula: EstadoCedula;
  onIncrementar: (valor: number) => void;
  onDecrementar: (valor: number) => void;
  onQuantidadeChange: (valor: number, quantidade: number) => void;
  mostrarValores?: boolean;
}

// Cores inspiradas nas cédulas reais do Real + paleta Nubank/C6
const CEDULA_STYLE: Record<number, { bg: string; accent: string; label: string }> = {
  200: { bg: 'from-zinc-700 to-zinc-900', accent: 'border-amber-400/30', label: 'Lobo-guará' },
  100: { bg: 'from-sky-500 to-blue-600', accent: 'border-sky-300/40', label: 'Azul' },
  50:  { bg: 'from-amber-600 to-orange-600', accent: 'border-amber-300/40', label: 'Castanho' },
  20:  { bg: 'from-amber-400 to-yellow-500', accent: 'border-amber-200/50', label: 'Amarelo' },
  10:  { bg: 'from-red-500 to-rose-600', accent: 'border-red-300/40', label: 'Vermelho' },
  5:   { bg: 'from-violet-500 to-purple-600', accent: 'border-violet-300/40', label: 'Roxo' },
  2:   { bg: 'from-slate-600 to-slate-800', accent: 'border-slate-300/30', label: 'Azul-acinzentado' },
};

function ItemCedula({ cedula, onIncrementar, onDecrementar, onQuantidadeChange, mostrarValores = true }: ItemCedulaProps) {
  const [quantidadeInput, setQuantidadeInput] = useState(String(cedula.quantidade));
  const subtotal = cedula.valor_cedula * cedula.quantidade;
  const temQuantidade = cedula.quantidade > 0;
  const style = CEDULA_STYLE[cedula.valor_cedula] ?? CEDULA_STYLE[2];

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value.replace(/\D/g, '');
    setQuantidadeInput(value === '' ? '' : String(Number(value)));
  }

  async function handleCommitQuantidade() {
    const novaQuantidade = quantidadeInput === '' ? 0 : Number(quantidadeInput);
    if (Number.isNaN(novaQuantidade) || novaQuantidade < 0) return;
    if (novaQuantidade !== cedula.quantidade) {
      await onQuantidadeChange(cedula.valor_cedula, novaQuantidade);
    } else {
      setQuantidadeInput(String(cedula.quantidade));
    }
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') void handleCommitQuantidade();
  }

  useEffect(() => {
    setQuantidadeInput(String(cedula.quantidade));
  }, [cedula.quantidade]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-card p-3 flex flex-col gap-3 transition-all duration-300
        ${temQuantidade
          ? 'border-indigo-200 dark:border-indigo-500/30 shadow-md shadow-indigo-500/10 bg-white dark:bg-zinc-900'
          : 'border-border/60 bg-muted/20 hover:bg-card hover:shadow-sm'
        }`}
    >
      {/* topo: cédula visual */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-10 rounded-xl bg-gradient-to-br ${style.bg} border ${style.accent} flex flex-col items-center justify-center text-white shadow-inner`}>
            <span className="text-[11px] font-black leading-none">R$</span>
            <span className="text-sm font-black leading-none">{cedula.valor_cedula}</span>
          </div>
          <div>
            <p className={`text-sm font-extrabold leading-none ${temQuantidade ? 'text-foreground' : 'text-muted-foreground'}`}>
              {formatarMoeda(cedula.valor_cedula)}
            </p>
            <p className="text-[11px] font-semibold text-muted-foreground">{style?.label}</p>
          </div>
        </div>

        {/* badge de subtotal */}
        <div className={`px-2.5 py-1 rounded-full text-xs font-black border ${temQuantidade ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-muted text-muted-foreground border-transparent'}`}>
          {mostrarValores ? formatarMoeda(subtotal) : '••••'}
        </div>
      </div>

      {/* controles */}
      <div className="flex items-center justify-between gap-2 rounded-xl bg-muted/40 dark:bg-black/20 p-1.5 border border-border/40">
        <button
          onClick={() => onDecrementar(cedula.valor_cedula)}
          disabled={cedula.salvando || cedula.quantidade === 0}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-card border border-border text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 shadow-sm"
          aria-label={`Remover nota de ${formatarMoeda(cedula.valor_cedula)}`}
        >
          <Minus size={16} strokeWidth={2.5} />
        </button>

        <div className="flex-1 flex flex-col items-center">
          <span className="text-[10px] font-extrabold tracking-[0.15em] text-muted-foreground uppercase">Qtd</span>
          {cedula.salvando ? (
            <Loader2 size={18} className="animate-spin text-violet-600 my-1" />
          ) : (
            <input
              type="text"
              inputMode="numeric"
              value={quantidadeInput}
              onChange={handleInputChange}
              onBlur={handleCommitQuantidade}
              onKeyDown={handleInputKeyDown}
              disabled={cedula.salvando}
              className="w-full bg-transparent text-center text-xl font-black text-foreground focus:outline-none"
              aria-label={`Quantidade de notas de ${formatarMoeda(cedula.valor_cedula)}`}
            />
          )}
        </div>

        <button
          onClick={() => onIncrementar(cedula.valor_cedula)}
          disabled={cedula.salvando}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          aria-label={`Adicionar nota de ${formatarMoeda(cedula.valor_cedula)}`}
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* indicador de presença */}
      {temQuantidade && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 shadow shadow-emerald-500/50 animate-pulse" />
      )}
    </div>
  );
}

export default ItemCedula;
