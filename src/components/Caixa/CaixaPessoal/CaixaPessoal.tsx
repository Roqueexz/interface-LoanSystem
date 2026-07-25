import HeaderCaixa from "./HeaderCaixa";
import CardSaldo from "./CardSaldo";
import GridResumo from "./GridResumo";
import ListaHistorico from "./ListaHistorico";
import type { ResumoCaixaPessoalDTO, MovimentacaoCaixaPessoalDTO } from "../../../interface/CaixaPessoalDTO";

// ============================================================
// CaixaPessoal — orquestrador principal do módulo
// Responsabilidade: montar o layout e compor os blocos.
// NÃO possui lógica financeira — apenas orquestra.
//
// Sprint 1: dados estáticos zerados (sem API ainda).
// Sprint 2: receberá bloco do Cofre Físico.
// Sprint 3: receberá filtros e movimentações reais.
// Sprint 4: receberá blocos de Contas e Reservas.
// Sprint 5: receberá Metas e Projeções.
// ============================================================

// Dados iniciais zerados — Sprint 1
// Sprint 3: virão de hook useCaixaPessoal()
const resumoInicial: ResumoCaixaPessoalDTO = {
  saldoAtual: 0,
  entradas: 0,
  saidas: 0,
  reservado: 0,
  disponivel: 0,
};

const movimentacoesIniciais: MovimentacaoCaixaPessoalDTO[] = [];

function CaixaPessoal() {
  return (
    <div className="space-y-6">

      {/* Cabeçalho do módulo */}
      <HeaderCaixa />

      {/* Card de saldo em destaque */}
      <CardSaldo saldo={resumoInicial.saldoAtual} />

      {/* Grid com 4 cards de resumo */}
      <GridResumo resumo={resumoInicial} />

      {/* Sprint 2: <ControleCofre /> será adicionado aqui */}

      {/* Sprint 3: <FiltrosHistorico /> será adicionado aqui */}

      {/* Histórico de movimentações */}
      <ListaHistorico movimentacoes={movimentacoesIniciais} />

      {/* Sprint 4: <ContasAPagar /> e <Reservas /> serão adicionados aqui */}

      {/* Sprint 5: <MetasFinanceiras /> e <ProjecaoSaldo /> serão adicionados aqui */}

    </div>
  );
}

export default CaixaPessoal;