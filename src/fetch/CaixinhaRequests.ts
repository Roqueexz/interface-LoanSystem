import { BaseRequests } from './BaseRequests';
import { SERVER_CFG } from '../appConfig';

export interface CaixinhaDTO {
  id_caixinha: number;
  id_usuario: number;
  nome: string;
  saldo: number;
  meta?: number | null;
  emoji: string;
  cor: string;
  criado_em?: string;
}

export interface CriarCaixinhaInput {
  nome: string;
  meta?: number | null;
  emoji?: string;
  cor?: string;
}

class CaixinhaRequests extends BaseRequests {
  private endpoint = SERVER_CFG.ENDPOINT_CAIXINHAS;

  async listar(): Promise<CaixinhaDTO[] | undefined> {
    const res = await this.request<CaixinhaDTO[]>(this.endpoint);
    if (!res.sucesso) {
      console.error('[CaixinhaRequests] Erro ao listar caixinhas:', res.erro);
      return undefined;
    }
    return res.dados;
  }

  async criar(dados: CriarCaixinhaInput): Promise<CaixinhaDTO | undefined> {
    const res = await this.request<CaixinhaDTO>(this.endpoint, {
      method: 'POST',
      body: JSON.stringify(dados),
    });
    if (!res.sucesso) {
      console.error('[CaixinhaRequests] Erro ao criar caixinha:', res.erro);
      throw new Error(res.erro || 'Erro ao criar caixinha');
    }
    return res.dados;
  }

  async depositar(id_caixinha: number, valor: number): Promise<CaixinhaDTO | undefined> {
    const res = await this.request<CaixinhaDTO>(`${this.endpoint}/${id_caixinha}/depositar`, {
      method: 'PATCH',
      body: JSON.stringify({ valor }),
    });
    if (!res.sucesso) {
      console.error('[CaixinhaRequests] Erro ao depositar:', res.erro);
      throw new Error(res.erro || 'Erro ao depositar na caixinha');
    }
    return res.dados;
  }

  async resgatar(id_caixinha: number, valor: number): Promise<CaixinhaDTO | undefined> {
    const res = await this.request<CaixinhaDTO>(`${this.endpoint}/${id_caixinha}/resgatar`, {
      method: 'PATCH',
      body: JSON.stringify({ valor }),
    });
    if (!res.sucesso) {
      console.error('[CaixinhaRequests] Erro ao resgatar:', res.erro);
      throw new Error(res.erro || 'Erro ao resgatar da caixinha');
    }
    return res.dados;
  }

  async remover(id_caixinha: number): Promise<boolean> {
    const res = await this.request<{ mensagem: string }>(`${this.endpoint}/${id_caixinha}`, {
      method: 'DELETE',
    });
    if (!res.sucesso) {
      console.error('[CaixinhaRequests] Erro ao remover caixinha:', res.erro);
      throw new Error(res.erro || 'Erro ao remover caixinha');
    }
    return true;
  }
}

export default new CaixinhaRequests();
