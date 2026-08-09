import { X, ArrowUpRight, ArrowDownRight, History, Calendar } from 'lucide-react';
import type { MovimentacaoCaixaPessoalDTO } from '../../../interface/CaixaPessoalDTO';
import { formatarMoeda } from '../../../services/Utilitario';

interface DrawerHistoricoMovimentacoesProps {
  isOpen: boolean;
  onClose: () => void;
  movimentacoes: MovimentacaoCaixaPessoalDTO[];
}

export function DrawerHistoricoMovimentacoes({
  isOpen,
  onClose,
  movimentacoes,
}: DrawerHistoricoMovimentacoesProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-card border-l border-border h-full flex flex-col justify-between shadow-2xl animate-slideLeft">
        
        {/* Header do Drawer */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <History size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-foreground">Extrato de Movimentações</h3>
              <p className="text-xs text-muted-foreground">Histórico recente de entradas e saídas</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground active:scale-95 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Corpo com Lista de Movimentações */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {movimentacoes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground my-auto">
              <History size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-xs font-semibold">Nenhuma movimentação registrada.</p>
            </div>
          ) : (
            movimentacoes.map((item, idx) => {
              const isEntrada = item.tipo === 'entrada';

              return (
                <div
                  key={item.id || idx}
                  className="flex items-center justify-between rounded-2xl border border-border p-3.5 bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        isEntrada
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isEntrada ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-foreground block line-clamp-1">
                        {item.descricao || item.categoria || 'Movimentação'}
                      </span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5 flex items-center gap-1">
                        <Calendar size={10} />
                        {item.data ? new Date(item.data).toLocaleDateString('pt-BR') : 'Hoje'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-extrabold block ${
                        isEntrada ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'
                      }`}
                    >
                      {isEntrada ? '+' : '-'} {formatarMoeda(Number(item.valor))}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground capitalize block">
                      {item.categoria || (isEntrada ? 'Entrada' : 'Saída')}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer do Drawer */}
        <div className="p-4 border-t border-border bg-muted/20 text-center text-xs text-muted-foreground">
          {movimentacoes.length} registros listados no extrato
        </div>
      </div>
    </div>
  );
}

export default DrawerHistoricoMovimentacoes;
