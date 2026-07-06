import type ResumoClienteDTO from "../interface/ResumoClienteDTO";
import { BaseRequests } from "./BaseRequests";

class ResumoRequests extends BaseRequests {
  private endpointClientes = '/api/clientes';

  async obterResumoCliente(id_cliente: number): Promise<ResumoClienteDTO | undefined> {
    const resposta = await this.request<ResumoClienteDTO>(`${this.endpointClientes}/${id_cliente}/resumo`);
    
    if (!resposta.sucesso) {
      console.error(`[ResumoRequests] Erro ao obter resumo do cliente ${id_cliente}:`, resposta.erro);
      return undefined;
    }

    return resposta.dados;
  }
}

export default new ResumoRequests();