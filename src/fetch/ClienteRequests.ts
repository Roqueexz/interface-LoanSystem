import type ClienteDTO from "../interface/ClienteDTO";
import { BaseRequests } from "./BaseRequests";

class ClienteRequests extends BaseRequests {
  private endpointCliente = '/api/clientes';

  async obterListaDeClientes(): Promise<ClienteDTO[] | undefined> {
    const resposta = await this.request<ClienteDTO[]>(this.endpointCliente);
    
    if (!resposta.sucesso) {
      console.error('[ClienteRequests] Erro ao listar clientes:', resposta.erro);
      return undefined;
    }

    return resposta.dados;
  }

  async obterClientePorId(id_cliente: number): Promise<ClienteDTO | undefined> {
    const resposta = await this.request<ClienteDTO>(`${this.endpointCliente}/${id_cliente}`);
    
    if (!resposta.sucesso) {
      console.error(`[ClienteRequests] Erro ao buscar cliente ${id_cliente}:`, resposta.erro);
      return undefined;
    }

    return resposta.dados;
  }

  async enviarFormularioCliente(formCliente: ClienteDTO): Promise<{ sucesso: boolean; id_cliente?: number }> {
    console.log('[ClienteRequests] Enviando formulario:', formCliente);
    const resposta = await this.request<{ mensagem: string; id_cliente?: number }>(this.endpointCliente, {
      method: 'POST',
      body: JSON.stringify(formCliente),
    });
    
    console.log('[ClienteRequests] Resposta:', resposta);

    if (!resposta.sucesso) {
      console.error('[ClienteRequests] Erro ao cadastrar cliente:', resposta.erro);
      return { sucesso: false };
    }

    return {
      sucesso: true,
      id_cliente: resposta.dados?.id_cliente,
    };
  }

  async atualizarCliente(
    id_cliente: number,
    cliente: ClienteDTO,
  ): Promise<boolean> {
    const resposta = await this.request<{ mensagem: string }>(`${this.endpointCliente}/${id_cliente}`, {
      method: 'PUT',
      body: JSON.stringify(cliente),
    });

    if (!resposta.sucesso) {
      console.error(`[ClienteRequests] Erro ao atualizar cliente ${id_cliente}:`, resposta.erro);
      return false;
    }

    return true;
  }

  async excluirCliente(id_cliente: number): Promise<boolean> {
    const resposta = await this.request<{ mensagem: string }>(`${this.endpointCliente}/${id_cliente}`, {
      method: 'DELETE',
    });

    if (!resposta.sucesso) {
      console.error(`[ClienteRequests] Erro ao excluir cliente ${id_cliente}:`, resposta.erro);
      return false;
    }

    return true;
  }
}

export default new ClienteRequests();