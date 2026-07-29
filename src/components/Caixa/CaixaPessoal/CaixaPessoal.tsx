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
  const { contas } = useContas();
  const { movimentacoes, entradas, saidas, carregando: carregandoMov } = useMovimentacoes();

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