import { useDashboard } from '../../hooks/useDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Skeleton } from '../../ui/Skeleton';
import { Alert, AlertDescription, AlertTitle } from '../../ui/Alert';
import { AlertCircle, TrendingUp, TrendingDown, DollarSign, Users, Clock, BarChart2 } from 'lucide-react';
import { Chart } from 'primereact/chart';

export default function DashboardInteligente() {
    const {
        dashboardData,
        indicadores,
        carregando,
        erro,
        formatarValor,
        formatarPorcentagem,
        prepararDadosGraficoReceitas
    } = useDashboard();

    // Dados para o gráfico de receitas
    const dadosGrafico = prepararDadosGraficoReceitas();
    
    const chartData = {
        labels: dadosGrafico.map(item => item.data),
        datasets: [
            {
                label: 'Receitas Diárias',
                data: dadosGrafico.map(item => item.valor),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                tension: 0.4
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value: number) {
                        return 'R$ ' + value.toFixed(2);
                    }
                }
            }
        },
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        size: 12
                    }
                }
            }
        }
    };

    if (erro) {
        return (
            <Alert variant="destructive" className="max-w-md mx-auto mt-8">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{erro}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="w-full min-h-full bg-background py-8 px-4 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-foreground mb-6">
                    Dashboard Inteligente
                </h1>

                {/* Cards de resumo */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Saldo Disponível */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {carregando ? (
                                <Skeleton className="h-8 w-32" />
                            ) : (
                                <div className="text-2xl font-bold">{formatarValor(dashboardData?.saldoDisponivel || 0)}</div>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                                Valor disponível para uso
                            </p>
                        </CardContent>
                    </Card>

                    {/* Saldo Reservado */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Saldo Reservado</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {carregando ? (
                                <Skeleton className="h-8 w-32" />
                            ) : (
                                <div className="text-2xl font-bold">{formatarValor(dashboardData?.saldoReservado || 0)}</div>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                                Parcelas a vencer este mês
                            </p>
                        </CardContent>
                    </Card>

                    {/* Receitas do Mês */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            {carregando ? (
                                <Skeleton className="h-8 w-32" />
                            ) : (
                                <div className="text-2xl font-bold text-emerald-600">
                                    {formatarValor(dashboardData?.receitasMes || 0)}
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                                Total recebido este mês
                            </p>
                        </CardContent>
                    </Card>

                    {/* Despesas do Mês */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
                            <TrendingDown className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            {carregando ? (
                                <Skeleton className="h-8 w-32" />
                            ) : (
                                <div className="text-2xl font-bold text-red-600">
                                    {formatarValor(dashboardData?.despesasMes || 0)}
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                                Total emprestado este mês
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Gráfico de receitas */}
                <div className="mb-6">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Receitas dos Últimos 7 Dias</CardTitle>
                        </CardHeader>
                        <CardContent className="h-80">
                            {carregando ? (
                                <div className="flex items-center justify-center h-full">
                                    <Skeleton className="h-64 w-full" />
                                </div>
                            ) : (
                                <Chart type="line" data={chartData} options={chartOptions} />
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Indicadores financeiros */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Fluxo de Caixa</CardTitle>
                            <BarChart2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {carregando ? (
                                <Skeleton className="h-8 w-32" />
                            ) : (
                                <div className={`text-2xl font-bold ${dashboardData?.fluxoCaixa >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {formatarValor(dashboardData?.fluxoCaixa || 0)}
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                                Receitas - Despesas
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Parcelas Atrasadas</CardTitle>
                            <AlertCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            {carregando ? (
                                <Skeleton className="h-8 w-32" />
                            ) : (
                                <div className="text-2xl font-bold text-red-600">
                                    {dashboardData?.parcelasAtrasadas || 0}
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                                Parcelas em atraso
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Clientes Inadimplentes</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {carregando ? (
                                <Skeleton className="h-8 w-32" />
                            ) : (
                                <div className="text-2xl font-bold">
                                    {dashboardData?.clientesInadimplentes || 0}
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                                Clientes com parcelas atrasadas
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Indicadores avançados */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Empréstimos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {carregando ? (
                                <Skeleton className="h-8 w-32" />
                            ) : (
                                <div className="text-2xl font-bold">{indicadores?.totalEmprestimos || 0}</div>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                                Empréstimos ativos e concluídos
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Valor Total Emprestado</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {carregando ? (
                                <Skeleton className="h-8 w-32" />
                            ) : (
                                <div className="text-2xl font-bold">{formatarValor(indicadores?.valorTotalEmprestimos || 0)}</div>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                                Soma de todos os empréstimos
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {carregando ? (
                                <Skeleton className="h-8 w-32" />
                            ) : (
                                <div className="text-2xl font-bold">{indicadores?.totalClientes || 0}</div>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                                Clientes cadastrados
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Data de atualização */}
                <div className="mt-6 text-right">
                    <p className="text-xs text-muted-foreground">
                        Última atualização: {dashboardData?.dataAtualizacao ? 
                            new Date(dashboardData.dataAtualizacao).toLocaleString('pt-BR') : 'Carregando...'}
                    </p>
                </div>
            </div>
        </div>
    );
}