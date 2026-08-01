import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificacoesRequests from '../fetch/NotificacoesRequests';
import type { NotificacaoDTO, PreferenciaNotificacaoDTO } from '../interface/NotificacaoDTO';
import { useToast } from './useToast';

export function useNotificacoes() {
  const navigate = useNavigate();
  const toast = useToast();
  const [notificacoes, setNotificacoes] = useState<NotificacaoDTO[]>([]);
  const [resumo, setResumo] = useState({ total: 0, naoLidas: 0, criticas: 0 });
  const [preferencias, setPreferencias] = useState<PreferenciaNotificacaoDTO>({
    notificacoes_conta: true,
    notificacoes_parcela: true,
    notificacoes_meta: true,
    notificacoes_sistema: true,
    push_enabled: false,
    resumo_diario: true,
  });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await NotificacoesRequests.listar();
      const prefs = await NotificacoesRequests.obterPreferencias();
      if (dados) {
        setNotificacoes(dados.notificacoes);
        setResumo(dados.resumo);
      }
      if (prefs) {
        setPreferencias(prefs);
      }
      if (typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === 'granted' && dados?.notificacoes.some((item) => item.prioridade === 'critica')) {
        const critica = dados?.notificacoes.find((item) => item.prioridade === 'critica');
        if (critica && !document.hasFocus()) {
          new window.Notification(critica.titulo, { body: critica.mensagem, icon: '/favicon.svg' });
        }
      }
    } catch (e) {
      setErro('Não foi possível carregar a central de notificações');
      console.error(e);
    } finally {
      setCarregando(false);
    }
  }, []);

  const marcarLida = useCallback(async (id?: number) => {
    if (!id) return;
    const sucesso = await NotificacoesRequests.marcarComoLida(id);
    if (sucesso) {
      setNotificacoes((atual) => atual.map((item) => (item.id_notificacao === id ? { ...item, lida: true } : item)));
      setResumo((atual) => ({ ...atual, naoLidas: Math.max(0, atual.naoLidas - 1) }));
    }
  }, []);

  const arquivar = useCallback(async (id?: number) => {
    if (!id) return;
    const sucesso = await NotificacoesRequests.arquivar(id);
    if (sucesso) {
      setNotificacoes((atual) => atual.filter((item) => item.id_notificacao !== id));
    }
  }, []);

  const atualizarPreferencias = useCallback(async (proximasPreferencias: Partial<PreferenciaNotificacaoDTO>) => {
    const atualizadas = await NotificacoesRequests.atualizarPreferencias(proximasPreferencias);
    if (atualizadas) {
      setPreferencias((anterior) => ({ ...anterior, ...atualizadas }));
      toast.success('Preferências atualizadas');
    }
  }, [toast]);

  const solicitarPermissaoPush = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    const resposta = await window.Notification.requestPermission();
    if (resposta === 'granted') {
      await atualizarPreferencias({ push_enabled: true });
      toast.success('Notificações do navegador ativadas');
      return true;
    }
    toast.error('Permissão de notificações negada');
    return false;
  }, [atualizarPreferencias, toast]);

  const abrirDetalhe = useCallback((item: NotificacaoDTO) => {
    if (item.link) {
      navigate(item.link);
    }
    if (item.id_notificacao) {
      marcarLida(item.id_notificacao);
    }
  }, [marcarLida, navigate]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return useMemo(() => ({
    notificacoes,
    resumo,
    preferencias,
    carregando,
    erro,
    carregar,
    marcarLida,
    arquivar,
    atualizarPreferencias,
    solicitarPermissaoPush,
    abrirDetalhe,
  }), [abrirDetalhe, arquivar, atualizarPreferencias, carregando, carregar, erro, marcarLida, notificacoes, preferencias, resumo, solicitarPermissaoPush]);
}
