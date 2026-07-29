import type { CofreFisicoDTO, CedulaCofreDTO, ContaCaixaPessoalDTO, MovimentacaoCaixaPessoalDTO } from '../interface/CaixaPessoalDTO';
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

  // ─── CONTAS: LISTAR ───────────────────────────────────────────────
  async listarContas(): Promise<ContaCaixaPessoalDTO[] | undefined> {
    const resposta = await this.request<any[]>(`${this.endpoint}/contas`);

    if (!resposta.sucesso) {
      console.error('[CaixaPessoalRequests] Erro ao listar contas:', resposta.erro);
      return undefined;
    }

    // Mapeia o formato do backend para os DTOs do frontend
    const dados = resposta.dados || [];
    return dados.map((d: any) => ({
      id: String(d.id_conta ?? d.id),
      tipo: d.tipo,
      descricao: d.descricao,
      valor: Number(d.valor),
      vencimento: d.vencimento,
      pago: Boolean(d.pago),
    }));
  }

  // ─── CONTAS: CRIAR ───────────────────────────────────────────────
  async criarConta(payload: { tipo: string; descricao: string; valor: number; vencimento: string }) {
    const resposta = await this.request<any>(`${this.endpoint}/contas`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!resposta.sucesso) {
      console.error('[CaixaPessoalRequests] Erro ao criar conta:', resposta.erro);
      return undefined;
    }

    const d = resposta.dados;
    return {
      id: String(d.id_conta ?? d.id),
      tipo: d.tipo,
      descricao: d.descricao,
      valor: Number(d.valor),
      vencimento: d.vencimento,
      pago: Boolean(d.pago),
    };
  }

  // ─── CONTAS: PAGAR ───────────────────────────────────────────────
  async pagarConta(id_conta: string): Promise<boolean> {
    const resposta = await this.request(`${this.endpoint}/contas/${id_conta}/pagar`, {
      method: 'PATCH',
    });

    if (!resposta.sucesso) {
      console.error('[CaixaPessoalRequests] Erro ao pagar conta:', resposta.erro);
      return false;
    }

    return true;
  }

  // ─── CONTAS: REMOVER ─────────────────────────────────────────────
  async removerConta(id_conta: string): Promise<boolean> {
    const resposta = await this.request(`${this.endpoint}/contas/${id_conta}`, {
      method: 'DELETE',
    });

    if (!resposta.sucesso) {
      console.error('[CaixaPessoalRequests] Erro ao remover conta:', resposta.erro);
      return false;
    }

    return true;
  }

  // ─── MOVIMENTAÇÕES: LISTAR ───────────────────────────────────────
  async listarMovimentacoes(): Promise<MovimentacaoCaixaPessoalDTO[] | undefined> {
    const resposta = await this.request<any[]>(`${this.endpoint}/movimentacoes`);

    if (!resposta.sucesso) {
      console.error('[CaixaPessoalRequests] Erro ao listar movimentações:', resposta.erro);
      return undefined;
    }

    const dados = resposta.dados || [];
    return dados.map((d: any) => ({
      id: String(d.id_movimentacao ?? d.id),
      tipo: d.tipo,
      valor: Number(d.valor),
      categoria: d.categoria,
      descricao: d.descricao || '',
      data: d.data,
    }));
  }

  // ─── MOVIMENTAÇÕES: CRIAR ────────────────────────────────────────
  async criarMovimentacao(payload: { tipo: string; valor: number; categoria: string; descricao?: string; data?: string }) {
    const resposta = await this.request<any>(`${this.endpoint}/movimentacoes`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!resposta.sucesso) {
      console.error('[CaixaPessoalRequests] Erro ao criar movimentação:', resposta.erro);
      return undefined;
    }

    const d = resposta.dados;
    return {
      id: String(d.id_movimentacao ?? d.id),
      tipo: d.tipo,
      valor: Number(d.valor),
      categoria: d.categoria,
      descricao: d.descricao || '',
      data: d.data,
    };
  }

  // ─── MOVIMENTAÇÕES: REMOVER ──────────────────────────────────────
  async removerMovimentacao(id_movimentacao: string): Promise<boolean> {
    const resposta = await this.request(`${this.endpoint}/movimentacoes/${id_movimentacao}`, {
      method: 'DELETE',
    });

    if (!resposta.sucesso) {
      console.error('[CaixaPessoalRequests] Erro ao remover movimentação:', resposta.erro);
      return false;
    }

    return true;
  }
}

export default new CaixaPessoalRequests();