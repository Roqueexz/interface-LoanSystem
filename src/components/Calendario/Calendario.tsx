import { useCalendario } from '../../hooks/useCalendario';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Skeleton } from '../../ui/Skeleton';
import { Alert, AlertDescription, AlertTitle } from '../../ui/Alert';
import { AlertCircle, Calendar, ChevronLeft, ChevronRight, DollarSign, Users, Target } from 'lucide-react';
import { Badge } from '../../ui/Badge';

export default function Calendario() {
    const {
        eventos,
        previsualizacao,
        carregando,
        erro,
        mesAtual,
        navegarMes,
        formatarValor,
        agruparEventosPorData
    } = useCalendario();

    const eventosAgrupados = agruparEventosPorData();

    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    // Obter o primeiro dia do mês e o último dia do mês
    const primeiroDia = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1);
    const ultimoDia = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0);
    const diasNoMes = ultimoDia.getDate();
    const primeiroDiaSemana = primeiroDia.getDay();

    // Gerar dias do calendário
    const dias = [];
    for (let i = 0; i < primeiroDiaSemana; i++) {
        dias.push(null);
    }
    for (let i = 1; i <= diasNoMes; i++) {
        dias.push(i);
    }

    const getIconePorTipo = (tipo: string) => {
        switch (tipo) {
            case 'parcela':
                return <DollarSign className="h-3 w-3" />;
            case 'conta':
                return <AlertCircle className="h-3 w-3" />;
            case 'meta':
                return <Target className="h-3 w-3" />;
            default:
                return <Calendar className="h-3 w-3" />;
        }
    };

    const getCorPorTipo = (tipo: string) => {
        switch (tipo) {
            case 'parcela':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'conta':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'meta':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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
                    Calendário Financeiro
                </h1>

                {/* Navegação do mês */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navegarMes('anterior')}
                            className="p-2 rounded-full hover:bg-muted transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <h2 className="text-xl font-semibold">
                            {meses[mesAtual.getMonth()]} {mesAtual.getFullYear()}
                        </h2>
                        <button
                            onClick={() => navegarMes('proximo')}
                            className="p-2 rounded-full hover:bg-muted transition-colors"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" /> Parcelas
                        </Badge>
                        <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> Contas
                        </Badge>
                        <Badge variant="success" className="flex items-center gap-1">
                            <Target className="h-3 w-3" /> Metas
                        </Badge>
                    </div>
                </div>

                {/* Calendário */}
                <div className="grid grid-cols-7 gap-1 mb-6">
                    {diasDaSemana.map((dia, index) => (
                        <div key={index} className="text-center text-sm font-medium text-muted-foreground p-2">
                            {dia}
                        </div>
                    ))}
                    {dias.map((dia, index) => (
                        <div
                            key={index}
                            className={`min-h-[100px] border border-border rounded-lg p-2 ${dia ? 'hover:bg-muted/50 transition-colors' : 'bg-muted'}`}
                        >
                            {dia ? (
                                <div className="flex flex-col h-full">
                                    <div className="text-sm font-medium mb-1">{dia}</div>
                                    <div className="flex-1 space-y-1">
                                        {eventosAgrupados[`${mesAtual.getFullYear()}-${String(mesAtual.getMonth() + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`]?.map((evento, eventoIndex) => (
                                            <div key={eventoIndex} className={`text-xs ${getCorPorTipo(evento.tipo_evento)} p-1 rounded flex items-center gap-1`}>
                                                {getIconePorTipo(evento.tipo_evento)}
                                                <span>{formatarValor(evento.valor)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>

                {/* Resumo do mês */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {carregando ? (
                                <Skeleton className="h-8 w-32" />
                            ) : (
                                <div className="text-2xl font-bold">{previsualizacao.length}</div>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                                Eventos neste mês
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total a Receber</CardTitle>
                            <DollarSign className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            {carregando ? (
                                <Skeleton className="h-8 w-32" />
                            ) : (
                                <div className="text-2xl font-bold text-blue-600">
                                    {formatarValor(previsualizacao.reduce((sum, item) => sum + item.total_valor, 0))}
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                                Soma de todos os eventos
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Dias com Eventos</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {carregando ? (
                                <Skeleton className="h-8 w-32" />
                            ) : (
                                <div className="text-2xl font-bold">
                                    {previsualizacao.length}
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                                Dias com eventos neste mês
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Lista de eventos */}
                <div className="mb-6">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Eventos do Mês</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {carregando ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {previsualizacao.map((item, index) => {
                                        const data = new Date(item.data_evento);
                                        const tipos = item.tipos || [];
                                        
                                        return (
                                            <div key={index} className="border-b border-border pb-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="font-medium">
                                                        {data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {tipos.map((tipo: string, tipoIndex: number) => (
                                                            <Badge key={tipoIndex} variant="secondary" className="flex items-center gap-1">
                                                                {getIconePorTipo(tipo)}
                                                                {tipo}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">
                                                        {item.total_eventos} evento{item.total_eventos > 1 ? 's' : ''}
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                        {formatarValor(item.total_valor)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}