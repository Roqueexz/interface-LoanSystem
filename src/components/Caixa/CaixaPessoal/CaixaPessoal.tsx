import { useState } from 'react';
import { History, Sparkles, Wallet, TrendingUp, RefreshCw } from 'lucide-react';
import { useCofre } from '../../../hooks/useCofre';
import { useContas } from '../../../hooks/useContas';
import useMovimentacoes from '../../../hooks/useMovimentacoes';

import CardSaldo from './CardSaldo';
import CaixinhasCard from './CaixinhasCard';
import DrawerHistoricoMovimentacoes from './DrawerHistoricoMovimentacoes';
import PainelMetasEContas from './PainelMetasEContas';
import ControleCofre from './ControleCofre';
import ConciliacaoCofre from './ConciliacaoCofre';

function CaixaPessoal() {
  const cofre = useCofre();
  const { contas } = useContas();
  const { movimentacoes, entradas, saidas, recarregar: recarregarMovimentacoes } = useMovimentacoes();

  const [drawerHistoricoAberto, setDrawerHistoricoAberto] = useState(false);

  const reservado = contas
    .filter((c) => c.tipo === 'pagar' && !c.pago)
    .reduce((acc, c) => acc + Number(c.valor || 0), 0);

  const saldoAtual = cofre.total + entradas - saidas;
  const disponivel = saldoAtual - reservado;

  const handleRefresh = async () => {
    await Promise.all([cofre.recarregar(), recarregarMovimentacoes()]);
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header hero — Nubank/C6 */}
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 p-6 md:p-7 shadow-xl">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(700px circle at 15% 0%, rgba(139,92,246,0.22), transparent 60%), linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          }}
        />
        <div className="absolute inset-0 dark:hidden opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        {/* dark mode fallback */}
        <div className="absolute inset-0 hidden dark:block" style={{ background: 'linear-gradient(135deg, #0f0f12 0%, #1a1033 60%, #0f172a 100%)' }} />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-600 text-white px-3 py-1 text-[11px] font-extrabold tracking-widest shadow-md">
              <Sparkles size={12} /> ESTILO NUBANK • C6 • INTER
            </div>
            <h2 className="text-2xl md:text-[28px] font-black tracking-tight text-foreground dark:text-white mt-3 leading-none">
              Caixa Pessoal & Reservas
            </h2>
            <p className="text-sm font-medium text-muted-foreground dark:text-white/60 mt-1 max-w-xl">
              Seu cofre físico, movimentações e caixinhas num só lugar. Visual premium, controle total do dinheiro em mãos.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1.5 font-bold">
                <Wallet size={14} /> Saldo físico: <b className="text-emerald-800 dark:text-emerald-200">{cofre.carregando ? '...' : `R$ ${cofre.total.toLocaleString('pt-BR')}`}</b>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card dark:bg-white/10 border border-border dark:border-white/10 px-3 py-1.5 font-semibold text-muted-foreground dark:text-white/70">
                <TrendingUp size={14} className="text-violet-600 dark:text-violet-300" /> Disponível: R$ {disponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center">
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border dark:border-white/10 bg-card dark:bg-white/10 hover:bg-muted dark:hover:bg-white/15 px-4 py-2.5 text-xs font-bold text-foreground dark:text-white transition-colors"
              title="Recarregar cofre e movimentações"
            >
              <RefreshCw size={16} className={cofre.carregando ? 'animate-spin' : ''} />
              Atualizar
            </button>
            <button
              type="button"
              onClick={() => setDrawerHistoricoAberto(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground dark:bg-white text-background dark:text-zinc-900 hover:opacity-90 px-5 py-2.5 text-xs font-black shadow-lg active:scale-95 transition-all"
            >
              <History size={16} />
              Ver Extrato
            </button>
          </div>
        </div>
      </div>

      {/* Grid principal: saldo ao lado do cofre no desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-2">
          <CardSaldo saldo={saldoAtual} disponivel={disponivel} reservado={reservado} totalCofre={cofre.total} entradas={entradas} saidas={saidas} />
          <div className="mt-5">
            <CaixinhasCard />
          </div>
        </div>

        <div className="xl:col-span-3 space-y-5">
          {/* Cofre em destaque — nunca mais apagado embaixo, agora é hero */}
          <ControleCofre cofre={cofre} />
          <p className="text-[11px] font-semibold text-muted-foreground text-center">
            Dica C6/Nubank: mantenha o cofre atualizado diariamente para bater com o saldo consolidado.
          </p>
          {/* Conciliação OCR vs Manual — Sprint 15 */}
          <ConciliacaoCofre cofre={cofre} />
        </div>
      </div>

      {/* Painel de contas/metas */}
      <PainelMetasEContas saldoDisponivel={disponivel} />

      <DrawerHistoricoMovimentacoes
        isOpen={drawerHistoricoAberto}
        onClose={() => setDrawerHistoricoAberto(false)}
        movimentacoes={movimentacoes}
      />
    </div>
  );
}

export default CaixaPessoal;
