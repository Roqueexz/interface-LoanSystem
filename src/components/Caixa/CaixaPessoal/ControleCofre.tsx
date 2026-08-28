import { Vault, XCircle, ShieldCheck, Wallet, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { formatarMoeda } from '../../../services/Utilitario';
import { SkeletonBase } from '../../../ui/Skeleton';
import ItemCedula from './ItemCedula';
import type { EstadoCedula } from '../../../hooks/useCofre';

// ============================================================
// ControleCofre — vault premium inspirado em C6 + Nubank + Inter
// - Header em gradiente escuro (C6 carbon) com detalhe roxo Nubank
// - Total em destaque com efeito glow e toggle de visibilidade (Inter)
// - Grid de cédulas com cores das notas reais do Brasil
// - Empty state acolhedor, loading em skeleton shimmer
// - Borda glass + sombra elevada para sair do "apagado embaixo"
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
  const [mostrarValores, setMostrarValores] = useState(true);

  const totalCedulas = cedulas.reduce((acc, c) => acc + c.quantidade, 0);

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.35),0_8px_20px_rgba(79,70,229,0.15)] bg-card">
      {/* Header premium — C6 black + Nubank purple */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(600px circle at 0% 0%, rgba(139,92,246,0.35), transparent 60%), radial-gradient(800px circle at 100% 100%, rgba(245,158,11,0.18), transparent 60%), linear-gradient(135deg, #0f0f12 0%, #1e1b4b 45%, #0f172a 100%)',
          }}
        />
        {/* brilho sutil */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-amber-400/10 blur-2xl" />

        <div className="relative p-6 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/30 ring-1 ring-white/20">
                <Vault size={20} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-extrabold tracking-tight text-white">Cofre Físico</h3>
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white/80">
                    <ShieldCheck size={12} className="text-emerald-300" /> SEGURO
                  </span>
                </div>
                <p className="text-xs font-medium text-white/60 flex items-center gap-1">
                  <Wallet size={12} /> {totalCedulas} cédulas • {cedulas.filter(c => c.quantidade > 0).length} denominações
                </p>
              </div>
            </div>

            <button
              onClick={() => setMostrarValores(v => !v)}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/80 transition-colors"
              aria-label={mostrarValores ? 'Ocultar valores' : 'Mostrar valores'}
            >
              {mostrarValores ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>

          {/* Total em destaque — Inter/Nubank style */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.18em] text-white/50 uppercase flex items-center gap-2">
                <Sparkles size={12} className="text-amber-300" /> Total no cofre
              </p>
              <p className="text-3xl md:text-[34px] font-black tracking-tight text-white leading-none mt-1">
                {mostrarValores ? formatarMoeda(total) : '••••••'}
              </p>
              <p className="text-xs font-medium text-white/50 mt-1">
                {mostrarValores ? 'Contagem física • atualização em tempo real' : 'Toque no olho para revelar'}
              </p>
            </div>

            {/* barra de progresso sutil de cheio */}
            <div className="sm:text-right">
              <p className="text-[11px] font-bold tracking-widest text-white/40 uppercase">Disponibilidade</p>
              <div className="mt-2 w-full sm:w-40 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, (total / 5000) * 100 || 6)}%`,
                    background: 'linear-gradient(90deg, #f59e0b, #8b5cf6)',
                  }}
                />
              </div>
              <p className="text-[11px] font-semibold text-white/50 mt-1">
                {total === 0 ? 'Cofre vazio' : total < 1000 ? 'Saldo baixo' : total < 5000 ? 'Saldo saudável' : 'Cofre cheio'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4 md:p-5 bg-gradient-to-b from-muted/30 to-card">
        {carregando && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <SkeletonBase key={i} height={96} rounded="rounded-2xl" />
            ))}
          </div>
        )}

        {!carregando && erro && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-6">
            <div className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center">
              <XCircle size={22} />
            </div>
            <p className="text-sm font-bold text-red-700 dark:text-red-300">{erro}</p>
            <p className="text-xs text-red-600/70 dark:text-red-300/70 max-w-sm">
              Verifique sua conexão com a API. Se o erro persistir no Render, rode o <code className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">infra/init.sql</code> no Supabase.
            </p>
          </div>
        )}

        {!carregando && !erro && (
          <>
            {/* lista de cédulas em grid premium */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cedulas.map((cedula) => (
                <ItemCedula
                  key={cedula.valor_cedula}
                  cedula={cedula}
                  onIncrementar={incrementar}
                  onDecrementar={decrementar}
                  onQuantidadeChange={atualizarQuantidade}
                  mostrarValores={mostrarValores}
                />
              ))}
            </div>

            {/* rodapé com total reforçado + dica */}
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-indigo-600 dark:bg-indigo-600 px-5 py-4 text-white shadow-lg shadow-indigo-600/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <Vault size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold tracking-widest text-white/70 uppercase">Total físico</p>
                  <p className="text-lg font-black tracking-tight">{mostrarValores ? formatarMoeda(total) : '••••••'}</p>
                </div>
              </div>
              <p className="text-xs font-medium text-white/70 text-center sm:text-right max-w-[220px]">
                Toque em <span className="font-bold text-white">+</span> ou <span className="font-bold text-white">−</span> para ajustar. Digite direto na quantidade.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ControleCofre;
