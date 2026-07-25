import { useState, useEffect, useCallback } from 'react';
import CaixaPessoalRequests from '../fetch/CaixaPessoalRequests';
import type { ContaCaixaPessoalDTO } from '../interface/CaixaPessoalDTO';
import { useToast } from './useToast';

interface UseContas {
  contas: ContaCaixaPessoalDTO[];
  carregando: boolean;
  erro: string | null;
  criarConta: (payload: { tipo: 'pagar' | 'receber'; descricao: string; valor: number; vencimento: string }) => Promise<ContaCaixaPessoalDTO | undefined>;
  pagarConta: (id: string) => Promise<boolean>;
  removerConta: (id: string) => Promise<boolean>;
  recarregar: () => Promise<void>;
}

export function useContas(): UseContas {
  const [contas, setContas] = useState<ContaCaixaPessoalDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const toast = useToast();

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await CaixaPessoalRequests.listarContas();
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

  const criarConta = useCallback(async (payload: { tipo: 'pagar' | 'receber'; descricao: string; valor: number; vencimento: string }) => {
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

  return { contas, carregando, erro, criarConta, pagarConta, removerConta, recarregar: carregar };
}
