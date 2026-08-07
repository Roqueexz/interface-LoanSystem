import { useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, Check } from 'lucide-react';
import { useNotificacoes } from '../../hooks/useNotificacoes';

export function NotificacoesResumoCard() {
  const navigate = useNavigate();
  const { notificacoes, naoLidas, marcarComoLida } = useNotificacoes();

  const recentes = notificacoes.slice(0, 2);

  if (notificacoes.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold tracking-wide text-foreground">Notificações Recentes</h3>
          {naoLidas > 0 && (
            <span className="flex h-5 items-center justify-center rounded-full bg-primary px-2 text-[10px] font-bold text-white">
              {naoLidas} novas
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => navigate('/notificacoes')}
          className="text-xs font-semibold text-primary flex items-center hover:underline"
        >
          Ver todas <ChevronRight size={14} />
        </button>
      </div>

      <div className="rounded-3xl border border-border bg-card p-3 shadow-sm space-y-2">
        {recentes.map((notif) => (
          <div
            key={notif.id}
            className={`flex items-start justify-between gap-3 p-3 rounded-2xl transition-colors ${
              notif.lida ? 'bg-muted/30' : 'bg-primary/5 border border-primary/10'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className={`p-2 rounded-xl mt-0.5 ${notif.lida ? 'bg-muted text-muted-foreground' : 'bg-primary text-white'}`}>
                <Bell size={14} />
              </span>
              <div>
                <h4 className="text-xs font-bold text-foreground">{notif.titulo}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{notif.mensagem}</p>
                <span className="text-[10px] text-muted-foreground/80 block mt-1">{notif.dataCriacao}</span>
              </div>
            </div>

            {!notif.lida && (
              <button
                type="button"
                onClick={async (e) => {
                  e.stopPropagation();
                  await marcarComoLida(notif.id);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                title="Marcar como lida"
              >
                <Check size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificacoesResumoCard;
