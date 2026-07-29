import { useState, useEffect, useCallback } from 'react';
import CaixaPessoalRequests from '../fetch/CaixaPessoalRequests';
import type { MovimentacaoCaixaPessoalDTO } from '../interface/CaixaPessoalDTO';
import { useToast } from './useToast';

interface UseMovimentacoes {
  movimentacoes: MovimentacaoCaixaPessoalDTO[];
  carregando: boolean;
  erro: string | null;
  criarMovimentacao: (payload: { tipo: 'entrada' | 'saida'; valor: number; categoria: string; descricao?: string; data?: string }) => Promise<MovimentacaoCaixaPessoalDTO | undefined>;
  removerMovimentacao: (id: string) => Promise<boolean>;
  recarregar: () => Promise<void>;
  entradas: number;
  saidas: number;
}

export function useMovimentacoes(): UseMovimentacoes {
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoCaixaPessoalDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const toast = useToast();

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await CaixaPessoalRequests.listarMovimentacoes();
      if (!dados) {
        setErro('Erro ao carregar movimentações');
        setMovimentacoes([]);
        return;
      }
      // Ordena por data decrescente por padrão (mais recente primeiro)
      const ordenado = dados.slice().sort((a, b) => (b.data.localeCompare(a.data)));
      setMovimentacoes(ordenado);
    } catch (e: any) {
      setErro(e?.message || 'Erro ao carregar movimentações');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const criarMovimentacao = useCallback(async (payload: { tipo: 'entrada' | 'saida'; valor: number; categoria: string; descricao?: string; data?: string }) => {
    try {
      const m = await CaixaPessoalRequests.criarMovimentacao(payload);
      if (!m) {
        toast.error('Erro ao criar movimentação');
        return undefined;
      }
      setMovimentacoes((prev) => [m, ...prev]);
      toast.success('Movimentação registrada');
      return m;
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao criar movimentação');
      return undefined;
    }
  }, [toast]);

  const removerMovimentacao = useCallback(async (id: string) => {
    try {
      const ok = await CaixaPessoalRequests.removerMovimentacao(id);
      if (ok) {
        setMovimentacoes((prev) => prev.filter((m) => m.id !== id));
        toast.success('Movimentação removida');
        return true;
      }
      toast.error('Erro ao remover movimentação');
      return false;
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao remover movimentação');
      return false;
    }
  }, [toast]);

  const entradas = movimentacoes.reduce((acc, m) => acc + (m.tipo === 'entrada' ? m.valor : 0), 0);
  const saidas = movimentacoes.reduce((acc, m) => acc + (m.tipo === 'saida' ? m.valor : 0), 0);

  return { movimentacoes, carregando, erro, criarMovimentacao, removerMovimentacao, recarregar: carregar, entradas, saidas };
}

export default useMovimentacoes;