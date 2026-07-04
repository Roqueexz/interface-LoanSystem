import type ClienteDTO from "./ClienteDTO";
import type EmprestimoDTO from "./EmprestimoDTO";
import type ParcelaDTO from "./ParcelaDTO";

export default interface ResumoClienteDTO {
  cliente: ClienteDTO;
  emprestimos: (EmprestimoDTO & { parcelas: ParcelaDTO[] })[];
  totais: {
    total_emprestado: number;
    total_recebido: number;
    total_em_aberto: number;
    total_atrasado: number;
  };
}