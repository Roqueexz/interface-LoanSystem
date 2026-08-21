import type ParcelaDTO from "../interface/ParcelaDTO";
import { BaseRequests } from "./BaseRequests";

class ParcelaRequests extends BaseRequests {
  private endpointParcela = '/api/parcelas';
  private endpointEmprestimo = '/api/emprestimos';

  async listarPorEmprestimo(id_emprestimo: number): Promise<ParcelaDTO[] | undefined> {
    const resposta = await this.request<ParcelaDTO[]>(`${this.endpointEmprestimo}/${id_emprestimo}/parcelas`);
    
    if (!resposta.sucesso) {
      console.error(`[ParcelaRequests] Erro ao listar parcelas do empréstimo ${id_emprestimo}:`, resposta.erro);
      return [];
    }

    // Resposta vazia (204) retorna undefined, tratamos como array vazio
    return resposta.dados || [];
  }

  async buscarPorId(id_parcela: number): Promise<ParcelaDTO | undefined> {
    const resposta = await this.request<ParcelaDTO>(`${this.endpointParcela}/${id_parcela}`);
    
    if (!resposta.sucesso) {
      console.error(`[ParcelaRequests] Erro ao buscar parcela ${id_parcela}:`, resposta.erro);
      return undefined;
    }

    return resposta.dados;
  }

  async pagar(id_parcela: number, data_pagamento?: Date): Promise<boolean> {
    const body: any = {};
    if (data_pagamento) {
      body.data_pagamento = data_pagamento.toISOString();
    }

    const resposta = await this.request<{ mensagem: string }>(`${this.endpointParcela}/${id_parcela}/pagar`, {
      method: 'PATCH',
      body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
    });

    if (!resposta.sucesso) {
      console.error(`[ParcelaRequests] Erro ao pagar parcela ${id_parcela}:`, resposta.erro);
      return false;
    }

    return true;
  }

  async desfazerPagamento(id_parcela: number): Promise<boolean> {
    const resposta = await this.request<{ mensagem: string }>(`${this.endpointParcela}/${id_parcela}/desfazer`, {
      method: 'PATCH',
    });

    if (!resposta.sucesso) {
      console.error(`[ParcelaRequests] Erro ao desfazer pagamento da parcela ${id_parcela}:`, resposta.erro);
      return false;
    }

    return true;
  }

  /**
   * Lista parcelas por status (pagas, pendentes, atrasadas)
   * GET /api/parcelas?status=status
   */
  async listarPorStatus(status: 'pagas' | 'pendentes' | 'atrasadas'): Promise<any[] | undefined> {
    const resposta = await this.request<any[]>(`${this.endpointParcela}?status=${status}`);
    
    if (!resposta.sucesso) {
      console.error(`[ParcelaRequests] Erro ao listar parcelas por status (${status}):`, resposta.erro);
      return undefined;
    }

    return resposta.dados || [];
  }

  /**
   * Lista parcelas pendentes com vencimento no mês corrente
   * GET /api/parcelas/vencendo?mes=&ano=
   */
  async listarParcelasVencendoNoMes(mes?: number, ano?: number): Promise<ParcelaDTO[] | undefined> {
    const params = new URLSearchParams();
    if (mes !== undefined) params.append('mes', String(mes));
    if (ano !== undefined) params.append('ano', String(ano));

    const url = `${this.endpointParcela}/vencendo${params.toString() ? `?${params.toString()}` : ''}`;
    const resposta = await this.request<ParcelaDTO[]>(url);

    if (!resposta.sucesso) {
      console.error('[ParcelaRequests] Erro ao listar parcelas vencendo no mês:', resposta.erro);
      return undefined;
    }

    return resposta.dados || [];
  }
}

export default new ParcelaRequests();