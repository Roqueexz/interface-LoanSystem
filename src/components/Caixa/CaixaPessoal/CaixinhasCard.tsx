import React, { useState } from 'react';
import { PiggyBank, Plus, ArrowUpRight, ArrowDownRight, Sparkles, Trash2, ShieldCheck, Loader2 } from 'lucide-react';
import { formatarMoeda } from '../../../services/Utilitario';
import { useCaixinhas } from '../../../hooks/useCaixinhas';
import { CaixinhaDTO } from '../../../fetch/CaixinhaRequests';
import ModalConfirmacao from '../../../ui/Modal/ModalConfirmacao';

const EMOJIS_SUGERIDOS = ['🐷', '🚗', '🏠', '✈️', '💍', '🎓', '📱', '💻', '🏖️', '🚢', '🎂', '🎮', '🏋️', '🎁', '📈', '🛡️', '💎', '🚀', '🌟', '✨'];

const CORES_DISPONIVEIS = [
  { id: 'indigo', label: 'Índigo', bg: 'from-indigo-600 to-blue-700', badge: 'bg-indigo-500/10 text-indigo-500' },
  { id: 'emerald', label: 'Esmeralda', bg: 'from-emerald-600 to-teal-700', badge: 'bg-emerald-500/10 text-emerald-500' },
  { id: 'amber', label: 'Âmbar', bg: 'from-amber-500 to-orange-600', badge: 'bg-amber-500/10 text-amber-500' },
  { id: 'purple', label: 'Púrpura', bg: 'from-purple-600 to-pink-700', badge: 'bg-purple-500/10 text-purple-500' },
  { id: 'rose', label: 'Rosê', bg: 'from-rose-600 to-red-700', badge: 'bg-rose-500/10 text-rose-500' },
  { id: 'cyan', label: 'Ciano', bg: 'from-cyan-600 to-blue-700', badge: 'bg-cyan-500/10 text-cyan-500' },
];

const CHIPS_SUGESTAO = [
  { nome: 'Reserva de Emergência', emoji: '🛡️', cor: 'emerald', meta: '5000' },
  { nome: 'Viagem dos Sonhos', emoji: '✈️', cor: 'cyan', meta: '3000' },
  { nome: 'Reforma da Casa', emoji: '🏠', cor: 'amber', meta: '10000' },
  { nome: 'Troca de Carro', emoji: '🚗', cor: 'indigo', meta: '15000' },
  { nome: 'Investimento Futuro', emoji: '📈', cor: 'purple', meta: '2000' },
];

export function CaixinhasCard() {
  const { caixinhas, carregando, criarCaixinha, depositar, resgatar, remover } = useCaixinhas();

  const [modalNovaAberto, setModalNovaAberto] = useState(false);
  const [modalOperacao, setModalOperacao] = useState<{ caixinha: CaixinhaDTO; tipo: 'deposito' | 'resgate' } | null>(null);
  const [caixinhaExcluir, setCaixinhaExcluir] = useState<CaixinhaDTO | null>(null);

  const [novoNome, setNovoNome] = useState('');
  const [novaMeta, setNovaMeta] = useState('');
  const [emojiSelecionado, setEmojiSelecionado] = useState('🐷');
  const [corSelecionada, setCorSelecionada] = useState('indigo');
  const [valorOperacao, setValorOperacao] = useState('');
  const [submetendo, setSubmetendo] = useState(false);

  const handleAplicarChip = (chip: typeof CHIPS_SUGESTAO[0]) => {
    setNovoNome(chip.nome);
    setEmojiSelecionado(chip.emoji);
    setCorSelecionada(chip.cor);
    setNovaMeta(chip.meta);
  };

  const handleCriarCaixinha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim()) return;

    setSubmetendo(true);
    const ok = await criarCaixinha({
      nome: novoNome.trim(),
      meta: novaMeta ? Number(novaMeta) : null,
      emoji: emojiSelecionado,
      cor: corSelecionada,
    });
    setSubmetendo(false);

    if (ok) {
      setNovoNome('');
      setNovaMeta('');
      setEmojiSelecionado('🐷');
      setCorSelecionada('indigo');
      setModalNovaAberto(false);
    }
  };

  const handleExecutarOperacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalOperacao || !valorOperacao || Number(valorOperacao) <= 0) return;

    const valor = Number(valorOperacao);
    setSubmetendo(true);

    if (modalOperacao.tipo === 'deposito') {
      await depositar(modalOperacao.caixinha.id_caixinha, valor);
    } else {
      await resgatar(modalOperacao.caixinha.id_caixinha, valor);
    }

    setSubmetendo(false);
    setValorOperacao('');
    setModalOperacao(null);
  };

  const handleConfirmarExclusao = async () => {
    if (!caixinhaExcluir) return;
    await remover(caixinhaExcluir.id_caixinha);
    setCaixinhaExcluir(null);
  };

  const getCorObj = (corId?: string) => {
    return CORES_DISPONIVEIS.find((c) => c.id === corId) || CORES_DISPONIVEIS[0];
  };

  return (
    <div className="space-y-4">
      {/* Header da Seção Caixinhas */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PiggyBank size={20} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-foreground">Caixinhas de Reserva</h3>
            <p className="text-[11px] text-muted-foreground">Guarde e administre seu dinheiro por objetivo</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setModalNovaAberto(true)}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-95 transition-all"
        >
          <Plus size={14} /> Nova Caixinha
        </button>
      </div>

      {/* Loading State */}
      {carregando && (
        <div className="flex items-center justify-center p-8 bg-card rounded-3xl border border-border">
          <Loader2 size={24} className="animate-spin text-primary mr-2" />
          <span className="text-xs font-medium text-muted-foreground">Carregando caixinhas...</span>
        </div>
      )}

      {/* Empty State */}
      {!carregando && caixinhas.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-card border border-border rounded-3xl shadow-sm space-y-4">
          <div className="relative">
            <span className="text-6xl animate-bounce inline-block">🐷</span>
            <div className="absolute -inset-2 bg-primary/10 blur-xl rounded-full -z-10" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-foreground">Nenhuma caixinha criada</h4>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Guarde seu dinheiro por objetivo — reserva de emergência, viagem, reforma ou investimentos.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalNovaAberto(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 active:scale-95 transition-all"
          >
            <Plus size={16} /> Criar primeira caixinha
          </button>
        </div>
      )}

      {/* Carrossel de Caixinhas (Nubank Style Snap Scroll) */}
      {!carregando && caixinhas.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 snap-x snap-mandatory scrollbar-none">
          {caixinhas.map((item) => {
            const metaVal = item.meta || 0;
            const pct = metaVal > 0 ? Math.min(Math.round((item.saldo / metaVal) * 100), 100) : 0;
            const corObj = getCorObj(item.cor);

            return (
              <div
                key={item.id_caixinha}
                className="snap-start shrink-0 w-[240px] sm:w-[260px] relative overflow-hidden rounded-3xl bg-card border border-border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.emoji || '🐷'}</span>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${corObj.badge}`}>
                        Reserva
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCaixinhaExcluir(item)}
                      className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Excluir caixinha"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-foreground mt-3 truncate" title={item.nome}>
                    {item.nome}
                  </h4>

                  <div className="mt-2">
                    <span className="text-xl font-extrabold text-foreground block">
                      {formatarMoeda(item.saldo)}
                    </span>
                    {metaVal > 0 ? (
                      <span className="text-[11px] text-muted-foreground block mt-0.5">
                        Meta: {formatarMoeda(metaVal)} ({pct}%)
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground block mt-0.5">
                        Sem meta definida
                      </span>
                    )}
                  </div>
                </div>

                {/* Barra de Progresso */}
                <div className="space-y-2">
                  {metaVal > 0 && (
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${corObj.bg} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}

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

          {/* Card Tracejado "+ Nova Caixinha" */}
          <button
            type="button"
            onClick={() => setModalNovaAberto(true)}
            className="snap-start shrink-0 w-[180px] rounded-3xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40 p-5 flex flex-col items-center justify-center text-center space-y-2 group transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus size={20} />
            </div>
            <span className="text-xs font-bold text-foreground">Nova Caixinha</span>
            <span className="text-[10px] text-muted-foreground">Criar objetivo</span>
          </button>
        </div>
      )}

      {/* Modal Criar Nova Caixinha */}
      {modalNovaAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                <Sparkles className="text-primary" size={18} /> Criar Nova Caixinha
              </h3>
              <button
                onClick={() => setModalNovaAberto(false)}
                className="text-muted-foreground hover:text-foreground text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Chips de Atalho */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Sugestões Rápidas
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CHIPS_SUGESTAO.map((chip) => (
                  <button
                    key={chip.nome}
                    type="button"
                    onClick={() => handleAplicarChip(chip)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-medium transition-all active:scale-95"
                  >
                    <span>{chip.emoji}</span>
                    <span>{chip.nome}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCriarCaixinha} className="space-y-4">
              {/* Picker de Emoji */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">Escolha um Ícone / Emoji</label>
                <div className="grid grid-cols-10 gap-1 p-2 rounded-2xl bg-muted/40 border border-border">
                  {EMOJIS_SUGERIDOS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setEmojiSelecionado(emoji)}
                      className={`h-8 w-8 text-lg flex items-center justify-center rounded-xl transition-all ${
                        emojiSelecionado === emoji ? 'bg-primary/20 scale-110 shadow-sm border border-primary/40' : 'hover:bg-muted'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Picker de Cor */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">Tema de Cor</label>
                <div className="grid grid-cols-6 gap-2">
                  {CORES_DISPONIVEIS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCorSelecionada(c.id)}
                      className={`h-8 rounded-xl bg-gradient-to-r ${c.bg} transition-all ${
                        corSelecionada === c.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105' : 'opacity-70 hover:opacity-100'
                      }`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              {/* Nome */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Nome do Objetivo *</label>
                <input
                  type="text"
                  placeholder="Ex: Viagem de Férias, Reserva de Emergência..."
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-muted/40 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Meta */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Meta de Valor (R$) - Opcional</label>
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
                  disabled={submetendo}
                  className="rounded-2xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {submetendo && <Loader2 size={14} className="animate-spin" />}
                  <span>{submetendo ? 'Criando...' : 'Criar Caixinha'}</span>
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
            <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <span className="text-2xl">{modalOperacao.caixinha.emoji || '🐷'}</span>
              <span>
                {modalOperacao.tipo === 'deposito' ? 'Guardar em' : 'Resgatar de'}{' '}
                <span className="text-primary">{modalOperacao.caixinha.nome}</span>
              </span>
            </h3>

            <p className="text-xs text-muted-foreground bg-muted/50 p-2.5 rounded-xl">
              Saldo atual nesta caixinha: <strong className="text-foreground">{formatarMoeda(modalOperacao.caixinha.saldo)}</strong>
            </p>

            {/* Chips de Valor Rápido */}
            <div className="flex gap-2">
              {[50, 100, 200, 500].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setValorOperacao(v.toString())}
                  className="flex-1 py-1 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold transition-all"
                >
                  +R${v}
                </button>
              ))}
            </div>

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
                  disabled={submetendo}
                  className={`rounded-2xl px-5 py-2 text-xs font-bold text-white shadow-md transition-all inline-flex items-center gap-1.5 ${
                    modalOperacao.tipo === 'deposito' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {submetendo && <Loader2 size={14} className="animate-spin" />}
                  <span>{modalOperacao.tipo === 'deposito' ? 'Confirmar Guardar' : 'Confirmar Resgate'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmação Exclusão */}
      <ModalConfirmacao
        isOpen={!!caixinhaExcluir}
        onClose={() => setCaixinhaExcluir(null)}
        onConfirm={handleConfirmarExclusao}
        title="Excluir Caixinha"
        message={`Tem certeza que deseja excluir a caixinha "${caixinhaExcluir?.nome}"? Os valores guardados deixarão de ser contabilizados nesta caixinha.`}
        confirmText="Excluir Caixinha"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}

export default CaixinhasCard;
