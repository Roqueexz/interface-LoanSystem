export default interface DashboardDTO {
    // Dados principais do dashboard
    saldoDisponivel: number;
    saldoReservado: number;
    receitasMes: number;
    despesasMes: number;
    fluxoCaixa: number;
    parcelasRecebidasHoje: number;
    parcelasAtrasadas: number;
    clientesInadimplentes: number;
    dataAtualizacao: string;

    // Gráficos
    graficos: {
        receitasPorDia: Array<{
            data_pagamento: string;
            total: number;
        }>;
    };

    // Indicadores
    indicadores: {
        totalEmprestimos: number;
        valorTotalEmprestimos: number;
        totalClientes: number;
    };
}