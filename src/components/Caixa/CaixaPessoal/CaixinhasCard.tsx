import { useState, useEffect } from 'react';
import { PiggyBank, Plus, ArrowUpRight, ArrowDownRight, Sparkles, ShieldCheck } from 'lucide-react';
import { formatarMoeda } from '../../../services/Utilitario';

export interface Caixinha {
  id: string;
  nome: string;
  saldo: number;
  meta: number;
  categoria: string;
  cor: string;
}

const CAIXINHAS_PADRAO: Caixinha[] = [
  { id: '1', nome: 'Reserva de Emergência', saldo: 1500, meta: 5000, categoria: 'Segurança', cor: 'from-emerald-600 to-teal-700' },
  { id: '2', nome: 'Giro de Empréstimos', saldo: 3000, meta: 10000, categoria: 'Capital', cor: 'from-indigo-600 to-blue-700' },
  { id: '3', nome: 'Oportunidades & Investimento', saldo: 800, meta: 3000, categoria: 'Crescimento', cor: 'from-amber-500 to-orange-600' },
];

export function CaixinhasCard() {
  const [caixinhas, setCaixinhas] = useState<Caixinha[]>(() => {
    const salvos = localStorage.getItem('ls_caixinhas_pessoais');
    return salvos ? JSON.parse(salvos) : CAIXINHAS_PADRAO;
  });

  const [modalNovaAberto, setModalNovaAberto] = useState(false);
  const [modalOperacao, setModalOperacao] = useState<{ caixinha: Caixinha; tipo: 'deposito' | 'resgate' } | null>(null);

  const [novoNome, setNovoNome] = useState('');
  const [novaMeta, setNovaMeta] = useState('');
  const [valorOperacao, setValorOperacao] = useState('');

  useEffect(() => {
    localStorage.setItem('ls_caixinhas_pessoais', JSON.stringify(caixinhas));
  }, [caixinhas]);


  const handleCriarCaixinha = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim()) return;

    const nova: Caixinha = {
      id: Date.now().toString(),
      nome: novoNome.trim(),
      saldo: 0,
      meta: novaMeta ? Number(novaMeta) : 1000,
      categoria: 'Reserva',
      cor: 'from-purple-600 to-indigo-700',
    };

    setCaixinhas([...caixinhas, nova]);
    setNovoNome('');
    setNovaMeta('');
    setModalNovaAberto(false);
  };

  const handleExecutarOperacao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalOperacao || !valorOperacao || Number(valorOperacao) <= 0) return;

    const valor = Number(valorOperacao);

    setCaixinhas((prev) =>
      prev.map((c) => {
        if (c.id === modalOperacao.caixinha.id) {
          const novoSaldo =
            modalOperacao.tipo === 'deposito' ? c.saldo + valor : Math.max(0, c.saldo - valor);
          return { ...c, saldo: novoSaldo };
        }
        return c;
      })
    );

    setValorOperacao('');
    setModalOperacao(null);
  };

  return (
    <div className="space-y-4">
      {/* Header da Seção Caixinhas */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PiggyBank size={18} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-foreground">Caixinhas de Reserva</h3>
            <p className="text-[11px] text-muted-foreground">Guarde e administre seu dinheiro por objetivo</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setModalNovaAberto(true)}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-95 transition-all"
        >
          <Plus size={14} /> Nova Caixinha
        </button>
      </div>

      {/* Grid de Caixinhas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {caixinhas.map((item) => {
          const pct = Math.min(Math.round((item.saldo / (item.meta || 1)) * 100), 100);

          return (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-3xl bg-card border border-border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {item.categoria}
                  </span>
                  <div className="flex items-center gap-1">
                    <ShieldCheck size={14} className="text-emerald-500" />
                  </div>
                </div>

                <h4 className="text-sm font-bold text-foreground mt-2">{item.nome}</h4>
                <div className="mt-2">
                  <span className="text-xl font-extrabold text-foreground block">
                    {formatarMoeda(item.saldo)}
                  </span>
                  <span className="text-[11px] text-muted-foreground block mt-0.5">
                    Meta: {formatarMoeda(item.meta)} ({pct}%)
                  </span>
                </div>
              </div>

              {/* Barra de Progresso da Caixinha */}
              <div className="space-y-2">
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Botões de Ação Rápida */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setModalOperacao({ caixinha: item, tipo: 'deposito' })}
                    className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 py-1.5 text-xs font-bold active:scale-95 transition-all"
                  >
                    <ArrowUpRight size={14} /> Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOperacao({ caixinha: item, tipo: 'resgate' })}
                    className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl border border-border bg-muted/60 hover:bg-muted text-foreground py-1.5 text-xs font-semibold active:scale-95 transition-all"
                  >
                    <ArrowDownRight size={14} /> Resgatar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nova Caixinha */}
      {modalNovaAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2">
              <Sparkles className="text-primary" size={18} /> Criar Nova Caixinha
            </h3>
            <form onSubmit={handleCriarCaixinha} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Nome do Objetivo</label>
                <input
                  type="text"
                  placeholder="Ex: Viagem, Reforma, Fundo..."
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-muted/40 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Meta de Valor (R$)</label>
                <input
                  type="number"
                  placeholder="Ex: 5000"
                  value={novaMeta}
                  onChange={(e) => setNovaMeta(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-muted/40 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalNovaAberto(false)}
                  className="rounded-2xl border border-border bg-muted px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/80"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90"
                >
                  Criar Caixinha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Depósito / Resgate */}
      {modalOperacao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-foreground">
              {modalOperacao.tipo === 'deposito' ? 'Guardar Dinheiro em' : 'Resgatar Dinheiro de'}{' '}
              <span className="text-primary">{modalOperacao.caixinha.nome}</span>
            </h3>

            <p className="text-xs text-muted-foreground">
              Saldo atual nesta Caixinha: <strong>{formatarMoeda(modalOperacao.caixinha.saldo)}</strong>
            </p>

            <form onSubmit={handleExecutarOperacao} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={valorOperacao}
                  onChange={(e) => setValorOperacao(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-muted/40 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOperacao(null)}
                  className="rounded-2xl border border-border bg-muted px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/80"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`rounded-2xl px-5 py-2 text-xs font-bold text-white shadow-md transition-all ${
                    modalOperacao.tipo === 'deposito' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {modalOperacao.tipo === 'deposito' ? 'Confirmar Depósito' : 'Confirmar Resgate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CaixinhasCard;
