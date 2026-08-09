import { useState, useMemo } from 'react';
import { AlertCircle, Bell, BellRing, CheckCheck, ChevronRight, EyeOff, Sparkles, Filter, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotificacoes } from '../../hooks/useNotificacoes';
import { Alert, AlertDescription, AlertTitle } from '../../ui/Alert';
import { Badge } from '../../ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Skeleton } from '../../ui/Skeleton';

function prioridadeLabel(prioridade: string) {
  switch (prioridade) {
    case 'critica':
      return 'Crítica';
    case 'alta':
      return 'Alta';
    case 'media':
      return 'Média';
    default:
      return 'Baixa';
  }
}

function tipoLabel(tipo: string) {
  switch (tipo) {
    case 'conta':
      return 'Conta';
    case 'parcela':
      return 'Recebimento';
    case 'meta':
      return 'Meta';
    case 'sistema':
      return 'Sistema';
    default:
      return 'Movimentação';
  }
}

type FiltroTipo = 'TODAS' | 'VENCIMENTOS' | 'ALERTAS' | 'SISTEMA';

export default function CentralNotificacoes() {
  const navigate = useNavigate();
  const {
    notificacoes,
    resumo,
    preferencias,
    carregando,
    erro,
    marcarLida,
    arquivar,
    atualizarPreferencias,
    solicitarPermissaoPush,
    abrirDetalhe,
  } = useNotificacoes();

  const [filtroAtivo, setFiltroAtivo] = useState<FiltroTipo>('TODAS');

  // Notificações filtradas por categoria
  const notificacoesFiltradas = useMemo(() => {
    if (filtroAtivo === 'TODAS') return notificacoes;
    if (filtroAtivo === 'VENCIMENTOS') {
      return notificacoes.filter((n) => n.tipo === 'conta' || n.tipo === 'parcela');
    }
    if (filtroAtivo === 'ALERTAS') {
      return notificacoes.filter((n) => n.prioridade === 'critica' || n.prioridade === 'alta');
    }
    if (filtroAtivo === 'SISTEMA') {
      return notificacoes.filter((n) => n.tipo === 'sistema' || n.tipo === 'meta');
    }
    return notificacoes;
  }, [notificacoes, filtroAtivo]);

  // Agrupamento por período: Hoje, Esta Semana e Anteriores
  const notificacoesAgrupadas = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const seteDiasAtras = new Date(hoje);
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

    const grupos = {
      hoje: [] as typeof notificacoes,
      semana: [] as typeof notificacoes,
      anteriores: [] as typeof notificacoes,
    };

    notificacoesFiltradas.forEach((item) => {
      const dataItem = item.data_criacao ? new Date(item.data_criacao) : new Date();
      dataItem.setHours(0, 0, 0, 0);

      if (dataItem.getTime() === hoje.getTime()) {
        grupos.hoje.push(item);
      } else if (dataItem >= seteDiasAtras) {
        grupos.semana.push(item);
      } else {
        grupos.anteriores.push(item);
      }
    });

    return grupos;
  }, [notificacoesFiltradas]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 pb-20">
      {/* Header Mobile First */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles size={14} />
            <span>Central Inteligente</span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">Notificações</h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Lembretes de parcelas, faturas prestes a vencer e alertas financeiros.
          </p>
        </div>
        <button
          type="button"
          onClick={solicitarPermissaoPush}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-muted/50 px-4 py-2.5 text-xs font-semibold hover:bg-muted active:scale-95 transition-all text-foreground"
        >
          <BellRing className="h-4 w-4 text-indigo-500" />
          Ativar Alertas Push
        </button>
      </div>

      {erro ? (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      ) : null}

      {/* Cards de Resumo Rápido */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm">
          <span className="text-[11px] font-semibold text-muted-foreground block mb-1">Não lidas</span>
          {carregando ? <Skeleton className="h-7 w-12 mx-auto" /> : <div className="text-xl font-bold text-primary">{resumo.naoLidas}</div>}
        </div>

        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-center shadow-sm">
          <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 block mb-1">Críticas</span>
          {carregando ? <Skeleton className="h-7 w-12 mx-auto" /> : <div className="text-xl font-bold text-rose-600 dark:text-rose-400">{resumo.criticas}</div>}
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm">
          <span className="text-[11px] font-semibold text-muted-foreground block mb-1">Total</span>
          {carregando ? <Skeleton className="h-7 w-12 mx-auto" /> : <div className="text-xl font-bold text-foreground">{resumo.total}</div>}
        </div>
      </div>

      {/* Chips de Filtro Rápido */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['TODAS', 'VENCIMENTOS', 'ALERTAS', 'SISTEMA'] as FiltroTipo[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFiltroAtivo(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
              filtroAtivo === f
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border border-border bg-card text-muted-foreground hover:bg-muted'
            }`}
          >
            {f === 'TODAS' && 'Todas'}
            {f === 'VENCIMENTOS' && '⏰ Vencimentos'}
            {f === 'ALERTAS' && '⚠️ Críticos'}
            {f === 'SISTEMA' && '💡 Sistema & Metas'}
          </button>
        ))}
      </div>

      {/* Lista de Alertas Agrupados por Período */}
      <div className="space-y-6">
        {carregando ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        ) : notificacoesFiltradas.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-8 text-center bg-card">
            <Bell className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2 animate-bounce" />
            <p className="text-sm font-semibold text-foreground">Nenhuma notificação encontrada.</p>
            <p className="text-xs text-muted-foreground mt-1">Tudo em ordem e alinhado na sua gestão financeira!</p>
          </div>
        ) : (
          <>
            {/* Grupo: Hoje */}
            {notificacoesAgrupadas.hoje.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1 flex items-center gap-1.5">
                  <Calendar size={13} className="text-primary" /> Hoje
                </h3>
                {notificacoesAgrupadas.hoje.map((item) => (
                  <CardNotificacaoItem
                    key={item.id_notificacao}
                    item={item}
                    marcarLida={marcarLida}
                    arquivar={arquivar}
                    abrirDetalhe={abrirDetalhe}
                    navigate={navigate}
                  />
                ))}
              </div>
            )}

            {/* Grupo: Esta Semana */}
            {notificacoesAgrupadas.semana.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1 flex items-center gap-1.5">
                  <Calendar size={13} /> Esta Semana
                </h3>
                {notificacoesAgrupadas.semana.map((item) => (
                  <CardNotificacaoItem
                    key={item.id_notificacao}
                    item={item}
                    marcarLida={marcarLida}
                    arquivar={arquivar}
                    abrirDetalhe={abrirDetalhe}
                    navigate={navigate}
                  />
                ))}
              </div>
            )}

            {/* Grupo: Anteriores */}
            {notificacoesAgrupadas.anteriores.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1 flex items-center gap-1.5">
                  <Calendar size={13} /> Anteriores
                </h3>
                {notificacoesAgrupadas.anteriores.map((item) => (
                  <CardNotificacaoItem
                    key={item.id_notificacao}
                    item={item}
                    marcarLida={marcarLida}
                    arquivar={arquivar}
                    abrirDetalhe={abrirDetalhe}
                    navigate={navigate}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Painel de Preferências Expansível */}
      <Card className="rounded-3xl border border-border shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/40 pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Filter size={16} className="text-primary" /> Preferências de Notificação
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex flex-col gap-2">
          {[
            { key: 'notificacoes_conta', label: 'Alertas de Contas & Faturas', description: 'Contas a pagar e vencimentos próximos' },
            { key: 'notificacoes_parcela', label: 'Parcelas de Empréstimo', description: 'Lembretes de recebimento de clientes' },
            { key: 'notificacoes_meta', label: 'Metas Financeiras', description: 'Acompanhamento de objetivos' },
            { key: 'notificacoes_sistema', label: 'Sistema & Novidades', description: 'Atualizações e relatórios do aplicativo' },
          ].map((item) => {
            const value = preferencias[item.key as keyof typeof preferencias] as boolean;
            return (
              <label key={item.key} className="flex items-center justify-between rounded-2xl border border-border p-3.5 hover:bg-muted/30 transition-colors cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-foreground">{item.label}</div>
                  <div className="text-[11px] text-muted-foreground">{item.description}</div>
                </div>
                <input
                  type="checkbox"
                  checked={value ?? true}
                  onChange={() => atualizarPreferencias({ [item.key]: !value })}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
              </label>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

// Componente Interno para Renderização de Item de Notificação
function CardNotificacaoItem({
  item,
  marcarLida,
  arquivar,
  navigate,
}: {
  item: any;
  marcarLida: (id: number) => void;
  arquivar: (id: number) => void;
  abrirDetalhe?: (item: any) => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const isCritica = item.prioridade === 'critica';
  const isAlta = item.prioridade === 'alta';

  return (
    <div className={`rounded-2xl border p-4 transition-all shadow-sm ${
      item.lida
        ? 'border-border bg-card opacity-85'
        : isCritica
        ? 'border-rose-500/40 bg-rose-500/5 dark:bg-rose-950/20 ring-1 ring-rose-500/20'
        : isAlta
        ? 'border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/20'
        : 'border-primary/30 bg-primary/5'
    }`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            isCritica ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' : isAlta ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-primary/20 text-primary'
          }`}>
            {isCritica ? <AlertCircle className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-extrabold text-foreground">{item.titulo}</span>
              <Badge variant={isCritica ? 'destructive' : isAlta ? 'secondary' : 'default'} className="text-[10px] py-0 px-2">
                {prioridadeLabel(item.prioridade)}
              </Badge>
              <Badge variant="secondary" className="text-[10px] py-0 px-2">
                {tipoLabel(item.tipo)}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.mensagem}</p>
            <p className="mt-1.5 text-[10px] font-medium text-muted-foreground/70">
              {item.data_criacao ? new Date(item.data_criacao).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : 'Agora'}
            </p>
          </div>
        </div>

        {/* Botões de Ação Rápida */}
        <div className="flex items-center gap-1.5 self-end md:self-center">
          {item.tipo === 'parcela' && (
            <button
              type="button"
              onClick={() => navigate('/emprestimos')}
              className="inline-flex items-center gap-1 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 text-xs font-bold active:scale-95 transition-all"
            >
              <ChevronRight className="h-3.5 w-3.5" /> Empréstimos
            </button>
          )}

          {item.tipo === 'conta' && (
            <button
              type="button"
              onClick={() => navigate('/calendario?data=hoje')}
              className="inline-flex items-center gap-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 px-3 py-1.5 text-xs font-bold active:scale-95 transition-all"
            >
              <Calendar className="h-3.5 w-3.5" /> Ver Calendário
            </button>
          )}

          {!item.lida && (
            <button
              type="button"
              onClick={() => marcarLida(item.id_notificacao)}
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-card hover:bg-muted px-2.5 py-1.5 text-xs font-medium text-foreground transition-all"
              title="Marcar como lida"
            >
              <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />
            </button>
          )}

          <button
            type="button"
            onClick={() => arquivar(item.id_notificacao)}
            className="inline-flex items-center gap-1 rounded-xl border border-border bg-card hover:bg-muted px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-all"
            title="Arquivar"
          >
            <EyeOff className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

