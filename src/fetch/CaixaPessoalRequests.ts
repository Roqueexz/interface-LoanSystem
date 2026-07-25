import type { CofreFisicoDTO, CedulaCofreDTO } from '../interface/CaixaPessoalDTO';
import { BaseRequests } from './BaseRequests';

// ============================================================
// CaixaPessoalRequests — comunicação com /api/caixa-pessoal
// Segue o padrão de BaseRequests usado em CaixaRequests.
// O token JWT é enviado automaticamente pelo BaseRequests.
// O backend extrai o id_usuario do token — nunca do body.
// ============================================================

class CaixaPessoalRequests extends BaseRequests {
  private endpoint = '/api/caixa-pessoal';

  // ─── COFRE: OBTER ──────────────────────────────────────────────────
  async obterCofre(): Promise<CofreFisicoDTO | undefined> {
    const resposta = await this.request<CofreFisicoDTO>(`${this.endpoint}/cofre`);

    if (!resposta.sucesso) {
      console.error('[CaixaPessoalRequests] Erro ao obter cofre:', resposta.erro);
      return undefined;
    }

    return resposta.dados;
  }

  // ─── COFRE: ATUALIZAR CÉDULA ───────────────────────────────────────
  async atualizarCedula(
    valor_cedula: number,
    quantidade: number
  ): Promise<CedulaCofreDTO | undefined> {
    const resposta = await this.request<CedulaCofreDTO>(
      `${this.endpoint}/cofre/${valor_cedula}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ quantidade }),
      }
    );

    if (!resposta.sucesso) {
      console.error('[CaixaPessoalRequests] Erro ao atualizar cédula:', resposta.erro);
      return undefined;
    }

    return resposta.dados;
  }
}

export default new CaixaPessoalRequests();