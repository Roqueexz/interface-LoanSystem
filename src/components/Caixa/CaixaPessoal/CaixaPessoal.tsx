import { useState } from 'react';
import { History, ChevronRight, Lock } from 'lucide-react';
import { useCofre } from '../../../hooks/useCofre';
import { useContas } from '../../../hooks/useContas';
import useMovimentacoes from '../../../hooks/useMovimentacoes';

import CardSaldo from './CardSaldo';
import CaixinhasCard from './CaixinhasCard';
import DrawerHistoricoMovimentacoes from './DrawerHistoricoMovimentacoes';
import PainelMetasEContas from './PainelMetasEContas';
import ControleCofre from './ControleCofre';

function CaixaPessoal() {
  const cofre = useCofre();
  const { contas } = useContas();
  const { movimentacoes, entradas, saidas } = useMovimentacoes();

  const [drawerHistoricoAberto, setDrawerHistoricoAberto] = useState(false);
  const [cofreAberto, setCofreAberto] = useState(false);

  // Calcula reservado a partir das contas não pagas do tipo 'pagar'
  const reservado = contas
    .filter((c) => c.tipo === 'pagar' && !c.pago)
    .reduce((acc, c) => acc + Number(c.valor || 0), 0);

  // saldoAtual considera cofre + entradas - saídas
  const saldoAtual = cofre.total + entradas - saidas;

  // disponivel = saldoAtual menos o reservado
  const disponivel = saldoAtual - reservado;

  return (
    <div className="space-y-6 pb-20">

      {/* Header do Caixa Pessoal com Botão de Extrato (Drawer) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border border-border p-5 rounded-3xl shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            Estilo Nubank
          </span>
          <h2 className="text-xl font-extrabold text-foreground mt-1">Caixa Pessoal & Reservas</h2>
          <p className="text-xs text-muted-foreground">Administre seu dinheiro, caixinhas e faturas pessoais</p>
        </div>

        <button
          type="button"
          onClick={() => setDrawerHistoricoAberto(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-muted/60 hover:bg-muted px-4 py-2.5 text-xs font-bold text-foreground active:scale-95 transition-all shadow-sm"
        >
          <History size={16} className="text-primary" />
          Ver Extrato Completo
        </button>
      </div>

      {/* Card de Saldo Principal */}
      <CardSaldo saldo={saldoAtual} />

      {/* Caixinhas de Reserva (Nubank Style) */}
      <CaixinhasCard />

      {/* Painel Dedicado de Contas e Metas Pessoais (com alerta de saldo insuficiente) */}
      <PainelMetasEContas saldoDisponivel={disponivel} />

      {/* Cofre Físico (Accordion expansível para economizar espaço) */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setCofreAberto(!cofreAberto)}
          className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <Lock size={16} className="text-amber-500" />
            <span>Cofre Físico (Gestão de Cédulas)</span>
          </div>
          <ChevronRight size={16} className={`text-muted-foreground transition-transform ${cofreAberto ? 'rotate-90' : ''}`} />
        </button>

        {cofreAberto && (
          <div className="p-4 border-t border-border">
            <ControleCofre cofre={cofre} />
          </div>
        )}
      </div>

      {/* Drawer de Histórico Retrátil */}
      <DrawerHistoricoMovimentacoes
        isOpen={drawerHistoricoAberto}
        onClose={() => setDrawerHistoricoAberto(false)}
        movimentacoes={movimentacoes}
      />

    </div>
  );
}

export default CaixaPessoal;