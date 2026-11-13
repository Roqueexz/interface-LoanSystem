import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { dataLocal, moeda, useAgenda } from '../../hooks/useAgenda';

export default function AgendaRecebimentos() {
  const { parcelas, carregando, erro } = useAgenda();
  const [mes, setMes] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [dia, setDia] = useState(dataLocal);
  const inicio = (mes.getDay() + 6) % 7;
  const dias = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
  const eventos = parcelas.filter(p => p.vencimento === dia);
  const atrasadas = parcelas.filter(p => p.vencimento < dataLocal());
  const mover = (n: number) => setMes(new Date(mes.getFullYear(), mes.getMonth() + n, 1));
  return <div className="mx-auto max-w-2xl space-y-6 pb-12"><header><p className="text-sm font-semibold text-emerald-700">SEUS RECEBIMENTOS</p><h1 className="mt-1 text-3xl font-bold text-foreground">Calendário</h1></header>
    {erro && <p role="alert" className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-800">{erro}</p>}
    <section className="rounded-3xl border border-border bg-card p-5"><div className="mb-5 flex items-center justify-between"><button onClick={() => mover(-1)} aria-label="Mês anterior" className="rounded-xl p-3 text-foreground"><ChevronLeft /></button><h2 className="font-bold capitalize text-foreground">{mes.toLocaleDateString('pt-BR', { month:'long', year:'numeric' })}</h2><button onClick={() => mover(1)} aria-label="Próximo mês" className="rounded-xl p-3 text-foreground"><ChevronRight /></button></div><div className="grid grid-cols-7 text-center text-xs font-semibold text-muted-foreground">{['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map(d => <span key={d}>{d}</span>)}</div><div className="mt-2 grid grid-cols-7">{Array.from({ length: inicio }, (_, i) => <span key={`v${i}`} />)}{Array.from({ length: dias }, (_, i) => { const numero = i + 1; const data = dataLocal(new Date(mes.getFullYear(), mes.getMonth(), numero)); const possui = parcelas.some(p => p.vencimento === data); return <button key={data} onClick={() => setDia(data)} aria-label={`${numero}, ${possui ? 'há recebimentos' : 'sem recebimentos'}`} className={`relative mx-auto my-1 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold ${dia === data ? 'bg-slate-900 text-white' : 'text-foreground hover:bg-muted'}`}>{numero}{possui && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-emerald-500" />}</button>; })}</div></section>
    <section className="rounded-3xl border border-border bg-card p-5"><h2 className="text-lg font-bold text-foreground">{new Date(`${dia}T12:00:00`).toLocaleDateString('pt-BR', { day:'numeric', month:'long' })}</h2>{carregando ? <p className="mt-4 text-sm text-muted-foreground">Carregando…</p> : eventos.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">Nenhum recebimento nesta data.</p> : <div className="mt-2 divide-y divide-border">{eventos.map(p => <Link key={p.id_parcela} to={`/clientes/${p.id_cliente}`} className="flex justify-between gap-3 py-4"><div><p className="font-semibold text-foreground">{p.nome} {p.sobrenome}</p><p className="text-sm text-muted-foreground">Parcela {p.numero_parcela} {p.vencimento < dataLocal() ? '· Em atraso' : ''}</p></div><span className="font-bold text-foreground">{moeda(p.valor)}</span></Link>)}</div>}</section>
    {!carregando && atrasadas.length > 0 && <section className="rounded-3xl border border-rose-100 bg-rose-50 p-5"><h2 className="font-bold text-rose-900">Em atraso · {atrasadas.length}</h2><div className="mt-2 divide-y divide-rose-100">{atrasadas.map(p => <Link key={p.id_parcela} to={`/clientes/${p.id_cliente}`} className="flex justify-between gap-3 py-3 text-sm text-rose-900"><span>{p.nome} {p.sobrenome} · {new Date(`${p.vencimento}T12:00:00`).toLocaleDateString('pt-BR')}</span><strong>{moeda(p.valor)}</strong></Link>)}</div></section>}
  </div>;
}
