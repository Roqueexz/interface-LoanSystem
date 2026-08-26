import type CaixaDTO from "../interface/CaixaDTO";
import { BaseRequests } from "./BaseRequests";
import { SERVER_CFG } from "../appConfig";

class CaixaRequests extends BaseRequests {
  private endpointCaixa = SERVER_CFG.ENDPOINT_CAIXA;

  // ─── RESUMO GERAL ──────────────────────────────────────────────────
  async obterResumoFinanceiro(): Promise<CaixaDTO | undefined> {
    const resposta = await this.request<CaixaDTO>(this.endpointCaixa);
    
    if (!resposta.sucesso) {
      console.error('[CaixaRequests] Erro ao obter resumo financeiro:', resposta.erro);
      return undefined;
    }

    return resposta.dados;
  }

  // ─── RELATÓRIO DIÁRIO ──────────────────────────────────────────────
  async obterRelatorioDiario(data?: string): Promise<any | undefined> {
    let url = `${this.endpointCaixa}/diario`;
    if (data) {
      url += `?data=${data}`;
    }

    const resposta = await this.request<any>(url);
    
    if (!resposta.sucesso) {
      console.error('[CaixaRequests] Erro ao obter relatório diário:', resposta.erro);
      return undefined;
    }

    return resposta.dados;
  }

  // ─── RELATÓRIO MENSAL ──────────────────────────────────────────────
  async obterRelatorioMensal(ano?: number, mes?: number): Promise<any | undefined> {
    let url = `${this.endpointCaixa}/mensal`;
    const params = new URLSearchParams();
    if (ano) params.append('ano', String(ano));
    if (mes) params.append('mes', String(mes));
    if (params.toString()) url += `?${params.toString()}`;

    const resposta = await this.request<any>(url);
    
    if (!resposta.sucesso) {
      console.error('[CaixaRequests] Erro ao obter relatório mensal:', resposta.erro);
      return undefined;
    }

    return resposta.dados;
  }

  // ─── RELATÓRIO ANUAL ───────────────────────────────────────────────
  async obterRelatorioAnual(ano?: number): Promise<any[] | undefined> {
    let url = `${this.endpointCaixa}/anual`;
    if (ano) {
      url += `?ano=${ano}`;
    }

    const resposta = await this.request<any[]>(url);
    
    if (!resposta.sucesso) {
      console.error('[CaixaRequests] Erro ao obter relatório anual:', resposta.erro);
      return undefined;
    }

    return resposta.dados;
  }
}

export default new CaixaRequests();