// ============================================================
// CaixaPessoalDTO — tipos de dados do módulo Caixa Pessoal
// Segue o padrão da pasta interface/: apenas dados, sem props.
// Sprints futuras ampliarão estas interfaces.
// Nunca remova campos — apenas adicione.
// ============================================================

// Sprint 1 — Resumo financeiro inicial
export interface ResumoCaixaPessoalDTO {
  saldoAtual: number;
  entradas: number;
  saidas: number;
  reservado: number;
  disponivel: number;
}

// Sprint 2 — Controle do cofre físico
export interface CedulaCofreDTO {
  valor: number; // 2 | 5 | 10 | 20 | 50 | 100 | 200
  quantidade: number;
}

export interface CofreFisicoDTO {
  cedulas: CedulaCofreDTO[];
  total: number;
}

// Sprint 3 — Movimentações
export type TipoMovimentacao = "entrada" | "saida";

export interface MovimentacaoCaixaPessoalDTO {
  id: string;
  tipo: TipoMovimentacao;
  valor: number;
  categoria: string;
  descricao: string;
  data: string; // ISO string
}

// Sprint 4 — Contas e reservas
export type TipoConta = "pagar" | "receber";

export interface ContaCaixaPessoalDTO {
  id: string;
  tipo: TipoConta;
  descricao: string;
  valor: number;
  vencimento: string; // ISO string
  pago: boolean;
}

export interface ReservaDTO {
  id: string;
  nome: string;
  valor: number;
  descricao: string;
}

// Sprint 5 — Metas financeiras
export interface MetaFinanceiraDTO {
  id: string;
  nome: string;
  valorAlvo: number;
  valorAtual: number;
  prazo: string; // ISO string
  descricao: string;
}