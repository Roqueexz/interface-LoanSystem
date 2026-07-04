import type ParcelaDTO from "../interface/ParcelaDTO";
import AuthRequests from "./AuthRequests";

class ParcelaRequests {
  private serverURL: string;
  private endpointParcela: string;
  private endpointEmprestimo: string;

  constructor() {
    this.serverURL = "http://localhost:3333";
    this.endpointParcela = "/api/parcelas";
    this.endpointEmprestimo = "/api/emprestimos";
  }

  async listarPorEmprestimo(id_emprestimo: number): Promise<ParcelaDTO[] | undefined> {
    try {
      const token = localStorage.getItem("token");

      const respostaAPI = await fetch(
        `${this.serverURL}${this.endpointEmprestimo}/${id_emprestimo}/parcelas`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token || "",
          },
        },
      );

      if (respostaAPI.status === 401) {
        console.warn("Token expirado. Redirecionando para login...");
        AuthRequests.removeToken();
        return undefined;
      }

      if (respostaAPI.status === 204) {
        return [];
      }

      if (respostaAPI.ok) {
        const parcelas: ParcelaDTO[] = await respostaAPI.json();
        return parcelas;
      }

      throw new Error("Nao foi possivel listar as parcelas.");
    } catch (error) {
      console.error(`Erro ao consultar parcelas do emprestimo ${id_emprestimo}. ${error}`);
      return [];
    }
  }

  async buscarPorId(id_parcela: number): Promise<ParcelaDTO | undefined> {
    try {
      const token = localStorage.getItem("token");

      const respostaAPI = await fetch(
        `${this.serverURL}${this.endpointParcela}/${id_parcela}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token || "",
          },
        },
      );

      if (respostaAPI.status === 401) {
        console.warn("Token expirado. Redirecionando para login...");
        AuthRequests.removeToken();
        return undefined;
      }

      if (respostaAPI.ok) {
        const parcela: ParcelaDTO = await respostaAPI.json();
        return parcela;
      }

      throw new Error("Nao foi possivel buscar a parcela.");
    } catch (error) {
      console.error(`Erro ao consultar parcela por ID ${id_parcela}. ${error}`);
      return undefined;
    }
  }

  async pagar(id_parcela: number, data_pagamento?: Date): Promise<boolean> {
    try {
      const token = localStorage.getItem("token");

      const body: any = {};
      if (data_pagamento) {
        body.data_pagamento = data_pagamento.toISOString();
      }

      const respostaAPI = await fetch(
        `${this.serverURL}${this.endpointParcela}/${id_parcela}/pagar`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token || "",
          },
          body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
        },
      );

      if (respostaAPI.status === 401) {
        console.warn("Token expirado. Redirecionando para login...");
        AuthRequests.removeToken();
        return false;
      }

      if (!respostaAPI.ok) {
        const error = await respostaAPI.json();
        throw new Error(error.mensagem || `Erro ${respostaAPI.status}: ${respostaAPI.statusText}`);
      }

      return true;
    } catch (error) {
      console.error(`Erro ao pagar parcela ${id_parcela}. ${error}`);
      return false;
    }
  }

  async desfazerPagamento(id_parcela: number): Promise<boolean> {
    try {
      const token = localStorage.getItem("token");

      const respostaAPI = await fetch(
        `${this.serverURL}${this.endpointParcela}/${id_parcela}/desfazer`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token || "",
          },
        },
      );

      if (respostaAPI.status === 401) {
        console.warn("Token expirado. Redirecionando para login...");
        AuthRequests.removeToken();
        return false;
      }

      if (!respostaAPI.ok) {
        const error = await respostaAPI.json();
        throw new Error(error.mensagem || `Erro ${respostaAPI.status}: ${respostaAPI.statusText}`);
      }

      return true;
    } catch (error) {
      console.error(`Erro ao desfazer pagamento da parcela ${id_parcela}. ${error}`);
      return false;
    }
  }

  /**
   * Lista parcelas por status (pagas, pendentes, atrasadas)
   * GET /api/parcelas?status=status
   */
  async listarPorStatus(status: 'pagas' | 'pendentes' | 'atrasadas'): Promise<any[] | undefined> {
    try {
      const token = localStorage.getItem("token");

      const respostaAPI = await fetch(
        `${this.serverURL}${this.endpointParcela}?status=${status}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token || "",
          },
        },
      );

      if (respostaAPI.status === 401) {
        console.warn("Token expirado. Redirecionando para login...");
        AuthRequests.removeToken();
        return undefined;
      }

      if (respostaAPI.ok) {
        return await respostaAPI.json();
      }

      throw new Error(`Erro ao listar parcelas por status: ${respostaAPI.status}`);
    } catch (error) {
      console.error(`Erro ao listar parcelas por status (${status}):`, error);
      return undefined;
    }
  }
}

export default new ParcelaRequests();