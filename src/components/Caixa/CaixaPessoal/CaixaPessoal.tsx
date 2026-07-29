import { useCofre } from '../../../hooks/useCofre';
import HeaderCaixa from './HeaderCaixa';
import CardSaldo from './CardSaldo';
import GridResumo from './GridResumo';
import ControleCofre from './ControleCofre';
import ListaHistorico from './ListaHistorico';
import ListaContas from './ListaContas';
import { useContas } from '../../../hooks/useContas';
import useMovimentacoes from '../../../hooks/useMovimentacoes';
import type { ResumoCaixaPessoalDTO } from '../../../interface/CaixaPessoalDTO';

// ============================================================
// CaixaPessoal — orquestrador principal do módulo
// Responsabilidade: compor os blocos e distribuir dados.
// NÃO possui lógica financeira — apenas orquestra.
//
// Sprint 1: estrutura base ✅
// Sprint 2: cofre físico com persistência ✅
// Sprint 3: movimentações reais (hook useMovimentacoes)
// Sprint 4: contas e reservas (hook useContas)
// Sprint 5: metas e projeções (hook useMetas)
// ============================================================

function CaixaPessoal() {
  const cofre = useCofre();
  const { contas, proximasContas, contasAtrasadas, vencendoHoje } = useContas();
  const { movimentacoes, entradas, saidas } = useMovimentacoes();

  // Calcula reservado a partir das contas não pagas do tipo 'pagar'
  const reservado = contas
    .filter((c) => c.tipo === 'pagar' && !c.pago)
    .reduce((acc, c) => acc + Number(c.valor || 0), 0);

  // saldoAtual considera cofre + entradas - saídas
  const saldoAtual = cofre.total + entradas - saidas;

  // disponivel = saldoAtual menos o reservado
  const disponivel = saldoAtual - reservado;

  const resumo: ResumoCaixaPessoalDTO = {
    saldoAtual,
    entradas,
    saidas,
    reservado,
    disponivel,
  };

  return (
    <div className="space-y-6">

      {/* Cabeçalho do módulo */}
      <HeaderCaixa />

      {/* Card de saldo — atualizado com saldoAtual calculado */}
      <CardSaldo saldo={saldoAtual} />

      {/* Hoje — resumo rápido para ação imediata (mobile-first) */}
      <div className="bg-card rounded-2xl border border-border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Hoje</h3>
          <p className="text-xs text-muted-foreground">O que precisa de atenção agora</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="px-3 py-2 bg-muted rounded-lg text-sm">
            <div className="font-semibold">{vencendoHoje.length}</div>
            <div className="text-xs text-muted-foreground">Vencem hoje</div>
          </div>

          <div className="px-3 py-2 bg-muted rounded-lg text-sm">
            <div className="font-semibold">{contasAtrasadas.length}</div>
            <div className="text-xs text-muted-foreground">Atrasadas</div>
          </div>

          <div className="px-3 py-2 bg-muted rounded-lg text-sm">
            <div className="font-semibold">{proximasContas.length}</div>
            <div className="text-xs text-muted-foreground">Próximos 7 dias</div>
          </div>

          <div className="px-3 py-2 bg-muted rounded-lg text-sm">
            <div className="font-semibold">R$ {reservado.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Reservado</div>
          </div>
        </div>
      </div>

      {/* Grid com 4 cards de resumo */}
      <GridResumo resumo={resumo} />

      {/* Cofre físico — Sprint 2 */}
      <ControleCofre cofre={cofre} />

      {/* Histórico de movimentações (Sprint 3) */}
      <ListaHistorico movimentacoes={movimentacoes} />

      {/* Contas e Reservas (Sprint 4) */}
      <ListaContas />

      {/* Futuro: metas, projeções e filtros (Sprint 5+) */}

    </div>
  );
}

export default CaixaPessoal;