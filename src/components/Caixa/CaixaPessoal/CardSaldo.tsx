import { TrendingUp, Eye, EyeOff, Lock, ArrowUpRight, ArrowDownRight, PiggyBank } from "lucide-react";
import { useState } from "react";
import { formatarMoeda } from "../../../services/Utilitario";

interface CardSaldoProps {
  saldo: number;
  disponivel?: number;
  reservado?: number;
  totalCaixinhas?: number;
  totalCofre?: number;
  entradas?: number;
  saidas?: number;
}

// CardSaldo premium — gradiente Nubank + glass C6 + clareza Inter
function CardSaldo({
  saldo,
  disponivel,
  reservado = 0,
  totalCaixinhas = 0,
  totalCofre = 0,
  entradas = 0,
  saidas = 0,
}: CardSaldoProps) {
  const [oculto, setOculto] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-[28px] p-6 md:p-7 shadow-[0_16px_40px_rgba(79,70,229,0.25)] border border-white/20">
      {/* gradiente */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 45%, #4f46e5 100%)" }} />
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-amber-300/20 blur-2xl" />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '18px 18px' }} />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center">
              <TrendingUp size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-extrabold tracking-[0.18em] text-white/70 uppercase">Saldo em Caixinhas & Caixa Pessoal</p>
              <p className="text-[11px] font-semibold text-white/60">Total acumulado em reservas</p>
            </div>
          </div>
          <button
            onClick={() => setOculto(v => !v)}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white transition"
            aria-label={oculto ? 'Mostrar saldo' : 'Ocultar saldo'}
          >
            {oculto ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <p className="text-3xl md:text-4xl font-black tracking-tight text-white mt-5">
          {oculto ? '••••••' : formatarMoeda(saldo)}
        </p>

        {/* breakdown Inter-style */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-2.5">
            <p className="text-[10px] font-extrabold tracking-widest text-white/60 uppercase flex items-center gap-1"><PiggyBank size={11} /> Caixinhas</p>
            <p className="text-xs sm:text-sm font-black text-white mt-1">{oculto ? '••••' : formatarMoeda(totalCaixinhas)}</p>
          </div>
          <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-2.5">
            <p className="text-[10px] font-extrabold tracking-widest text-white/60 uppercase flex items-center gap-1"><Lock size={10} /> Cofre</p>
            <p className="text-xs sm:text-sm font-black text-white mt-1">{oculto ? '••••' : formatarMoeda(totalCofre)}</p>
          </div>
          <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-2.5">
            <p className="text-[10px] font-extrabold tracking-widest text-white/60 uppercase flex items-center gap-1"><ArrowUpRight size={10} className="text-emerald-200" /> Entradas</p>
            <p className="text-xs sm:text-sm font-black text-emerald-100 mt-1">{oculto ? '••••' : formatarMoeda(entradas)}</p>
          </div>
          <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-2.5">
            <p className="text-[10px] font-extrabold tracking-widest text-white/60 uppercase flex items-center gap-1"><ArrowDownRight size={10} className="text-red-200" /> Saídas</p>
            <p className="text-xs sm:text-sm font-black text-red-100 mt-1">{oculto ? '••••' : formatarMoeda(saidas)}</p>
          </div>
        </div>

        {disponivel !== undefined && (
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-white text-zinc-900 px-4 py-3 shadow-lg">
            <div>
              <p className="text-[10px] font-extrabold tracking-widest text-zinc-500 uppercase">Disponível p/ gastar</p>
              <p className="text-base font-black tracking-tight">{oculto ? '••••••' : formatarMoeda(disponivel)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Reservado</p>
              <p className="text-sm font-bold text-amber-600">{oculto ? '••••' : formatarMoeda(reservado)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CardSaldo;
