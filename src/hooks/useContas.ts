import { useState, useEffect, useCallback, useMemo } from 'react';
import CaixaPessoalRequests from '../fetch/CaixaPessoalRequests';
import type { ContaCaixaPessoalDTO } from '../interface/CaixaPessoalDTO';
import { useToast } from './useToast';

interface UseContas {
  contas: ContaCaixaPessoalDTO[];
  proximasContas: ContaCaixaPessoalDTO[];
  contasAtrasadas: ContaCaixaPessoalDTO[];
  contasProgramadas: ContaCaixaPessoalDTO[];
  vencendoHoje: ContaCaixaPessoalDTO[];
  carregando: boolean;
  erro: string | null;
  criarConta: (payload: { tipo: 'pagar' | 'receber'; descricao: string; valor: number; vencimento: string; categoria?: string; recorrencia?: 'unica' | 'diaria' | 'semanal' | 'quinzenal' | 'mensal' | 'bimestral' | 'trimestral' | 'semestral' | 'anual'; prioridade?: 'alta' | 'media' | 'baixa'; lembrete_dias_antes?: number; observacao?: string; tags?: string[]; status?: 'programada' | 'pendente' | 'paga' | 'atrasada' | 'cancelada' }) => Promise<ContaCaixaPessoalDTO | undefined>;
  pagarConta: (id: string) => Promise<boolean>;
  removerConta: (id: string) => Promise<boolean>;
  buscarContas: (q: string) => ContaCaixaPessoalDTO[];
  recarregar: (filters?: { status?: string; categoria?: string; recorrencia?: string; prioridade?: string; q?: string; dias?: number }) => Promise<void>;
}

export function useContas(): UseContas {
  const [contas, setContas] = useState<ContaCaixaPessoalDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const toast = useToast();

  const carregar = useCallback(async (filters?: { status?: string; categoria?: string; recorrencia?: string; prioridade?: string; q?: string; dias?: number }) => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await CaixaPessoalRequests.listarContas(filters);
      if (!dados) {
        setErro('Erro ao carregar contas');
        setContas([]);
        return;
      }
      setContas(dados);
    } catch (e: any) {
      setErro(e?.message || 'Erro ao carregar contas');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const criarConta = useCallback(async (payload: { tipo: 'pagar' | 'receber'; descricao: string; valor: number; vencimento: string; categoria?: string; recorrencia?: 'unica' | 'diaria' | 'semanal' | 'quinzenal' | 'mensal' | 'bimestral' | 'trimestral' | 'semestral' | 'anual'; prioridade?: 'alta' | 'media' | 'baixa'; lembrete_dias_antes?: number; observacao?: string; tags?: string[]; status?: 'programada' | 'pendente' | 'paga' | 'atrasada' | 'cancelada' }) => {
    try {
      const conta = await CaixaPessoalRequests.criarConta(payload);
      if (!conta) {
        toast.error('Erro ao criar conta');
        return undefined;
      }
      setContas((prev) => [conta, ...prev]);
      toast.success('Conta criada com sucesso');
      return conta;
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao criar conta');
      return undefined;
    }
  }, [toast]);

  const pagarConta = useCallback(async (id: string) => {
    try {
      const ok = await CaixaPessoalRequests.pagarConta(id);
      if (ok) {
        setContas((prev) => prev.map((c) => (c.id === id ? { ...c, pago: true } : c)));
        toast.success('Conta marcada como paga');
        return true;
      }
      toast.error('Erro ao marcar conta como paga');
      return false;
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao marcar conta como paga');
      return false;
    }
  }, [toast]);

  const removerConta = useCallback(async (id: string) => {
    try {
      const ok = await CaixaPessoalRequests.removerConta(id);
      if (ok) {
        setContas((prev) => prev.filter((c) => c.id !== id));
        toast.success('Conta removida');
        return true;
      }
      toast.error('Erro ao remover conta');
      return false;
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao remover conta');
      return false;
    }
  }, [toast]);

  const hoje = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const proximasContas = useMemo(() => {
    const limite = new Date(hoje);
    limite.setDate(limite.getDate() + 7);

    return contas
      .filter((conta) => {
        if (conta.pago) return false;
        if (conta.status === 'cancelada') return false;
        if (!conta.vencimento) return false;
        const dataVencimento = new Date(conta.vencimento);
        return dataVencimento >= hoje && dataVencimento <= limite;
      })
      .sort((a, b) => a.vencimento.localeCompare(b.vencimento));
  }, [contas, hoje]);

  const vencendoHoje = useMemo(() => {
    return contas
      .filter((conta) => {
        if (conta.pago) return false;
        if (conta.status === 'cancelada') return false;
        if (!conta.vencimento) return false;
        const hojeStr = hoje.toISOString ? hoje.toISOString().slice(0, 10) : new Date(hoje).toISOString().slice(0, 10);
        return conta.vencimento === hojeStr;
      })
      .sort((a, b) => a.vencimento.localeCompare(b.vencimento));
  }, [contas, hoje]);

  const contasAtrasadas = useMemo(() => {
    return contas
      .filter((conta) => {
        if (conta.pago) return false;
        if (conta.status === 'cancelada') return false;
        if (!conta.vencimento) return false;
        const dataVencimento = new Date(conta.vencimento);
        return dataVencimento < hoje;
      })
      .sort((a, b) => a.vencimento.localeCompare(b.vencimento));
  }, [contas, hoje]);

  const contasProgramadas = useMemo(() => {
    return contas
      .filter((conta) => {
        if (conta.pago) return false;
        if (conta.status !== 'programada') return false;
        return Boolean(conta.vencimento);
      })
      .sort((a, b) => a.vencimento.localeCompare(b.vencimento));
  }, [contas]);

  const buscarContas = useCallback((q: string) => {
    const termo = q.trim().toLowerCase();
    if (!termo) return contas;

    return contas.filter((conta) => {
      const texto = [
        conta.descricao,
        conta.categoria,
        conta.recorrencia,
        conta.prioridade,
        conta.status,
        conta.observacao,
        ...(conta.tags ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return texto.includes(termo);
    });
  }, [contas]);

  return {
    contas,
    proximasContas,
    contasAtrasadas,
    contasProgramadas,
    vencendoHoje,
    carregando,
    erro,
    criarConta,
    pagarConta,
    removerConta,
    buscarContas,
    recarregar: carregar,
  };
}
