import { BaseRequests } from './BaseRequests';
import type { NotificacaoDTO, PreferenciaNotificacaoDTO } from '../interface/NotificacaoDTO';
import { SERVER_CFG } from '../appConfig';

class NotificacoesRequests extends BaseRequests {
  private endpoint = SERVER_CFG.ENDPOINT_NOTIFICACOES;
  private endpointPreferencias = SERVER_CFG.ENDPOINT_NOTIFICACOES_PREFERENCIAS;

  async listar(): Promise<{ notificacoes: NotificacaoDTO[]; resumo: { total: number; naoLidas: number; criticas: number } } | undefined> {
    const resposta = await this.request<{ notificacoes: NotificacaoDTO[]; resumo: { total: number; naoLidas: number; criticas: number } }>(this.endpoint);
    if (!resposta.sucesso) {
      console.error('[NotificacoesRequests] Erro ao listar notificações', resposta.erro);
      return undefined;
    }
    return resposta.dados;
  }

  async obterPreferencias(): Promise<PreferenciaNotificacaoDTO | undefined> {
    const resposta = await this.request<PreferenciaNotificacaoDTO>(this.endpointPreferencias);
    if (!resposta.sucesso) {
      console.error('[NotificacoesRequests] Erro ao obter preferências', resposta.erro);
      return undefined;
    }
    return resposta.dados;
  }

  async atualizarPreferencias(preferencias: Partial<PreferenciaNotificacaoDTO>): Promise<PreferenciaNotificacaoDTO | undefined> {
    const resposta = await this.request<PreferenciaNotificacaoDTO>(this.endpointPreferencias, {
      method: 'PATCH',
      body: JSON.stringify(preferencias),
    });
    if (!resposta.sucesso) {
      console.error('[NotificacoesRequests] Erro ao atualizar preferências', resposta.erro);
      return undefined;
    }
    return resposta.dados;
  }

  async marcarComoLida(id: number): Promise<boolean | undefined> {
    const resposta = await this.request<{ sucesso: boolean }>(`${this.endpoint}/${id}/ler`, { method: 'PATCH' });
    if (!resposta.sucesso) {
      console.error('[NotificacoesRequests] Erro ao marcar como lida', resposta.erro);
      return undefined;
    }
    return resposta.dados?.sucesso;
  }

  async arquivar(id: number): Promise<boolean | undefined> {
    const resposta = await this.request<{ sucesso: boolean }>(`${this.endpoint}/${id}/arquivar`, { method: 'PATCH' });
    if (!resposta.sucesso) {
      console.error('[NotificacoesRequests] Erro ao arquivar', resposta.erro);
      return undefined;
    }
    return resposta.dados?.sucesso;
  }
}

export default new NotificacoesRequests();