import type ResumoClienteDTO from "../interface/ResumoClienteDTO";
import AuthRequests from "./AuthRequests";

class ResumoRequests {
  private serverURL: string;
  private endpointClientes: string;

  constructor() {
    this.serverURL = "http://localhost:3333";
    this.endpointClientes = "/api/clientes";
  }

  /**
   * Obtém o resumo completo de um cliente (cliente + empréstimos + parcelas + totais)
   * GET /api/clientes/:id/resumo
   */
  async obterResumoCliente(id_cliente: number): Promise<ResumoClienteDTO | undefined> {
    try {
      const token = localStorage.getItem("token");

      const respostaAPI = await fetch(
        `${this.serverURL}${this.endpointClientes}/${id_cliente}/resumo`,
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

      if (respostaAPI.status === 404) {
        console.warn(`Cliente ${id_cliente} não encontrado.`);
        return undefined;
      }

      if (respostaAPI.ok) {
        const resumo: ResumoClienteDTO = await respostaAPI.json();
        return resumo;
      }

      throw new Error(`Não foi possível obter o resumo do cliente. Status: ${respostaAPI.status}`);
    } catch (error) {
      console.error(`Erro ao consultar resumo do cliente ${id_cliente}. ${error}`);
      return undefined;
    }
  }
}

export default new ResumoRequests();