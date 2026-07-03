export default interface EmprestimoDTO {
  id_emprestimo?: number;
  id_cliente: number;
  nome_cliente?: string;
  sobrenome_cliente?: string;
  valor_emprestimo: number;
  num_parcelas: number;
  valor_parcela: number;
  tipo_juros: string;
  juros: number;
  data_emprestimo: Date | string;
  data_devolucao?: Date | string;
  forma_pagamento?: string | null;
  status_emprestimo?: boolean;
}