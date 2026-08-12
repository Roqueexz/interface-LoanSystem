import { useState, useEffect, useCallback } from 'react';
import AdminRequests from '../fetch/AdminRequests';
import type { CredorDTO, ResumoGlobalDTO, CriarCredorInput } from '../fetch/AdminRequests';
import { useToast } from './useToast';

export function useAdmin() {
  const [credores, setCredores] = useState<CredorDTO[]>([]);
  const [resumoGlobal, setResumoGlobal] = useState<ResumoGlobalDTO | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  const toast = useToast();

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const [resumoRes, credoresRes] = await Promise.all([
        AdminRequests.resumo(),
        AdminRequests.listarCredores(),
      ]);

      if (resumoRes) setResumoGlobal(resumoRes);
      if (credoresRes) setCredores(credoresRes);
    } catch (e: any) {
      setErro('Erro ao carregar dados do painel administrativo.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const criarCredor = async (dados: CriarCredorInput) => {
    try {
      const novo = await AdminRequests.criarCredor(dados);
      if (novo) {
        setCredores((prev) => [...prev, novo]);
        toast.success(`⚡ Credor "${novo.nome}" cadastrado com sucesso!`);
        carregarDados();
      }
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cadastrar credor.');
      return false;
    }
  };

  const suspenderCredor = async (id_usuario: number) => {
    try {
      await AdminRequests.suspenderCredor(id_usuario);
      setCredores((prev) =>
        prev.map((c) => (c.id_usuario === id_usuario ? { ...c, ativo: false } : c))
      );
      toast.warning('🚫 Acesso do credor suspenso com sucesso.');
      carregarDados();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Erro ao suspender credor.');
      return false;
    }
  };

  const reativarCredor = async (id_usuario: number) => {
    try {
      await AdminRequests.reativarCredor(id_usuario);
      setCredores((prev) =>
        prev.map((c) => (c.id_usuario === id_usuario ? { ...c, ativo: true } : c))
      );
      toast.success('✅ Acesso do credor reativado com sucesso!');
      carregarDados();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Erro ao reativar credor.');
      return false;
    }
  };

  const removerCredor = async (id_usuario: number) => {
    try {
      await AdminRequests.removerCredor(id_usuario);
      setCredores((prev) => prev.filter((c) => c.id_usuario !== id_usuario));
      toast.success('🗑️ Credor removido com sucesso!');
      carregarDados();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Erro ao remover credor.');
      return false;
    }
  };

  return {
    credores,
    resumoGlobal,
    carregando,
    erro,
    recarregar: carregarDados,
    criarCredor,
    suspenderCredor,
    reativarCredor,
    removerCredor,
  };
}
