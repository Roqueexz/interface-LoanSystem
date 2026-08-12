import { useState, useEffect, useCallback } from 'react';
import CaixinhaRequests, { CaixinhaDTO, CriarCaixinhaInput } from '../fetch/CaixinhaRequests';
import { useToast } from './useToast';

export function useCaixinhas() {
  const [caixinhas, setCaixinhas] = useState<CaixinhaDTO[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  const toast = useToast();

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const lista = await CaixinhaRequests.listar();
      if (lista) {
        setCaixinhas(lista);
      }
    } catch (e: any) {
      setErro('Erro ao carregar caixinhas.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const criarCaixinha = async (dados: CriarCaixinhaInput) => {
    try {
      const nova = await CaixinhaRequests.criar(dados);
      if (nova) {
        setCaixinhas((prev) => [...prev, nova]);
        toast.success(`🎉 Caixinha "${nova.nome}" criada com sucesso!`);
      }
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar caixinha.');
      return false;
    }
  };

  const depositar = async (id_caixinha: number, valor: number) => {
    // Atualização otimista
    const prevList = [...caixinhas];
    setCaixinhas((prev) =>
      prev.map((c) => (c.id_caixinha === id_caixinha ? { ...c, saldo: c.saldo + valor } : c))
    );

    try {
      const atualizada = await CaixinhaRequests.depositar(id_caixinha, valor);
      if (atualizada) {
        setCaixinhas((prev) =>
          prev.map((c) => (c.id_caixinha === id_caixinha ? atualizada : c))
        );
        toast.success(`💚 R$ ${valor.toFixed(2)} guardados na caixinha!`);
      }
      return true;
    } catch (err: any) {
      // Reverter estado local
      setCaixinhas(prevList);
      toast.error(err.message || 'Erro ao depositar.');
      return false;
    }
  };

  const resgatar = async (id_caixinha: number, valor: number) => {
    // Atualização otimista
    const prevList = [...caixinhas];
    setCaixinhas((prev) =>
      prev.map((c) =>
        c.id_caixinha === id_caixinha ? { ...c, saldo: Math.max(0, c.saldo - valor) } : c
      )
    );

    try {
      const atualizada = await CaixinhaRequests.resgatar(id_caixinha, valor);
      if (atualizada) {
        setCaixinhas((prev) =>
          prev.map((c) => (c.id_caixinha === id_caixinha ? atualizada : c))
        );
        toast.success(`🔄 R$ ${valor.toFixed(2)} resgatados com sucesso!`);
      }
      return true;
    } catch (err: any) {
      // Reverter estado local
      setCaixinhas(prevList);
      toast.error(err.message || 'Erro ao resgatar.');
      return false;
    }
  };

  const remover = async (id_caixinha: number) => {
    const prevList = [...caixinhas];
    setCaixinhas((prev) => prev.filter((c) => c.id_caixinha !== id_caixinha));

    try {
      await CaixinhaRequests.remover(id_caixinha);
      toast.success('🗑️ Caixinha removida com sucesso!');
      return true;
    } catch (err: any) {
      setCaixinhas(prevList);
      toast.error(err.message || 'Erro ao remover caixinha.');
      return false;
    }
  };

  return {
    caixinhas,
    carregando,
    erro,
    recarregar: carregar,
    criarCaixinha,
    depositar,
    resgatar,
    remover,
  };
}
