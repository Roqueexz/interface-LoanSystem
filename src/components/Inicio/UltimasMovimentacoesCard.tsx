import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, ChevronRight, Receipt, ShoppingBag, Landmark, Coffee } from 'lucide-react';
import type { MovimentacaoCaixaPessoalDTO } from '../../interface/CaixaPessoalDTO';
import { formatarMoeda } from '../../services/Utilitario';

interface UltimasMovimentacoesCardProps {
  movimentacoes: MovimentacaoCaixaPessoalDTO[];
  visivel: boolean;
}

export function UltimasMovimentacoesCard({ movimentacoes, visivel }: UltimasMovimentacoesCardProps) {
  const navigate = useNavigate();

  const formatar = (valor: number) => (visivel ? formatarMoeda(valor) : 'R$ •••••');
  const ultimas = movimentacoes.slice(0, 5);

  const getIconForCategoria = (categoria: string, tipo: string) => {
    const cat = categoria.toLowerCase();
    if (cat.includes('mercado') || cat.includes('alimentacao')) return <Coffee size={16} />;
    if (cat.includes('emprestimo') || cat.includes('parcela')) return <Landmark size={16} />;
    if (cat.includes('compra') || cat.includes('loja')) return <ShoppingBag size={16} />;
    return tipo === 'entrada' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold tracking-wide text-foreground">Últimas Movimentações</h3>
        <button
          type="button"
          onClick={() => navigate('/caixa')}
          className="text-xs font-semibold text-primary flex items-center hover:underline"
        >
          Ver histórico <ChevronRight size={14} />
        </button>
      </div>

      <div className="rounded-3xl border border-border bg-card p-2 shadow-sm">
        {ultimas.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
            <Receipt size={32} className="mb-2 opacity-40" />
            <p className="text-xs">Nenhuma movimentação recente registrada.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {ultimas.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate('/caixa')}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                      item.tipo === 'entrada'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {getIconForCategoria(item.categoria, item.tipo)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground line-clamp-1">{item.categoria}</h4>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      {item.descricao || item.data}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-extrabold block ${
                      item.tipo === 'entrada'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-foreground'
                    }`}
                  >
                    {item.tipo === 'entrada' ? '+' : '-'} {formatar(item.valor)}
                  </span>
                  <span className="text-[10px] text-muted-foreground block">{item.data}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UltimasMovimentacoesCard;
