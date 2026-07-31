import { useState, useEffect, useCallback, useMemo } from 'react';
import CaixaPessoalRequests from '../fetch/CaixaPessoalRequests';
import type { MetaFinanceiraDTO } from '../interface/CaixaPessoalDTO';
import { useToast } from './useToast';

interface UseMetas {
  metas: MetaFinanceiraDTO[];
  carregando: boolean;
  erro: string | null;
  criarMeta: (payload: {
    nome: string;
    descricao?: string;
    valorAlvo: number;
    valorAtual?: number;
    prazo?: string;
  }) => Promise<MetaFinanceiraDTO | undefined>;
  atualizarMeta: (id: string, payload: {
    nome?: string;
    descricao?: string;
    valorAlvo?: number;
    valorAtual?: number;
    prazo?: string;
  }) => Promise<MetaFinanceiraDTO | undefined>;
  removerMeta: (id: string) => Promise<boolean>;
  recarregar: () => Promise<void>;
  totalAlvo: number;
  totalAtual: number;
  progressoMedio: number;
}

export function useMetas(): UseMetas {
  const [metas, setMetas] = useState<MetaFinanceiraDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const toast = useToast();

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);

    try {
      const dados = await CaixaPessoalRequests.listarMetas();
      if (!dados) {
        setErro('Erro ao carregar metas');
        setMetas([]);
        return;
      }
      setMetas(dados);
    } catch (e: any) {
      setErro(e?.message || 'Erro ao carregar metas');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const criarMeta = useCallback(async (payload: {
    nome: string;
    descricao?: string;
    valorAlvo: number;
    valorAtual?: number;
    prazo?: string;
  }) => {
    try {
      const meta = await CaixaPessoalRequests.criarMeta(payload);
      if (!meta) {
        toast.error('Erro ao criar meta');
        return undefined;
      }
      setMetas((prev) => [meta, ...prev]);
      toast.success('Meta criada com sucesso');
      return meta;
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao criar meta');
      return undefined;
    }
  }, [toast]);

  const atualizarMeta = useCallback(async (id: string, payload: {
    nome?: string;
    descricao?: string;
    valorAlvo?: number;
    valorAtual?: number;
    prazo?: string;
  }) => {
    try {
      const meta = await CaixaPessoalRequests.atualizarMeta(id, payload);
      if (!meta) {
        toast.error('Erro ao atualizar meta');
        return undefined;
      }
      setMetas((prev) => prev.map((item) => (item.id === id ? meta : item)));
      toast.success('Meta atualizada com sucesso');
      return meta;
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao atualizar meta');
      return undefined;
    }
  }, [toast]);

  const removerMeta = useCallback(async (id: string) => {
    try {
      const ok = await CaixaPessoalRequests.removerMeta(id);
      if (ok) {
        setMetas((prev) => prev.filter((meta) => meta.id !== id));
        toast.success('Meta removida');
        return true;
      }
      toast.error('Erro ao remover meta');
      return false;
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao remover meta');
      return false;
    }
  }, [toast]);

  const totalAlvo = useMemo(() => metas.reduce((sum, meta) => sum + meta.valorAlvo, 0), [metas]);
  const totalAtual = useMemo(() => metas.reduce((sum, meta) => sum + meta.valorAtual, 0), [metas]);
  const progressoMedio = useMemo(() => {
    if (metas.length === 0) return 0;
    return Number((metas.reduce((sum, meta) => sum + meta.percentual, 0) / metas.length).toFixed(2));
  }, [metas]);

  return {
    metas,
    carregando,
    erro,
    criarMeta,
    atualizarMeta,
    removerMeta,
    recarregar: carregar,
    totalAlvo,
    totalAtual,
    progressoMedio,
  };
}

export default useMetas;
