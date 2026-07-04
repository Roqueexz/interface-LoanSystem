import type CaixaDTO from "../interface/CaixaDTO";
import AuthRequests from "./AuthRequests";

class CaixaRequests {
  private serverURL: string;
  private endpointCaixa: string;

  constructor() {
    this.serverURL = "http://localhost:3333";
    this.endpointCaixa = "/api/caixa";
  }

  // ─── RESUMO GERAL ──────────────────────────────────────────────────
  async obterResumoFinanceiro(): Promise<CaixaDTO | undefined> {
    try {
      const token = localStorage.getItem("token");

      const respostaAPI = await fetch(
        `${this.serverURL}${this.endpointCaixa}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${token}`,
          },
        },
      );

      if (respostaAPI.status === 401) {
        console.warn("Token expirado ou não informado. Redirecionando para login...");
        AuthRequests.removeToken();
        return undefined;
      }

      if (respostaAPI.ok) {
        const resumoFinanceiro: CaixaDTO = await respostaAPI.json();
        return resumoFinanceiro;
      }

      throw new Error(`Não foi possível buscar o resumo financeiro. Status: ${respostaAPI.status}`);
    } catch (error) {
      console.error(`Erro ao consultar o caixa. ${error}`);
      return undefined;
    }
  }

  // ─── RELATÓRIO DIÁRIO ──────────────────────────────────────────────
  async obterRelatorioDiario(data?: string): Promise<any | undefined> {
    try {
      const token = localStorage.getItem("token");

      let url = `${this.serverURL}${this.endpointCaixa}/diario`;
      if (data) {
        url += `?data=${data}`;
      }

      const respostaAPI = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": `${token}`,
        },
      });

      if (respostaAPI.status === 401) {
        console.warn("Token expirado. Redirecionando para login...");
        AuthRequests.removeToken();
        return undefined;
      }

      if (respostaAPI.ok) {
        return await respostaAPI.json();
      }

      throw new Error(`Não foi possível buscar o relatório diário. Status: ${respostaAPI.status}`);
    } catch (error) {
      console.error(`Erro ao consultar relatório diário. ${error}`);
      return undefined;
    }
  }

  // ─── RELATÓRIO MENSAL ──────────────────────────────────────────────
  async obterRelatorioMensal(ano?: number, mes?: number): Promise<any | undefined> {
    try {
      const token = localStorage.getItem("token");

      let url = `${this.serverURL}${this.endpointCaixa}/mensal`;
      const params = new URLSearchParams();
      if (ano) params.append('ano', String(ano));
      if (mes) params.append('mes', String(mes));
      if (params.toString()) url += `?${params.toString()}`;

      const respostaAPI = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": `${token}`,
        },
      });

      if (respostaAPI.status === 401) {
        console.warn("Token expirado. Redirecionando para login...");
        AuthRequests.removeToken();
        return undefined;
      }

      if (respostaAPI.ok) {
        return await respostaAPI.json();
      }

      throw new Error(`Não foi possível buscar o relatório mensal. Status: ${respostaAPI.status}`);
    } catch (error) {
      console.error(`Erro ao consultar relatório mensal. ${error}`);
      return undefined;
    }
  }

  // ─── RELATÓRIO ANUAL ───────────────────────────────────────────────
  async obterRelatorioAnual(ano?: number): Promise<any[] | undefined> {
    try {
      const token = localStorage.getItem("token");

      let url = `${this.serverURL}${this.endpointCaixa}/anual`;
      if (ano) {
        url += `?ano=${ano}`;
      }

      const respostaAPI = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": `${token}`,
        },
      });

      if (respostaAPI.status === 401) {
        console.warn("Token expirado. Redirecionando para login...");
        AuthRequests.removeToken();
        return undefined;
      }

      if (respostaAPI.ok) {
        return await respostaAPI.json();
      }

      throw new Error(`Não foi possível buscar o relatório anual. Status: ${respostaAPI.status}`);
    } catch (error) {
      console.error(`Erro ao consultar relatório anual. ${error}`);
      return undefined;
    }
  }
}

export default new CaixaRequests();