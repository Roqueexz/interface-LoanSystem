import { Vault, XCircle } from 'lucide-react';
import { formatarMoeda } from '../../../services/Utilitario';
import { SkeletonBase } from '../../../ui/Skeleton';
import ItemCedula from './ItemCedula';
import type { EstadoCedula } from '../../../hooks/useCofre';

// ============================================================
// ControleCofre — container visual do cofre físico
// Recebe os dados via prop "cofre" (retorno do useCofre).
// Desacoplado da API — facilita testes e reutilização.
// ============================================================

interface CofreProps {
  cedulas: EstadoCedula[];
  total: number;
  carregando: boolean;
  erro: string | null;
  incrementar: (valor: number) => Promise<void>;
  decrementar: (valor: number) => Promise<void>;
  atualizarQuantidade: (valor: number, quantidade: number) => Promise<void>;
}

interface Props {
  cofre: CofreProps;
}

function ControleCofre({ cofre }: Props) {
  const { cedulas, total, carregando, erro, incrementar, decrementar, atualizarQuantidade } = cofre;

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Vault size={18} className="text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Cofre Físico</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Total:</span>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {formatarMoeda(total)}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4">

        {/* Estado: carregando */}
        {carregando && (
          <div className="space-y-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <SkeletonBase key={i} height={48} rounded="rounded-xl" />
            ))}
          </div>
        )}

        {/* Estado: erro */}
        {!carregando && erro && (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-red-500 dark:text-red-400">
            <XCircle size={28} />
            <p className="text-sm font-semibold">{erro}</p>
          </div>
        )}

        {/* Estado: dados carregados */}
        {!carregando && !erro && (
          <>
            {/* Header da tabela */}
            <div className="flex items-center justify-between px-4 mb-2">
              <span className="text-xs font-semibold text-muted-foreground w-20">Cédula</span>
              <span className="text-xs font-semibold text-muted-foreground">Quantidade</span>
              <span className="text-xs font-semibold text-muted-foreground w-24 text-right">Subtotal</span>
            </div>

            {/* Lista de cédulas */}
            <div className="space-y-2">
              {cedulas.map((cedula) => (
                <ItemCedula
                  key={cedula.valor_cedula}
                  cedula={cedula}
                  onIncrementar={incrementar}
                  onDecrementar={decrementar}
                  onQuantidadeChange={atualizarQuantidade}
                />
              ))}
            </div>

            {/* Rodapé com total */}
            <div className="flex items-center justify-between px-4 pt-4 mt-2 border-t border-border">
              <span className="text-sm font-bold text-foreground">Total no cofre</span>
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {formatarMoeda(total)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ControleCofre;