import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, CreditCard, Users, Vault } from 'lucide-react';
import { useCofre } from '../../hooks/useCofre';
import { dataLocal, moeda, useAgenda } from '../../hooks/useAgenda';

export default function Inicio() {
  const cofre = useCofre();
  const { parcelas, carregando, erro } = useAgenda();
  const hoje = dataLocal();
  const atrasadas = parcelas.filter(p => p.vencimento < hoje);
  const vencemHoje = parcelas.filter(p => p.vencimento === hoje);
  const proximas = parcelas.filter(p => p.vencimento >= hoje).slice(0, 4);
  const nome = (localStorage.getItem('nome') || '').split(' ')[0];
  return <div className="mx-auto max-w-2xl space-y-6 pb-12">
    <header><p className="text-sm font-semibold text-emerald-700">SEU DIA, MAIS SIMPLES</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Olá{nome ? `, ${nome}` : ''}.</h1><p className="mt-1 text-sm text-muted-foreground">Tudo o que importa, em um só lugar.</p></header>
    <Link to="/caixa" className="block rounded-3xl bg-slate-900 p-6 text-white shadow-lg"><div className="flex items-center gap-2 text-sm text-slate-300"><Vault size={18} /> Cofre físico</div><p className="mt-4 text-4xl font-bold tracking-tight">{cofre.erro ? 'Indisponível' : cofre.carregando ? '—' : moeda(cofre.total)}</p><div className="mt-6 flex items-center justify-between text-sm font-semibold text-emerald-300">Ver meu cofre <ArrowRight size={18} /></div></Link>
    <div className="grid grid-cols-2 gap-3"><Link to="/calendario" className="rounded-3xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">Vencem hoje</p><p className="mt-2 text-3xl font-bold text-foreground">{carregando || erro ? '—' : vencemHoje.length}</p><p className="mt-1 text-xs text-muted-foreground">parcelas</p></Link><Link to="/calendario" className="rounded-3xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">Em atraso</p><p className="mt-2 text-3xl font-bold text-rose-600">{carregando || erro ? '—' : atrasadas.length}</p><p className="mt-1 text-xs text-muted-foreground">parcelas</p></Link></div>
    {erro && <p role="alert" className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-800">{erro}</p>}
    <div className="grid grid-cols-3 gap-3">{[{to:'/emprestimos', icon:CreditCard, label:'Empréstimos'}, {to:'/clientes', icon:Users, label:'Clientes'}, {to:'/calendario', icon:CalendarDays, label:'Calendário'}].map(({to,icon:Icon,label}) => <Link key={to} to={to} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card text-center text-xs font-bold text-foreground"><Icon className="text-emerald-600" size={22}/>{label}</Link>)}</div>
    <section className="rounded-3xl border border-border bg-card p-5"><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-foreground">Próximos recebimentos</h2><Link to="/calendario" className="text-sm font-semibold text-emerald-700">Ver agenda</Link></div>{!carregando && !erro && proximas.length === 0 && <p className="mt-4 text-sm text-muted-foreground">Nenhuma parcela próxima.</p>}<div className="mt-2 divide-y divide-border">{proximas.map(p => <Link key={p.id_parcela} to={`/clientes/${p.id_cliente}`} className="flex items-center justify-between gap-3 py-4"><div><p className="font-semibold text-foreground">{p.nome} {p.sobrenome}</p><p className="text-sm text-muted-foreground">{new Date(`${p.vencimento}T12:00:00`).toLocaleDateString('pt-BR')}</p></div><span className="font-bold text-foreground">{moeda(p.valor)}</span></Link>)}</div></section>
  </div>;
}
