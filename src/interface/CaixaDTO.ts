export default interface CaixaDTO {
    // Resumo geral
    totalEmprestado: number;
    totalRecebido: number;
    entradaPendente: number;
    lucroPrevisto: number;
    totalClientes: number;
    totalEmprestimos: number;
    totalAtrasado: number;

    // Relatórios (opcionais, dependendo do endpoint)
    relatorioDiario?: {
        data: string;
        recebido: number;
        emprestado: number;
        parcelasVencendo: number;
        parcelasAtrasadas: number;
    };

    relatorioMensal?: {
        mes: string;
        recebido: number;
        emprestado: number;
        crescimento: number;
    }[];

    relatorioAnual?: {
        mes: string;
        recebido: number;
        emprestado: number;
        lucro: number;
    }[];
}