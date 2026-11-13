import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BellRing } from 'lucide-react';
import { BaseRequests } from '../../fetch/BaseRequests';
import { dataLocal, moeda, useAgenda } from '../../hooks/useAgenda';

class PushRequests extends BaseRequests {
  chave() { return this.request<{ chave: string | null }>('/api/push/chave'); }
  salvar(inscricao: PushSubscriptionJSON, horario: string) { return this.request('/api/push/inscricao', { method:'POST', body: JSON.stringify({ inscricao, horario }) }); }
  excluir(endpoint: string) { return this.request('/api/push/inscricao', { method:'DELETE', body: JSON.stringify({ endpoint }) }); }
}
const api = new PushRequests();
function chaveBytes(base64: string): Uint8Array<ArrayBuffer> {
  const normalizada = (base64 + '='.repeat((4 - base64.length % 4) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(normalizada), c => c.charCodeAt(0));
}
export default function Alertas() {
  const { parcelas, erro, carregando } = useAgenda();
  const [horario, setHorario] = useState(() => localStorage.getItem('horario_alerta') || '09:00');
  const [ativo, setAtivo] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [ocupado, setOcupado] = useState(false);
  useEffect(() => { if ('serviceWorker' in navigator) void navigator.serviceWorker.ready.then(r => r.pushManager.getSubscription()).then(s => setAtivo(Boolean(s))); }, []);
  async function ativar() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !window.isSecureContext) { setMensagem('Seu navegador precisa oferecer suporte a notificações e usar HTTPS ou localhost.'); return; }
    setOcupado(true); setMensagem('');
    try {
      const resposta = await api.chave();
      if (!resposta.dados?.chave) throw new Error('O servidor ainda não está configurado para notificações.');
      if (await Notification.requestPermission() !== 'granted') throw new Error('Permissão de notificações não concedida no navegador.');
      const registro = await navigator.serviceWorker.ready;
      const inscricao = await registro.pushManager.getSubscription() || await registro.pushManager.subscribe({ userVisibleOnly:true, applicationServerKey:chaveBytes(resposta.dados.chave) });
      const salvo = await api.salvar(inscricao.toJSON(), horario);
      if (!salvo.sucesso) throw new Error(salvo.erro || 'Não foi possível salvar a inscrição.');
      localStorage.setItem('horario_alerta', horario); setAtivo(true); setMensagem('Alertas ativados neste aparelho.');
    } catch (e) { setMensagem(e instanceof Error ? e.message : 'Não foi possível ativar os alertas.'); }
    finally { setOcupado(false); }
  }
  async function desativar() {
    setOcupado(true); setMensagem('');
    try { const registro = await navigator.serviceWorker.ready; const inscricao = await registro.pushManager.getSubscription(); if (inscricao) { const resultado = await api.excluir(inscricao.endpoint); if (!resultado.sucesso) throw new Error('Não foi possível desativar os alertas no servidor.'); await inscricao.unsubscribe(); } setAtivo(false); setMensagem('Alertas desativados neste aparelho.'); }
    catch (e) { setMensagem(e instanceof Error ? e.message : 'Não foi possível desativar.'); } finally { setOcupado(false); }
  }
  const limite = new Date(); limite.setDate(limite.getDate() + 1);
  const relevantes = parcelas.filter(p => p.vencimento <= dataLocal(limite));
  return <div className="mx-auto max-w-2xl space-y-6 pb-12"><header><p className="text-sm font-semibold text-emerald-700">ACOMPANHE SEUS PRAZOS</p><h1 className="mt-1 text-3xl font-bold text-foreground">Notificações</h1></header>
    <section className="rounded-3xl bg-slate-900 p-6 text-white"><BellRing className="text-emerald-400"/><h2 className="mt-3 text-xl font-bold">Alertas no celular</h2><p className="mt-2 text-sm text-slate-300">Avisos um dia antes, no vencimento e diariamente enquanto houver atraso.</p><label className="mt-5 block text-sm font-semibold">Horário do aviso <input type="time" value={horario} onChange={e => setHorario(e.target.value)} className="ml-3 rounded-xl bg-white p-2 text-slate-900"/></label><div className="mt-4 flex flex-wrap gap-3"><button disabled={ocupado || !horario} onClick={() => void ativar()} className="min-h-12 rounded-2xl bg-emerald-400 px-5 font-bold text-slate-950 disabled:opacity-50">{ativo ? 'Salvar horário' : 'Ativar alertas'}</button>{ativo && <button disabled={ocupado} onClick={() => void desativar()} className="min-h-12 rounded-2xl bg-white/10 px-5 font-bold">Desativar</button>}</div>{mensagem && <p role="status" className="mt-3 text-sm text-white">{mensagem}</p>}</section>
    <section className="rounded-3xl border border-border bg-card p-5"><h2 className="text-lg font-bold text-foreground">Precisam de atenção</h2>{erro && <p role="alert" className="mt-3 text-sm text-rose-700">{erro}</p>}{!erro && !carregando && relevantes.length === 0 && <p className="mt-3 text-sm text-muted-foreground">Nenhum recebimento próximo ou atrasado.</p>}<div className="mt-2 divide-y divide-border">{relevantes.map(p => <Link key={p.id_parcela} to={`/clientes/${p.id_cliente}`} className="flex justify-between gap-3 py-4"><div><p className="font-semibold text-foreground">{p.nome} {p.sobrenome}</p><p className="text-sm text-muted-foreground">{p.vencimento < dataLocal() ? 'Em atraso' : p.vencimento === dataLocal() ? 'Vence hoje' : 'Vence amanhã'}</p></div><strong className="text-foreground">{moeda(p.valor)}</strong></Link>)}</div></section></div>;
}
