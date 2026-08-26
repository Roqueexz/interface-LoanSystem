import { BaseRequests } from "./BaseRequests";
import type DashboardDTO from "../interface/DashboardDTO";
import { SERVER_CFG } from "../appConfig";

class DashboardRequests extends BaseRequests {
    private endpointDashboard = SERVER_CFG.ENDPOINT_DASHBOARD;
    private endpointIndicadores = SERVER_CFG.ENDPOINT_INDICADORES;

    async obterDashboardInteligente(): Promise<DashboardDTO | undefined> {
        const resposta = await this.request<DashboardDTO>(this.endpointDashboard);
        
        if (!resposta.sucesso) {
            console.error('[DashboardRequests] Erro ao obter dashboard inteligente:', resposta.erro);
            return undefined;
        }
        
        return resposta.dados;
    }

    async obterIndicadoresFinanceiros(): Promise<any | undefined> {
        const resposta = await this.request<any>(this.endpointIndicadores);
        
        if (!resposta.sucesso) {
            console.error('[DashboardRequests] Erro ao obter indicadores financeiros:', resposta.erro);
            return undefined;
        }
        
        return resposta.dados;
    }
}

export default new DashboardRequests();