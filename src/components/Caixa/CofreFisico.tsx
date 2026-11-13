import { useCallback, useEffect, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Banknote, Coins, History, Minus, Plus, Vault } from 'lucide-react';
import { BaseRequests } from '../../fetch/BaseRequests';
import { SERVER_CFG } from '../../appConfig';
import type { CofreFisicoDTO } from '../../interface/CaixaPessoalDTO';

type Item = { valor: number; quantidade: number };
type Atividade = { id: number; tipo: 'entrada' | 'saida'; itens: Item[]; total_centavos: number; criado_em: string };
class CofreRequests extends BaseRequests {
  private endpoint = `${SERVER_CFG.ENDPOINT_CAIXA_PESSOAL}/cofre`;
  obter() { return this.request<CofreFisicoDTO>(this.endpoint); }
  historico() { return this.request<Atividade[]>(`${this.endpoint}/atividades`); }
  registrar(tipo: 'entrada' | 'saida', itens: Item[]) {
    return this.request(`${this.endpoint}/atividades`, { method: 'POST', body: JSON.stringify({ tipo, itens }) });
  }
}
const api = new CofreRequests();
const dinheiro = (valor: number) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function CofreFisico() {
  const [cofre, setCofre] = useState<CofreFisicoDTO>();
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [erro, setErro] = useState('');
  const [erroHistorico, setErroHistorico] = useState(false);
  const [tipo, setTipo] = useState<'entrada' | 'saida' | null>(null);
  const [quantidades, setQuantidades] = useState<Record<number, number>>({});
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    const [saldo, historico] = await Promise.all([api.obter(), api.historico()]);
    if (saldo.sucesso && saldo.dados) { setCofre(saldo.dados); setErro(''); }
    else setErro(saldo.erro || 'Não foi possível carregar o cofre.');
    if (historico.sucesso && historico.dados) { setAtividades(historico.dados); setErroHistorico(false); }
    else setErroHistorico(true);
  }, []);
  useEffect(() => { void Promise.resolve().then(carregar); }, [carregar]);
  const itens = Object.entries(quantidades).filter(([, q]) => q > 0).map(([valor, quantidade]) => ({ valor: Number(valor), quantidade }));
  const total = itens.reduce((soma, item) => soma + Math.round(item.valor * 100) * item.quantidade, 0) / 100;
  async function salvar() {
    if (!tipo || !itens.length || salvando) return;
    setSalvando(true);
    const resultado = await api.registrar(tipo, itens);
    setSalvando(false);
    if (!resultado.sucesso) { setErro(resultado.erro || 'Não foi possível salvar.'); return; }
    setTipo(null); setQuantidades({}); await carregar();
  }
  const grupos = [{ titulo: 'Cédulas', icon: Banknote, itens: cofre?.cedulas.filter(c => c.valor_cedula >= 2) }, { titulo: 'Moedas', icon: Coins, itens: cofre?.cedulas.filter(c => c.valor_cedula < 2) }];
  return <div className="mx-auto max-w-2xl space-y-6 pb-12 text-slate-900">
    <header><p className="text-sm font-semibold text-emerald-700">SEU DINHEIRO, SOB CONTROLE</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Cofre físico</h1><p className="mt-1 text-sm text-slate-500">Acompanhe o dinheiro guardado.</p></header>
    <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-lg shadow-slate-900/15">
      <div className="flex items-center gap-2 text-sm text-slate-300"><Vault size={18} /> Total no cofre</div>
      <p className="mt-3 text-4xl font-bold tracking-tight">{cofre ? dinheiro(cofre.total) : '—'}</p>
      <div className="mt-7 grid grid-cols-2 gap-3">
        <button onClick={() => { setErro(''); setQuantidades({}); setTipo('entrada'); }} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-3 font-bold text-slate-950"><Plus size={19} /> Adicionar</button>
        <button onClick={() => { setErro(''); setQuantidades({}); setTipo('saida'); }} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white/10 px-3 font-bold text-white"><Minus size={19} /> Retirar</button>
      </div>
    </section>
    {erro && <div role="alert" className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-800">{erro} <button className="underline" onClick={() => void carregar()}>Tentar novamente</button></div>}
    {grupos.map(grupo => <section key={grupo.titulo} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><grupo.icon size={20} className="text-emerald-700" /> {grupo.titulo}</h2><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{grupo.itens?.map(item => <div key={item.valor_cedula} className="rounded-2xl bg-slate-50 p-3"><p className="font-bold">{dinheiro(item.valor_cedula)}</p><p className="mt-1 text-sm text-slate-500">{item.quantidade} {item.quantidade === 1 ? 'unidade' : 'unidades'}</p></div>)}</div></section>)}
    <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><History size={20} className="text-emerald-700" /> Atividade recente</h2>{erroHistorico ? <p className="text-sm text-rose-700">Não foi possível carregar o histórico.</p> : atividades.length === 0 ? <p className="text-sm text-slate-500">Suas próximas movimentações aparecerão aqui.</p> : <div className="divide-y divide-slate-100">{atividades.map(a => <div key={a.id} className="flex items-start gap-3 py-4"><div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">{a.tipo === 'entrada' ? <ArrowDownLeft size={19} /> : <ArrowUpRight size={19} />}</div><div className="min-w-0 flex-1"><p className="font-semibold">{a.tipo === 'entrada' ? 'Adicionado' : 'Retirado'} · {dinheiro(Number(a.total_centavos) / 100)}</p><p className="mt-1 text-sm text-slate-500">{a.itens.map(i => `${i.quantidade} × ${dinheiro(i.valor)}`).join(' · ')}</p><p className="mt-1 text-xs text-slate-400">{new Date(a.criado_em).toLocaleString('pt-BR')}</p></div></div>)}</div>}</section>
    {tipo && <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="titulo-operacao"><div className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-5 sm:rounded-3xl"><div className="flex items-start justify-between gap-4"><div><h2 id="titulo-operacao" className="text-xl font-bold">{tipo === 'entrada' ? 'Adicionar ao cofre' : 'Retirar do cofre'}</h2><p className="mt-1 text-sm text-slate-500">Informe as quantidades de cada valor.</p></div><button onClick={() => setTipo(null)} disabled={salvando} className="min-h-11 px-2 text-sm font-semibold text-slate-600">Fechar</button></div><div className="mt-5 space-y-2">{cofre?.cedulas.map(c => <div key={c.valor_cedula} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-2"><span className="font-semibold">{dinheiro(c.valor_cedula)} <span className="block text-xs font-normal text-slate-500">No cofre: {c.quantidade}</span></span><div className="flex items-center gap-1"><button type="button" aria-label={`Diminuir ${dinheiro(c.valor_cedula)}`} onClick={() => setQuantidades(prev => ({ ...prev, [c.valor_cedula]: Math.max(0, (prev[c.valor_cedula] || 0) - 1) }))} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-700"><Minus size={18}/></button><input aria-label={`Quantidade de ${dinheiro(c.valor_cedula)}`} type="number" inputMode="numeric" min="0" max={tipo === 'saida' ? c.quantidade : 100000} value={quantidades[c.valor_cedula] || ''} placeholder="0" onChange={e => setQuantidades(prev => ({ ...prev, [c.valor_cedula]: Math.max(0, Math.min(100000, Math.floor(Number(e.target.value) || 0))) }))} className="h-12 w-16 rounded-xl border border-slate-200 bg-white px-2 text-center text-lg font-bold" /><button type="button" aria-label={`Aumentar ${dinheiro(c.valor_cedula)}`} onClick={() => setQuantidades(prev => ({ ...prev, [c.valor_cedula]: Math.min(100000, (prev[c.valor_cedula] || 0) + 1) }))} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-700"><Plus size={18}/></button></div></div>)}</div>{erro && <p role="alert" className="mt-3 text-sm text-rose-700">{erro}</p>}<div className="sticky bottom-0 mt-5 flex items-center justify-between gap-3 bg-white py-3"><div><p className="text-xs text-slate-500">Total da operação</p><p className="text-xl font-bold">{dinheiro(total)}</p></div><button disabled={!itens.length || salvando} onClick={() => void salvar()} className="min-h-12 rounded-2xl bg-emerald-500 px-6 font-bold text-slate-950 disabled:opacity-40">{salvando ? 'Salvando…' : 'Salvar'}</button></div></div></div>}
  </div>;
}
