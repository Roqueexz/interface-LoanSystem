import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, CheckCircle2, ChevronRight, ArrowUpRight } from 'lucide-react';
import type { ContaCaixaPessoalDTO } from '../../interface/CaixaPessoalDTO';
import { formatarMoeda } from '../../services/Utilitario';

interface ContasHojeCardProps {
  vencendoHoje: ContaCaixaPessoalDTO[];
  atrasadas: ContaCaixaPessoalDTO[];
  proximosRecebimentos: number;
  visivel: boolean;
}

export function ContasHojeCard({
  vencendoHoje,
  atrasadas,
  proximosRecebimentos,
  visivel,
}: ContasHojeCardProps) {
  const navigate = useNavigate();

  const formatar = (valor: number) => (visivel ? formatarMoeda(valor) : 'R$ •••••');
  const temAtencao = vencendoHoje.length > 0 || atrasadas.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold tracking-wide text-foreground">Atenção para Hoje</h3>
        <button
          type="button"
          onClick={() => navigate('/caixa')}
          className="text-xs font-semibold text-primary flex items-center hover:underline"
        >
          Ver todas <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Card Contas Vencendo Hoje */}
        <div
          onClick={() => navigate('/caixa')}
          className={`cursor-pointer rounded-2xl p-4 border transition-all hover:shadow-md active:scale-[0.99] ${
            vencendoHoje.length > 0
              ? 'bg-amber-500/10 border-amber-500/30 dark:bg-amber-950/20'
              : 'bg-card border-border'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`p-2 rounded-xl ${vencendoHoje.length > 0 ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-muted text-muted-foreground'}`}>
                <Clock size={18} />
              </span>
              <div>
                <span className="text-xs font-medium text-muted-foreground block">Vencem Hoje</span>
                <span className="text-lg font-bold text-foreground block">
                  {vencendoHoje.length} {vencendoHoje.length === 1 ? 'conta' : 'contas'}
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="text-muted-foreground" />
          </div>
          {vencendoHoje.length > 0 && (
            <div className="mt-3 pt-2 border-t border-amber-500/20 text-xs font-semibold text-amber-700 dark:text-amber-300 flex justify-between">
              <span>Total hoje:</span>
              <span>{formatar(vencendoHoje.reduce((acc, c) => acc + c.valor, 0))}</span>
            </div>
          )}
        </div>

        {/* Card Contas Atrasadas */}
        <div
          onClick={() => navigate('/caixa')}
          className={`cursor-pointer rounded-2xl p-4 border transition-all hover:shadow-md active:scale-[0.99] ${
            atrasadas.length > 0
              ? 'bg-rose-500/10 border-rose-500/30 dark:bg-rose-950/20'
              : 'bg-card border-border'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`p-2 rounded-xl ${atrasadas.length > 0 ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' : 'bg-muted text-muted-foreground'}`}>
                <AlertCircle size={18} />
              </span>
              <div>
                <span className="text-xs font-medium text-muted-foreground block">Atrasadas</span>
                <span className="text-lg font-bold text-foreground block">
                  {atrasadas.length} {atrasadas.length === 1 ? 'conta' : 'contas'}
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="text-muted-foreground" />
          </div>
          {atrasadas.length > 0 && (
            <div className="mt-3 pt-2 border-t border-rose-500/20 text-xs font-semibold text-rose-700 dark:text-rose-300 flex justify-between">
              <span>Total atrasado:</span>
              <span>{formatar(atrasadas.reduce((acc, c) => acc + c.valor, 0))}</span>
            </div>
          )}
        </div>

        {/* Card Próximos Recebimentos */}
        <div
          onClick={() => navigate('/caixa')}
          className="cursor-pointer rounded-2xl p-4 border border-border bg-card hover:shadow-md transition-all active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight size={18} />
              </span>
              <div>
                <span className="text-xs font-medium text-muted-foreground block">Próximos Recebimentos</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 block">
                  {formatar(proximosRecebimentos)}
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="text-muted-foreground" />
          </div>
          <div className="mt-3 pt-2 border-t border-border text-xs text-muted-foreground">
            {temAtencao ? 'Mantenha os pagamentos organizados' : 'Tudo em dia para hoje! 🎉'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContasHojeCard;
