import { useCofre } from '../../../hooks/useCofre';
import HeaderCaixa from './HeaderCaixa';
import CardSaldo from './CardSaldo';
import GridResumo from './GridResumo';
import ControleCofre from './ControleCofre';
import ListaHistorico from './ListaHistorico';
import ListaContas from './ListaContas';
import type { ResumoCaixaPessoalDTO, MovimentacaoCaixaPessoalDTO } from '../../../interface/CaixaPessoalDTO';

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

// Sprint 1-2: resumo ainda estático
// Sprint 3: virá de hook useMovimentacoes()
const resumoInicial: ResumoCaixaPessoalDTO = {
  saldoAtual: 0,
  entradas: 0,
  saidas: 0,
  reservado: 0,
  disponivel: 0,
};

const movimentacoesIniciais: MovimentacaoCaixaPessoalDTO[] = [];

function CaixaPessoal() {
  const cofre = useCofre();

  // Saldo = total do cofre físico (Sprint 2)
  // Sprint 3: saldo = cofre + entradas - saídas
  const saldoAtual = cofre.total;

  return (
    <div className="space-y-6">

      {/* Cabeçalho do módulo */}
      <HeaderCaixa />

      {/* Card de saldo — atualizado com total do cofre */}
      <CardSaldo saldo={saldoAtual} />

      {/* Grid com 4 cards de resumo */}
      <GridResumo resumo={{ ...resumoInicial, saldoAtual }} />

      {/* Cofre físico — Sprint 2 */}
      <ControleCofre cofre={cofre} />

      {/* Sprint 3: <FiltrosHistorico /> e movimentações reais */}

      {/* Histórico de movimentações */}
      <ListaHistorico movimentacoes={movimentacoesIniciais} />

      {/* Sprint 4: Contas e Reservas */}
      <ListaContas />

      {/* Sprint 5: <MetasFinanceiras /> e <ProjecaoSaldo /> */}

    </div>
  );
}

export default CaixaPessoal;