import { BaseRequests } from './BaseRequests';
import { SERVER_CFG } from '../appConfig';

export interface ResumoGlobalDTO {
  totalCredores: number;
  credoresAtivos: number;
  totalClientes: number;
  totalEmprestimos: number;
  volumeTotal: number;
}

export interface CredorDTO {
  id_usuario: number;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
  criado_em: string;
  avatar_url?: string | null;
  total_clientes: number;
  total_emprestimos: number;
  volume_emprestimos: number;
}

export interface CriarCredorInput {
  nome: string;
  email: string;
  senha: string;
}

class AdminRequests extends BaseRequests {
  private endpoint = SERVER_CFG.ENDPOINT_ADMIN;

  async resumo(): Promise<ResumoGlobalDTO | undefined> {
    const res = await this.request<ResumoGlobalDTO>(`${this.endpoint}/resumo`);
    if (!res.sucesso) {
      console.error('[AdminRequests] Erro ao obter resumo:', res.erro);
      return undefined;
    }
    return res.dados;
  }

  async listarCredores(): Promise<CredorDTO[] | undefined> {
    const res = await this.request<CredorDTO[]>(`${this.endpoint}/credores`);
    if (!res.sucesso) {
      console.error('[AdminRequests] Erro ao listar credores:', res.erro);
      return undefined;
    }
    return res.dados;
  }

  async criarCredor(dados: CriarCredorInput): Promise<CredorDTO | undefined> {
    const res = await this.request<CredorDTO>(`${this.endpoint}/credores`, {
      method: 'POST',
      body: JSON.stringify(dados),
    });
    if (!res.sucesso) {
      console.error('[AdminRequests] Erro ao criar credor:', res.erro);
      throw new Error(res.erro || 'Erro ao cadastrar credor');
    }
    return res.dados;
  }

  async suspenderCredor(id_usuario: number): Promise<boolean> {
    const res = await this.request<{ mensagem: string }>(`${this.endpoint}/credores/${id_usuario}/suspender`, {
      method: 'PATCH',
    });
    if (!res.sucesso) {
      console.error('[AdminRequests] Erro ao suspender credor:', res.erro);
      throw new Error(res.erro || 'Erro ao suspender credor');
    }
    return true;
  }

  async reativarCredor(id_usuario: number): Promise<boolean> {
    const res = await this.request<{ mensagem: string }>(`${this.endpoint}/credores/${id_usuario}/reativar`, {
      method: 'PATCH',
    });
    if (!res.sucesso) {
      console.error('[AdminRequests] Erro ao reativar credor:', res.erro);
      throw new Error(res.erro || 'Erro ao reativar credor');
    }
    return true;
  }

  async removerCredor(id_usuario: number): Promise<boolean> {
    const res = await this.request<{ mensagem: string }>(`${this.endpoint}/credores/${id_usuario}`, {
      method: 'DELETE',
    });
    if (!res.sucesso) {
      console.error('[AdminRequests] Erro ao remover credor:', res.erro);
      throw new Error(res.erro || 'Erro ao remover credor');
    }
    return true;
  }
}

export default new AdminRequests();
