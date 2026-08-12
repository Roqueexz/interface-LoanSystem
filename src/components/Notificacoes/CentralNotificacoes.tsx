import { useState, useMemo } from 'react';
import {
  Search,
  Mic,
  X,
  MessageSquare,
  MessageCircle,
  Phone,
  ShieldCheck,
  CreditCard,
  Send,
  Sparkles,
  Bell,
  BellRing,
  AlertCircle,
  CheckCheck,
  EyeOff,
  ChevronRight,
  Calendar,
  Filter,
  ExternalLink,
  Bot,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotificacoes } from '../../hooks/useNotificacoes';
import { useToast } from '../../hooks/useToast';
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
  const toast = useToast();
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

  // Estados locais
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroTipo>('TODAS');

  // Modais interativos
  const [modalChatAberto, setModalChatAberto] = useState(false);
  const [modalWhatsAppAberto, setModalWhatsAppAberto] = useState(false);
  const [modalTelefonesAberto, setModalTelefonesAberto] = useState(false);
  const [modalTokenAberto, setModalTokenAberto] = useState(false);

  // Notificações filtradas por Categoria e por Barra de Pesquisa
  const notificacoesFiltradas = useMemo(() => {
    return notificacoes.filter((n) => {
      // Filtro por Categoria
      let passaCategoria = true;
      if (filtroAtivo === 'VENCIMENTOS') {
        passaCategoria = n.tipo === 'conta' || n.tipo === 'parcela';
      } else if (filtroAtivo === 'ALERTAS') {
        passaCategoria = n.prioridade === 'critica' || n.prioridade === 'alta';
      } else if (filtroAtivo === 'SISTEMA') {
        passaCategoria = n.tipo === 'sistema' || n.tipo === 'meta';
      }

      // Filtro por Busca de Texto
      let passaBusca = true;
      if (termoBusca.trim() !== '') {
        const termo = termoBusca.toLowerCase().trim();
        const titulo = n.titulo?.toLowerCase() || '';
        const mensagem = n.mensagem?.toLowerCase() || '';
        const tipo = n.tipo?.toLowerCase() || '';
        const prioridade = n.prioridade?.toLowerCase() || '';

        passaBusca =
          titulo.includes(termo) ||
          mensagem.includes(termo) ||
          tipo.includes(termo) ||
          prioridade.includes(termo);
      }

      return passaCategoria && passaBusca;
    });
  }, [notificacoes, filtroAtivo, termoBusca]);

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

  // Ação ao clicar em Chat
  const handleAbrirChat = () => {
    toast.info('💬 Abrindo suporte via Chat LoanSystem...');
    setModalChatAberto(true);
  };

  // Ação ao clicar em WhatsApp
  const handleAbrirWhatsApp = () => {
    toast.success('📱 Redirecionando para o WhatsApp de Suporte...');
    setModalWhatsAppAberto(true);
  };

  // Ação ao clicar em Telefones
  const handleAbrirTelefones = () => {
    toast.info('📞 Abrindo canais de atendimento telefônico...');
    setModalTelefonesAberto(true);
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 pb-24">

      {/* BARRA DE PESQUISA SUPERIOR (Estilo App Bancário) */}
      <div className="relative flex items-center">
        <div className="absolute left-4 text-muted-foreground">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          placeholder="O que você procura em notificações?"
          className="w-full rounded-2xl border-2 border-border bg-card py-3.5 pl-12 pr-12 text-sm font-medium text-foreground placeholder:text-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {termoBusca ? (
          <button
            type="button"
            onClick={() => setTermoBusca('')}
            className="absolute right-4 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            title="Limpar busca"
          >
            <X size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => toast.info('🎤 Fale o termo de busca... (em desenvolvimento)')}
            className="absolute right-4 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            title="Pesquisa por voz"
          >
            <Mic size={18} />
          </button>
        )}
      </div>

      {/* SEÇÃO 1: MAIS RECURSOS / PRODUTOS */}
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-foreground tracking-tight px-1">
          Recursos Rápidos
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {/* Card Código iToken / Segurança */}
          <button
            type="button"
            onClick={() => {
              toast.success('🔒 Token de Segurança ativo!');
              setModalTokenAberto(true);
            }}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-4 text-left shadow-sm hover:border-primary/50 hover:shadow-md active:scale-95 transition-all h-36"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground leading-tight">Token de Segurança</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Sessão protegida 2FA</p>
            </div>
          </button>

          {/* Card Cartões & Contas */}
          <button
            type="button"
            onClick={() => navigate('/caixa')}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-4 text-left shadow-sm hover:border-primary/50 hover:shadow-md active:scale-95 transition-all h-36"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <CreditCard size={22} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground leading-tight">Caixa & Contas</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Gestão de faturas</p>
            </div>
          </button>

          {/* Card Cobrança Rápida */}
          <button
            type="button"
            onClick={() => setModalWhatsAppAberto(true)}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-4 text-left shadow-sm hover:border-primary/50 hover:shadow-md active:scale-95 transition-all h-36 col-span-2 sm:col-span-1"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
              <Send size={22} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground leading-tight">Régua de Cobrança</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Aviso via WhatsApp</p>
            </div>
          </button>
        </div>
      </div>

      {/* SEÇÃO 2: PRECISA DE AJUDA? (Cards estilo App Bancário) */}
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-foreground tracking-tight px-1">
          Precisa de ajuda?
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {/* Card Chat */}
          <button
            type="button"
            onClick={handleAbrirChat}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-4 text-left shadow-sm hover:border-blue-500/50 hover:shadow-md active:scale-95 transition-all h-32"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-foreground leading-tight">Chat</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">Suporte virtual</p>
            </div>
          </button>

          {/* Card WhatsApp */}
          <button
            type="button"
            onClick={handleAbrirWhatsApp}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-4 text-left shadow-sm hover:border-emerald-500/50 hover:shadow-md active:scale-95 transition-all h-32"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <MessageCircle size={20} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-foreground leading-tight">WhatsApp</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">Mensagem direta</p>
            </div>
          </button>

          {/* Card Telefones */}
          <button
            type="button"
            onClick={handleAbrirTelefones}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-4 text-left shadow-sm hover:border-indigo-500/50 hover:shadow-md active:scale-95 transition-all h-32"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <Phone size={20} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-foreground leading-tight">Telefones</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">SAC & Central</p>
            </div>
          </button>
        </div>
      </div>

      {/* SEÇÃO 3: CENTRAL DE NOTIFICAÇÕES */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles size={14} />
              <span>Central de Alertas</span>
            </div>
            <h2 className="text-xl font-extrabold text-foreground">Notificações</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {termoBusca
                ? `Exibindo ${notificacoesFiltradas.length} resultado(s) para "${termoBusca}"`
                : 'Lembretes de parcelas, faturas e alertas financeiros.'}
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
              <p className="text-xs text-muted-foreground mt-1">
                {termoBusca
                  ? `Nenhum resultado corresponde à busca "${termoBusca}".`
                  : 'Tudo em ordem e alinhado na sua gestão financeira!'}
              </p>
              {termoBusca && (
                <button
                  type="button"
                  onClick={() => setTermoBusca('')}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted transition-all"
                >
                  Limpar filtro de busca
                </button>
              )}
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

      {/* MODAL 1: CHAT DE SUPORTE */}
      {modalChatAberto && (
        <ModalChatSuporte onClose={() => setModalChatAberto(false)} />
      )}

      {/* MODAL 2: WHATSAPP / RÉGUA DE COBRANÇA */}
      {modalWhatsAppAberto && (
        <ModalWhatsAppCobranca onClose={() => setModalWhatsAppAberto(false)} />
      )}

      {/* MODAL 3: TELEFONES & ATENDIMENTO */}
      {modalTelefonesAberto && (
        <ModalTelefonesSuporte onClose={() => setModalTelefonesAberto(false)} />
      )}

      {/* MODAL 4: TOKEN DE SEGURANÇA */}
      {modalTokenAberto && (
        <ModalTokenSeguranca onClose={() => setModalTokenAberto(false)} />
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Componente Interno: Item de Notificação
// ----------------------------------------------------------------------
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
    <div
      className={`rounded-2xl border p-4 transition-all shadow-sm ${
        item.lida
          ? 'border-border bg-card opacity-85'
          : isCritica
          ? 'border-rose-500/40 bg-rose-500/5 dark:bg-rose-950/20 ring-1 ring-rose-500/20'
          : isAlta
          ? 'border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/20'
          : 'border-primary/30 bg-primary/5'
      }`}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              isCritica
                ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                : isAlta
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                : 'bg-primary/20 text-primary'
            }`}
          >
            {isCritica ? <AlertCircle className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-extrabold text-foreground">{item.titulo}</span>
              <Badge
                variant={isCritica ? 'destructive' : isAlta ? 'secondary' : 'default'}
                className="text-[10px] py-0 px-2"
              >
                {prioridadeLabel(item.prioridade)}
              </Badge>
              <Badge variant="secondary" className="text-[10px] py-0 px-2">
                {tipoLabel(item.tipo)}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.mensagem}</p>
            <p className="mt-1.5 text-[10px] font-medium text-muted-foreground/70">
              {item.data_criacao
                ? new Date(item.data_criacao).toLocaleString('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })
                : 'Agora'}
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

// ----------------------------------------------------------------------
// MODAL DE CHAT INTERATIVO
// ----------------------------------------------------------------------
function ModalChatSuporte({ onClose }: { onClose: () => void }) {
  const [mensagens, setMensagens] = useState([
    { id: 1, autor: 'bot', texto: 'Olá! Sou o assistente virtual do LoanSystem. Como posso ajudar você hoje?' },
  ]);
  const [inputTexto, setInputTexto] = useState('');

  const enviarMensagem = () => {
    if (!inputTexto.trim()) return;
    const userMsg = inputTexto;
    setMensagens((prev) => [...prev, { id: Date.now(), autor: 'user', texto: userMsg }]);
    setInputTexto('');

    setTimeout(() => {
      setMensagens((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          autor: 'bot',
          texto: `Recebido! Em breve nossa equipe de atendimento entrará em contato. Para urgências, acione o canal do WhatsApp.`,
        },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-[500px] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-sm">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-foreground">Suporte Inteligente</h3>
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Online agora
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corpo do Chat */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10">
          {mensagens.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.autor === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs font-medium ${
                  msg.autor === 'user'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-card border border-border text-foreground shadow-sm'
                }`}
              >
                {msg.texto}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Suggestions */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-t border-border bg-card p-2 scrollbar-none">
          {['Dúvida sobre parcelas', 'Como cobrar Pix?', 'Falar com atendente'].map((sugestao) => (
            <button
              key={sugestao}
              type="button"
              onClick={() => {
                setInputTexto(sugestao);
              }}
              className="rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all whitespace-nowrap"
            >
              {sugestao}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 border-t border-border bg-card p-3">
          <input
            type="text"
            value={inputTexto}
            onChange={(e) => setInputTexto(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
            placeholder="Escreva sua mensagem..."
            className="flex-1 rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="button"
            onClick={enviarMensagem}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// MODAL DE WHATSAPP / RÉGUA DE COBRANÇA
// ----------------------------------------------------------------------
function ModalWhatsAppCobranca({ onClose }: { onClose: () => void }) {
  const toast = useToast();
  const [copiado, setCopiado] = useState(false);
  const [mensagemTemp, setMensagemTemp] = useState(
    'Olá! Passando para lembrar que sua parcela do empréstimo está com vencimento próximo. Dúvidas ou comprovante, responda essa mensagem!'
  );

  const handleCopiar = () => {
    navigator.clipboard.writeText(mensagemTemp);
    setCopiado(true);
    toast.success('Mensagem copiada para a área de transferência!');
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleAbrirWhatsAppWeb = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(mensagemTemp)}`;
    window.open(url, '_blank');
    toast.success('Redirecionando para o WhatsApp...');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
              <MessageCircle size={22} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-foreground">Suporte WhatsApp</h3>
              <p className="text-xs text-muted-foreground">Envio rápido de lembretes e suporte</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-foreground block">
            Modelo de mensagem de cobrança / aviso:
          </label>
          <textarea
            rows={4}
            value={mensagemTemp}
            onChange={(e) => setMensagemTemp(e.target.value)}
            className="w-full rounded-2xl border border-border bg-muted/30 p-3 text-xs text-foreground focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopiar}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-border bg-muted/40 py-2.5 text-xs font-bold text-foreground hover:bg-muted active:scale-95 transition-all"
          >
            {copiado ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            {copiado ? 'Copiado!' : 'Copiar Texto'}
          </button>
          <button
            type="button"
            onClick={handleAbrirWhatsAppWeb}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 active:scale-95 transition-all shadow-sm"
          >
            <ExternalLink size={16} />
            Abrir WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// MODAL DE TELEFONES E SAC
// ----------------------------------------------------------------------
function ModalTelefonesSuporte({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-sm">
              <Phone size={22} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-foreground">Telefones & Atendimento</h3>
              <p className="text-xs text-muted-foreground">Canais diretos LoanSystem</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {[
            { titulo: 'Central de Atendimento', fone: '0800 777 9900', desc: 'Segunda a Sexta, das 08h às 18h' },
            { titulo: 'Suporte Técnico App', fone: '(11) 98888-7777', desc: 'Atendimento via ligação ou WhatsApp' },
            { titulo: 'Ouvidoria LoanSystem', fone: '0800 111 2233', desc: 'Disponível em dias úteis das 09h às 17h' },
          ].map((item) => (
            <div
              key={item.titulo}
              className="flex items-center justify-between rounded-2xl border border-border bg-muted/20 p-3.5"
            >
              <div>
                <h4 className="text-xs font-bold text-foreground">{item.titulo}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                <span className="text-xs font-extrabold text-primary block mt-1">{item.fone}</span>
              </div>
              <a
                href={`tel:${item.fone.replace(/\D/g, '')}`}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                title="Ligar"
              >
                <Phone size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// MODAL TOKEN DE SEGURANÇA (iToken)
// ----------------------------------------------------------------------
function ModalTokenSeguranca({ onClose }: { onClose: () => void }) {
  const [tokenCodigo] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-6 text-center shadow-2xl space-y-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck size={36} />
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-foreground">iToken LoanSystem</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Seu código de validação temporário de 2 fatores para operações sensíveis:
          </p>
        </div>

        <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 py-4 font-mono text-3xl font-black tracking-widest text-emerald-600 dark:text-emerald-400">
          {tokenCodigo}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
          <Zap size={14} className="text-amber-500" /> Válido por 30 segundos
        </div>
      </div>
    </div>
  );
}
