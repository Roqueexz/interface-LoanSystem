import { Minus, Plus, Loader2 } from 'lucide-react';
import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { formatarMoeda } from '../../../services/Utilitario';
import type { EstadoCedula } from '../../../hooks/useCofre';

interface ItemCedulaProps {
  cedula: EstadoCedula;
  onIncrementar: (valor: number) => void;
  onDecrementar: (valor: number) => void;
  onQuantidadeChange: (valor: number, quantidade: number) => void;
}

// ============================================================
// ItemCedula — linha de controle de uma cédula
// Exibe: valor da nota | botões − e + | quantidade | subtotal
// Feedback visual: spinner enquanto salva, botão desabilitado
// O componente é puro — recebe tudo via props do useCofre.
// ============================================================

function ItemCedula({ cedula, onIncrementar, onDecrementar, onQuantidadeChange }: ItemCedulaProps) {
  const [quantidadeInput, setQuantidadeInput] = useState(String(cedula.quantidade));
  const subtotal = cedula.valor_cedula * cedula.quantidade;
  const temQuantidade = cedula.quantidade > 0;

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
    if (event.key === 'Enter') {
      void handleCommitQuantidade();
    }
  }

  useEffect(() => {
    setQuantidadeInput(String(cedula.quantidade));
  }, [cedula.quantidade]);

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
        temQuantidade
          ? 'bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20'
          : 'bg-muted/40 border border-transparent'
      }`}
    >
      {/* Valor da cédula */}
      <div className="w-20">
        <span
          className={`text-sm font-bold ${
            temQuantidade
              ? 'text-indigo-700 dark:text-indigo-300'
              : 'text-muted-foreground'
          }`}
        >
          {formatarMoeda(cedula.valor_cedula)}
        </span>
      </div>

      {/* Controles de quantidade */}
      <div className="flex items-center gap-3">
        {/* Botão decrementar */}
        <button
          onClick={() => onDecrementar(cedula.valor_cedula)}
          disabled={cedula.salvando || cedula.quantidade === 0}
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-card border border-border text-muted-foreground hover:text-foreground hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={`Remover nota de ${formatarMoeda(cedula.valor_cedula)}`}
        >
          <Minus size={14} />
        </button>

        {/* Quantidade ou spinner */}
        <div className="w-20 text-center">
          {cedula.salvando ? (
            <Loader2 size={16} className="animate-spin text-indigo-500 mx-auto" />
          ) : (
            <input
              type="number"
              min="0"
              value={quantidadeInput}
              onChange={handleInputChange}
              onBlur={handleCommitQuantidade}
              onKeyDown={handleInputKeyDown}
              disabled={cedula.salvando}
              className="w-full px-2 py-1 rounded-lg border border-border bg-card text-center text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary"
              aria-label={`Quantidade de notas de ${formatarMoeda(cedula.valor_cedula)}`}
            />
          )}
        </div>

        {/* Botão incrementar */}
        <button
          onClick={() => onIncrementar(cedula.valor_cedula)}
          disabled={cedula.salvando}
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-card border border-border text-muted-foreground hover:text-foreground hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={`Adicionar nota de ${formatarMoeda(cedula.valor_cedula)}`}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Subtotal */}
      <div className="w-24 text-right">
        <span
          className={`text-sm font-semibold ${
            temQuantidade
              ? 'text-indigo-700 dark:text-indigo-300'
              : 'text-muted-foreground/50'
          }`}
        >
          {formatarMoeda(subtotal)}
        </span>
      </div>
    </div>
  );
}

export default ItemCedula;