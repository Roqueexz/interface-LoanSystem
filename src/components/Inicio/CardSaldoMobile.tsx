import { Eye, EyeOff, ShieldCheck, Wallet, ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';
import { formatarMoeda } from '../../services/Utilitario';
import { useNavigate } from 'react-router-dom';

interface CardSaldoMobileProps {
  saldo: number;
  reservado: number;
  disponivel: number;
  entradasMes: number;
  saidasMes: number;
  visivel: boolean;
  onToggleVisibilidade: () => void;
}

export function CardSaldoMobile({
  saldo,
  reservado,
  disponivel,
  entradasMes,
  saidasMes,
  visivel,
  onToggleVisibilidade,
}: CardSaldoMobileProps) {
  const navigate = useNavigate();
  const formatar = (valor: number) => (visivel ? formatarMoeda(valor) : 'R$ •••••');

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 p-6 text-white shadow-xl shadow-indigo-500/20">
      {/* Elementos visuais de fundo estilo fintech */}
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />

      {/* Header do Card */}
      <div className="relative z-10 flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs font-medium text-indigo-100/90">
          <Wallet size={16} className="text-indigo-200" />
          <span>Saldo Total em Conta</span>
        </div>
        <button
          type="button"
          onClick={onToggleVisibilidade}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white"
          title={visivel ? 'Ocultar saldo' : 'Mostrar saldo'}
          aria-label={visivel ? 'Ocultar saldo' : 'Mostrar saldo'}
        >
          {visivel ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Saldo Principal */}
      <div className="relative z-10 my-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
          {formatar(saldo)}
        </h2>
      </div>

      {/* Grid de Sub-indicadores: Disponível e Reservado (Reservado redireciona pro Caixa Pessoal) */}
      <div className="relative z-10 mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-white/15">
        <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-md">
          <span className="text-[11px] font-medium text-indigo-100 block">Disponível</span>
          <span className="text-sm sm:text-base font-bold text-white block mt-0.5">
            {formatar(disponivel)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate('/caixa?tab=pessoal')}
          className="rounded-2xl bg-white/10 p-3 backdrop-blur-md text-left hover:bg-white/20 active:scale-[0.98] transition-all group cursor-pointer border border-white/10 hover:border-amber-300/40"
          title="Ver Caixinhas e Reservas Pessoais"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-amber-300" />
              <span className="text-[11px] font-medium text-indigo-100">Reservado</span>
            </div>
            <ChevronRight size={14} className="text-amber-300/70 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <span className="text-sm sm:text-base font-bold text-amber-200 block mt-0.5">
            {formatar(reservado)}
          </span>
        </button>
      </div>


      {/* Indicadores rápidos de entradas/saídas do mês */}
      <div className="relative z-10 mt-3 flex items-center justify-between text-xs text-indigo-100/90 px-1">
        <div className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
            <ArrowUpRight size={12} />
          </span>
          <span>Entradas: <strong>{formatar(entradasMes)}</strong></span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-400/20 text-rose-300">
            <ArrowDownRight size={12} />
          </span>
          <span>Saídas: <strong>{formatar(saidasMes)}</strong></span>
        </div>
      </div>
    </div>
  );
}

export default CardSaldoMobile;
