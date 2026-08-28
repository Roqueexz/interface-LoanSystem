import type { CofreFisicoDTO, CedulaCofreDTO, ContaCaixaPessoalDTO, MovimentacaoCaixaPessoalDTO, MetaFinanceiraDTO, ConciliacaoCofreDTO } from '../interface/CaixaPessoalDTO';
import { BaseRequests } from './BaseRequests';
import { SERVER_CFG } from '../appConfig';

// ============================================================
// CaixaPessoalRequests — comunicação com /api/caixa-pessoal
// Segue o padrão de BaseRequests usado em CaixaRequests.
// O token JWT é enviado automaticamente pelo BaseRequests.
// O backend extrai o id_usuario do token — nunca do body.
// ============================================================

class CaixaPessoalRequests extends BaseRequests {
  private endpoint = SERVER_CFG.ENDPOINT_CAIXA_PESSOAL;

  // ─── COFRE: OBTER ──────────────────────────────────────────────────
  async obterCofre(): Promise<CofreFisicoDTO | undefined> {
    const resposta = await this.request<CofreFisicoDTO>(`${this.endpoint}/cofre`);

    if (!resposta.sucesso) {
      console.error('[CaixaPessoalRequests] Erro ao obter cofre:', resposta.erro);
      return undefined;
    }

    return resposta.dados;
  }

  // ─── SALDO CONSOLIDADO: OBTER ──────────────────────────────────────
  async obterSaldo(): Promise<number | undefined> {
    const resposta = await this.request<{ saldo: number }>(`${this.endpoint}/saldo`);

    if (!resposta.sucesso) {
      console.error('[CaixaPessoalRequests] Erro ao obter saldo consolidado:', resposta.erro);
      return undefined;
    }

    return resposta.dados?.saldo;
  }

  // ─── SALDO CONSOLIDADO: ATUALIZAR ──────────────────────────────────
  async atualizarSaldo(saldo: number): Promise<boolean> {
    const resposta = await this.request<{ mensagem: string; saldo: number }>(`${this.endpoint}/saldo`, {
      method: 'PUT',
      body: JSON.stringify({ saldo }),
    });

    if (!resposta.sucesso) {
      console.error('[CaixaPessoalRequests] Erro ao atualizar saldo consolidado:', resposta.erro);
      return false;
    }

    return true;
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
  async listarContas(filters?: { status?: string; categoria?: string; recorrencia?: string; prioridade?: string; q?: string; dias?: number }): Promise<ContaCaixaPessoalDTO[] | undefined> {
    const query = new URLSearchParams();

    if (filters?.status) query.append('status', filters.status);
    if (filters?.categoria) query.append('categoria', filters.categoria);
    if (filters?.recorrencia) query.append('recorrencia', filters.recorrencia);
    if (filters?.prioridade) query.append('prioridade', filters.prioridade);
    if (filters?.q) query.append('q', filters.q);
    if (filters?.dias !== undefined) query.append('dias', String(filters.dias));

    const url = `${this.endpoint}/contas${query.toString() ? `?${query.toString()}` : ''}`;
    const resposta = await this.request<any[]>(url);

    if (!resposta.sucesso) {
      console.error('[CaixaPessoalRequests] Erro ao listar contas:', resposta.erro);
      return undefined;
    }

    const dados = resposta.dados || [];
    return dados.map((d: any) => ({
      id: String(d.id_conta ?? d.id),
      tipo: d.tipo,
      descricao: d.descricao,
      valor: Number(d.valor),
      vencimento: d.vencimento,
      pago: Boolean(d.pago),
      categoria: d.categoria ?? undefined,
      recorrencia: d.recorrencia ?? 'unica',
      prioridade: d.prioridade ?? 'media',
      lembreteDiasAntes: d.lembrete_dias_antes !== undefined ? Number(d.lembrete_dias_antes) : undefined,
      observacao: d.observacao ?? undefined,
      tags: Array.isArray(d.tags) ? d.tags.map((tag: any) => String(tag)) : [],
      status: d.status ?? (d.pago ? 'paga' : 'pendente'),
    }));
  }

  // ─── CONTAS: CRIAR ───────────────────────────────────────────────
  async criarConta(payload: { tipo: string; descricao: string; valor: number; vencimento: string; categoria?: string; recorrencia?: string; prioridade?: string; lembrete_dias_antes?: number; observacao?: string; tags?: string[]; status?: string }) {
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
      categoria: d.categoria ?? undefined,
      recorrencia: d.recorrencia ?? 'unica',
      prioridade: d.prioridade ?? 'media',
      lembreteDiasAntes: d.lembrete_dias_antes !== undefined ? Number(d.lembrete_dias_antes) : undefined,
      observacao: d.observacao ?? undefined,
      tags: Array.isArray(d.tags) ? d.tags.map((tag: any) => String(tag)) : [],
      status: d.status ?? (d.pago ? 'paga' : 'pendente'),
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

  // ─── METAS: LISTAR ───────────────────────────────────────────────
  async listarMetas(): Promise<MetaFinanceiraDTO[] | undefined> {
    const resposta = await this.request<any[]>(`${this.endpoint}/metas`);

    if (!resposta.sucesso) {
      console.error('[CaixaPessoalRequests] Erro ao listar metas:', resposta.erro);
      return undefined;
    }

    const dados = resposta.dados || [];
    return dados.map((d: any) => ({
      id: String(d.id_meta ?? d.id),
      nome: d.nome,
      descricao: d.descricao ?? undefined,
      valorAlvo: Number(d.valor_alvo ?? d.valorAlvo ?? 0),
      valorAtual: Number(d.valor_atual ?? d.valorAtual ?? 0),
      prazo: d.prazo ?? undefined,
      percentual: Number(d.percentual ?? 0),
      diasRestantes: d.dias_restantes !== undefined ? Number(d.dias_restantes) : undefined,
    }));
  }

  // ─── METAS: CRIAR ───────────────────────────────────────────────
  async criarMeta(payload: {
    nome: string;
    descricao?: string;
    valorAlvo: number;
    valorAtual?: number;
    prazo?: string;
  }): Promise<MetaFinanceiraDTO | undefined> {
    const resposta = await this.request<any>(`${this.endpoint}/metas`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!resposta.sucesso) {
      console.error('[CaixaPessoalRequests] Erro ao criar meta:', resposta.erro);
      return undefined;
    }

    const d = resposta.dados;
    return {
      id: String(d.id_meta ?? d.id),
      nome: d.nome,
      descricao: d.descricao ?? undefined,
      valorAlvo: Number(d.valor_alvo ?? d.valorAlvo ?? 0),
      valorAtual: Number(d.valor_atual ?? d.valorAtual ?? 0),
      prazo: d.prazo ?? undefined,
      percentual: Number(d.percentual ?? 0),
      diasRestantes: d.dias_restantes !== undefined ? Number(d.dias_restantes) : undefined,
    };
  }

  // ─── METAS: ATUALIZAR ───────────────────────────────────────────
  async atualizarMeta(id_meta: string, payload: {
    nome?: string;
    descricao?: string;
    valorAlvo?: number;
    valorAtual?: number;
    prazo?: string;
  }): Promise<MetaFinanceiraDTO | undefined> {
    const resposta = await this.request<any>(`${this.endpoint}/metas/${id_meta}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    if (!resposta.sucesso) {
      console.error('[CaixaPessoalRequests] Erro ao atualizar meta:', resposta.erro);
      return undefined;
    }

    const d = resposta.dados;
    return {
      id: String(d.id_meta ?? d.id),
      nome: d.nome,
      descricao: d.descricao ?? undefined,
      valorAlvo: Number(d.valor_alvo ?? d.valorAlvo ?? 0),
      valorAtual: Number(d.valor_atual ?? d.valorAtual ?? 0),
      prazo: d.prazo ?? undefined,
      percentual: Number(d.percentual ?? 0),
      diasRestantes: d.dias_restantes !== undefined ? Number(d.dias_restantes) : undefined,
    };
  }

  // ─── METAS: REMOVER ─────────────────────────────────────────────
  async removerMeta(id_meta: string): Promise<boolean> {
    const resposta = await this.request(`${this.endpoint}/metas/${id_meta}`, {
      method: 'DELETE',
    });

    if (!resposta.sucesso) {
      console.error('[CaixaPessoalRequests] Erro ao remover meta:', resposta.erro);
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

  // ─── CONCILIAÇÃO: OCR vs MANUAL (com foto) ───────────────────────
  async conciliarCofre(params: {
    foto: File | null;
    manualCedulas: { valor_cedula: number; quantidade: number }[];
    ocrCedulas?: { valor_cedula: number; quantidade: number; confianca: number }[];
    textoBruto?: string;
  }): Promise<ConciliacaoCofreDTO | undefined> {
    const form = new FormData();
    if (params.foto) form.append('foto', params.foto);
    form.append('manual', JSON.stringify(params.manualCedulas));
    if (params.ocrCedulas) {
      form.append('ocr', JSON.stringify({ cedulas: params.ocrCedulas, texto_bruto: params.textoBruto || '' }));
    }

    const token = localStorage.getItem('token');
    try {
      const resp = await fetch(`${SERVER_CFG.SERVER_URL}${this.endpoint}/cofre/conciliacao`, {
        method: 'POST',
        headers: { ...(token ? { 'x-access-token': token } : {}) },
        body: form,
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        console.error('[CaixaPessoalRequests] Erro na conciliação:', err.mensagem || resp.statusText);
        return undefined;
      }
      return (await resp.json()) as ConciliacaoCofreDTO;
    } catch (e: any) {
      console.error('[CaixaPessoalRequests] Erro na conciliação:', e.message);
      return undefined;
    }
  }

  async listarConciliacoes(): Promise<ConciliacaoCofreDTO[] | undefined> {
    const resposta = await this.request<any[]>(`${this.endpoint}/cofre/conciliacoes`);
    if (!resposta.sucesso) {
      console.error('[CaixaPessoalRequests] Erro ao listar conciliações:', resposta.erro);
      return undefined;
    }
    return (resposta.dados || []).map((r: any) => ({
      id_conciliacao: r.id_conciliacao,
      foto_url: r.foto_url,
      manual: r.detalhes?.manual ? { cedulas: r.detalhes.manual, total: Number(r.manual_total) } : { cedulas: [], total: Number(r.manual_total) },
      ocr: r.detalhes?.ocr ? { cedulas: r.detalhes.ocr, total: Number(r.ocr_total), texto_bruto: r.detalhes.texto_bruto } : { cedulas: [], total: Number(r.ocr_total) },
      divergencia: Number(r.divergencia),
      status: r.status,
      criado_em: r.criado_em,
    }));
  }
}

export default new CaixaPessoalRequests();