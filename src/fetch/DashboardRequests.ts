import { BaseRequests } from "./BaseRequests";
import type DashboardDTO from "../interface/DashboardDTO";

class DashboardRequests extends BaseRequests {
    private endpointDashboard = '/api/caixa/dashboard';
    private endpointIndicadores = '/api/caixa/indicadores';

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