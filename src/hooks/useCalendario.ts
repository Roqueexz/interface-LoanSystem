import { useState, useEffect } from 'react';
import CalendarioRequests from '../fetch/CalendarioRequests';
import { formatarMoeda } from '../services/Utilitario';

function formatarReferenciaMes(data: Date): string {
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
}

export function useCalendario() {
    const [eventos, setEventos] = useState<any[]>([]);
    const [previsualizacao, setPrevisualizacao] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [mesAtual, setMesAtual] = useState(new Date());

    const carregarEventos = async (tipo?: string, data?: string) => {
        try {
            setCarregando(true);
            setErro(null);

            const dados = await CalendarioRequests.obterEventos(tipo, data);
            if (dados) {
                setEventos(dados);
            }
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
            setErro('Falha ao carregar eventos do calendário');
        } finally {
            setCarregando(false);
        }
    };

    const previsualizarMes = async (anoMes?: string) => {
        try {
            setCarregando(true);
            setErro(null);

            const dados = await CalendarioRequests.previsualizarMes(anoMes);
            if (dados) {
                setPrevisualizacao(dados);
            }
        } catch (error) {
            console.error('Erro ao previsualizar mês:', error);
            setErro('Falha ao previsualizar mês');
        } finally {
            setCarregando(false);
        }
    };

    const criarEvento = async (eventoData: any) => {
        try {
            setCarregando(true);
            setErro(null);

            const resultado = await CalendarioRequests.criarEvento(eventoData);
            if (resultado) {
                await carregarEventos(undefined, `${mesAtual.getFullYear()}-${String(mesAtual.getMonth() + 1).padStart(2, '0')}`);
                return resultado;
            }
        } catch (error) {
            console.error('Erro ao criar evento:', error);
            setErro('Falha ao criar evento');
        } finally {
            setCarregando(false);
        }
    };

    const atualizarRegra = async (tipo: string, dataKey: string, hasRule: boolean) => {
        try {
            setCarregando(true);
            setErro(null);

            const resultado = await CalendarioRequests.atualizarRegra(tipo, dataKey, hasRule);
            return resultado;
        } catch (error) {
            console.error('Erro ao atualizar regra:', error);
            setErro('Falha ao atualizar regra');
        } finally {
            setCarregando(false);
        }
    };

    const navegarMes = (direcao: 'anterior' | 'proximo') => {
        const novoMes = new Date(mesAtual);
        if (direcao === 'anterior') {
            novoMes.setMonth(novoMes.getMonth() - 1);
        } else {
            novoMes.setMonth(novoMes.getMonth() + 1);
        }
        setMesAtual(novoMes);
    };

    const formatarValor = (valor: number): string => {
        return formatarMoeda(valor);
    };

    const agruparEventosPorData = () => {
        const eventosAgrupados: Record<string, any[]> = {};

        eventos.forEach((evento) => {
            const data = evento.data_evento;
            if (!eventosAgrupados[data]) {
                eventosAgrupados[data] = [];
            }
            eventosAgrupados[data].push(evento);
        });

        return eventosAgrupados;
    };

    useEffect(() => {
        const referenciaMes = formatarReferenciaMes(mesAtual);
        void carregarEventos(undefined, referenciaMes);
        void previsualizarMes(referenciaMes);
    }, [mesAtual]);

    return {
        eventos,
        previsualizacao,
        carregando,
        erro,
        mesAtual,
        carregarEventos,
        previsualizarMes,
        criarEvento,
        atualizarRegra,
        navegarMes,
        formatarValor,
        agruparEventosPorData,
    };
}