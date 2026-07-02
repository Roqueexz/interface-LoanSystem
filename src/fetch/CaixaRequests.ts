import type CaixaDTO from "../interface/CaixaDTO";

class CaixaRequests {
  private serverURL: string;
  private endpointCaixa: string;

  constructor() {
    this.serverURL = "http://localhost:3333";
    this.endpointCaixa = "/api/caixa";
  }

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
}

export default new CaixaRequests();