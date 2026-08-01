import { AlertCircle, Bell, BellRing, CheckCheck, ChevronRight, EyeOff, Sparkles } from 'lucide-react';
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

export default function CentralNotificacoes() {
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

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Central de notificações</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe alertas financeiros, lembretes de contas e pagamentos próximos.
          </p>
        </div>
        <button
          type="button"
          onClick={solicitarPermissaoPush}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
        >
          <BellRing className="h-4 w-4" />
          Ativar notificações do navegador
        </button>
      </div>

      {erro ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Não lidas</CardTitle>
          </CardHeader>
          <CardContent>
            {carregando ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{resumo.naoLidas}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Alertas críticos</CardTitle>
          </CardHeader>
          <CardContent>
            {carregando ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold text-red-600">{resumo.criticas}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total ativo</CardTitle>
          </CardHeader>
          <CardContent>
            {carregando ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{resumo.total}</div>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {[
            { key: 'notificacoes_conta', label: 'Contas', description: 'Alertas de contas e vencimentos' },
            { key: 'notificacoes_parcela', label: 'Parcelas', description: 'Lembretes de recebimentos' },
            { key: 'notificacoes_meta', label: 'Metas', description: 'Prazo de metas financeiras' },
            { key: 'notificacoes_sistema', label: 'Sistema', description: 'Mensagens e dicas do app' },
            { key: 'push_enabled', label: 'Push no navegador', description: 'Receber alertas via navegador' },
            { key: 'resumo_diario', label: 'Resumo diário', description: 'Resumo de rotina e próximos compromissos' },
          ].map((item) => {
            const value = preferencias[item.key as keyof typeof preferencias] as boolean;
            return (
              <label key={item.key} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-sm text-muted-foreground">{item.description}</div>
                </div>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => atualizarPreferencias({ [item.key]: !value })}
                  className="h-4 w-4 rounded border-border"
                />
              </label>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alertas recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {carregando ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : notificacoes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Nenhum alerta por enquanto. Tudo alinhado por aqui.
            </div>
          ) : (
            <div className="space-y-3">
              {notificacoes.map((item) => (
                <div key={item.id_notificacao} className={`rounded-xl border p-4 ${item.lida ? 'border-border bg-background' : 'border-primary/30 bg-primary/5'}`}>
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="flex gap-3">
                      <div className={`rounded-full p-2 ${item.prioridade === 'critica' ? 'bg-red-100 text-red-700' : item.prioridade === 'alta' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                        {item.prioridade === 'critica' ? <AlertCircle className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">{item.titulo}</span>
                          <Badge variant={item.prioridade === 'critica' ? 'destructive' : item.prioridade === 'alta' ? 'secondary' : 'default'}>{prioridadeLabel(item.prioridade)}</Badge>
                          <Badge variant="secondary">{tipoLabel(item.tipo)}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{item.mensagem}</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {item.data_criacao ? new Date(item.data_criacao).toLocaleString('pt-BR') : 'Agora'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {!item.lida ? (
                        <button type="button" onClick={() => marcarLida(item.id_notificacao)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm">
                          <CheckCheck className="h-3.5 w-3.5" /> Marcar lida
                        </button>
                      ) : null}
                      <button type="button" onClick={() => arquivar(item.id_notificacao)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm">
                        <EyeOff className="h-3.5 w-3.5" /> Arquivar
                      </button>
                      {item.link ? (
                        <button type="button" onClick={() => abrirDetalhe(item)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm">
                          <Sparkles className="h-3.5 w-3.5" /> Abrir
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
