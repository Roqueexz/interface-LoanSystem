import { Minus, Plus, Loader2 } from 'lucide-react';
import { formatarMoeda } from '../../../services/Utilitario';
import type { EstadoCedula } from '../../../hooks/useCofre';

interface ItemCedulaProps {
  cedula: EstadoCedula;
  onIncrementar: (valor: number) => void;
  onDecrementar: (valor: number) => void;
}

// ============================================================
// ItemCedula — linha de controle de uma cédula
// Exibe: valor da nota | botões − e + | quantidade | subtotal
// Feedback visual: spinner enquanto salva, botão desabilitado
// O componente é puro — recebe tudo via props do useCofre.
// ============================================================

function ItemCedula({ cedula, onIncrementar, onDecrementar }: ItemCedulaProps) {
  const subtotal = cedula.valor_cedula * cedula.quantidade;
  const temQuantidade = cedula.quantidade > 0;

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
        <div className="w-8 text-center">
          {cedula.salvando ? (
            <Loader2 size={16} className="animate-spin text-indigo-500 mx-auto" />
          ) : (
            <span
              className={`text-sm font-bold ${
                temQuantidade ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {cedula.quantidade}
            </span>
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