import { BaseRequests } from "./BaseRequests";
import type CalendarioDTO from "../interface/CalendarioDTO";
import { SERVER_CFG } from "../appConfig";

class CalendarioRequests extends BaseRequests {
  private endpointEventos = SERVER_CFG.ENDPOINT_CALENDARIO_EVENTOS;
  private endpointPrevisualizar = SERVER_CFG.ENDPOINT_CALENDARIO_PREVISUALIZAR;
  private endpointCriarEvento = SERVER_CFG.ENDPOINT_CALENDARIO_EVENTOS;
  private endpointAtualizarRegra = SERVER_CFG.ENDPOINT_CALENDARIO_REGRAS;

  async obterEventos(
    tipo?: string,
    data?: string,
  ): Promise<CalendarioDTO[] | undefined> {
    const params = new URLSearchParams();
    if (tipo) params.append("tipo", tipo);
    if (data) params.append("data", data);

    const url =
      this.endpointEventos + (params.toString() ? "?" + params.toString() : "");
    const resposta = await this.request<CalendarioDTO[]>(url);

    if (!resposta.sucesso) {
      console.error(
        "[CalendarioRequests] Erro ao obter eventos:",
        resposta.erro,
      );
      return undefined;
    }

    return resposta.dados;
  }

  async previsualizarMes(anoMes?: string): Promise<any[] | undefined> {
    const params = new URLSearchParams();
    if (anoMes) params.append("anoMes", anoMes);

    const url =
      this.endpointPrevisualizar +
      (params.toString() ? "?" + params.toString() : "");
    const resposta = await this.request<any[]>(url);

    if (!resposta.sucesso) {
      console.error(
        "[CalendarioRequests] Erro ao previsualizar mês:",
        resposta.erro,
      );
      return undefined;
    }

    return resposta.dados;
  }

  async criarEvento(data: any): Promise<any | undefined> {
    const resposta = await this.request<any>(this.endpointCriarEvento, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!resposta.sucesso) {
      console.error(
        "[CalendarioRequests] Erro ao criar evento:",
        resposta.erro,
      );
      return undefined;
    }

    return resposta.dados;
  }

  async atualizarRegra(
    tipo: string,
    dataKey: string,
    hasRule: boolean,
  ): Promise<any | undefined> {
    const resposta = await this.request<any>(this.endpointAtualizarRegra, {
      method: "PATCH",
      body: JSON.stringify({ tipo, dataKey, hasRule }),
    });

    if (!resposta.sucesso) {
      console.error(
        "[CalendarioRequests] Erro ao atualizar regra:",
        resposta.erro,
      );
      return undefined;
    }

    return resposta.dados;
  }
}

export default new CalendarioRequests();
