import { useState, useEffect } from 'react';
import DashboardRequests from '../fetch/DashboardRequests';
import { formatarMoeda } from '../services/Utilitario';

export function useDashboard() {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [indicadores, setIndicadores] = useState<any>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const carregarDashboard = async () => {
        try {
            setCarregando(true);
            setErro(null);
            
            // Carregar dados do dashboard
            const dashboard = await DashboardRequests.obterDashboardInteligente();
            if (dashboard) {
                setDashboardData(dashboard);
            }
            
            // Carregar indicadores financeiros
            const indicadoresData = await DashboardRequests.obterIndicadoresFinanceiros();
            if (indicadoresData) {
                setIndicadores(indicadoresData);
            }
            
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
            setErro('Falha ao carregar dados do dashboard');
        } finally {
            setCarregando(false);
        }
    };

    const atualizarDashboard = () => {
        carregarDashboard();
    };

    // Formatação de dados para exibição
    const formatarValor = (valor: number): string => {
        return formatarMoeda(valor);
    };

    const formatarPorcentagem = (valor: number): string => {
        return `${valor.toFixed(2)}%`;
    };

    // Dados para gráficos
    const prepararDadosGraficoReceitas = () => {
        if (!dashboardData?.graficos?.receitasPorDia) return [];
        
        return dashboardData.graficos.receitasPorDia.map((item: any) => ({
            data: new Date(item.data_pagamento).toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: '2-digit' 
            }),
            valor: item.total
        }));
    };

    useEffect(() => {
        carregarDashboard();
    }, []);

    return {
        dashboardData,
        indicadores,
        carregando,
        erro,
        atualizarDashboard,
        formatarValor,
        formatarPorcentagem,
        prepararDadosGraficoReceitas
    };
}