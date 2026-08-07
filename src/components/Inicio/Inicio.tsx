import { useState } from 'react';
import { useCofre } from '../../hooks/useCofre';
import { useContas } from '../../hooks/useContas';
import useMovimentacoes from '../../hooks/useMovimentacoes';
import CardSaldoMobile from './CardSaldoMobile';
import AtalhosRapidos from './AtalhosRapidos';
import ContasHojeCard from './ContasHojeCard';
import UltimasMovimentacoesCard from './UltimasMovimentacoesCard';
import NotificacoesResumoCard from './NotificacoesResumoCard';
import { Bell, Menu, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotificacoes } from '../../hooks/useNotificacoes';
import MenuDrawer from '../Navegacao/MenuDrawer';

// ============================================================
// Sprint 11 — Nova Home (Dashboard Mobile Premium)
// Inspirações: Nubank, Inter, Mercado Pago, PicPay, C6
// Prioridades:
//   - Pouco texto, mais cartões visuais
//   - Saldo principal com botão de ocultar (olho)
//   - Navegação confortável utilizando apenas uma mão
//   - Atalhos rápidos para Cliente, Empréstimo, Caixa, Calendário
//   - Visão em 5 segundos da saúde financeira
// ============================================================

export function Inicio() {
  const navigate = useNavigate();
  const cofre = useCofre();
  const { contas, contasAtrasadas, vencendoHoje } = useContas();
  const { movimentacoes, entradas, saidas } = useMovimentacoes();
  const { resumo } = useNotificacoes();
  const naoLidas = resumo?.naoLidas ?? 0;

  // Estado para o Menu Drawer Lateral Mobile
  const [drawerAberto, setDrawerAberto] = useState(false);

  // Estado para visibilidade dos valores monetários (persiste no localStorage)
  const [visivel, setVisivel] = useState(() => {
    const salvo = localStorage.getItem('ls_visibilidade_saldo');
    return salvo !== null ? JSON.parse(salvo) : true;
  });

  const toggleVisibilidade = () => {
    setVisivel((prev: boolean) => {
      const novo = !prev;
      localStorage.setItem('ls_visibilidade_saldo', JSON.stringify(novo));
      return novo;
    });
  };

  // Cálculo de dinheiro reservado (contas não pagas do tipo 'pagar')
  const reservado = contas
    .filter((c) => c.tipo === 'pagar' && !c.pago && c.status !== 'cancelada')
    .reduce((acc, c) => acc + Number(c.valor || 0), 0);

  // Saldo principal = Cofre + Entradas - Saídas
  const saldoAtual = cofre.total + entradas - saidas;

  // Disponível = SaldoAtual - Reservado
  const disponivel = saldoAtual - reservado;

  // Total de próximos recebimentos de contas do tipo 'receber' ou parcelas a receber
  const proximosRecebimentos = contas
    .filter((c) => c.tipo === 'receber' && !c.pago && c.status !== 'cancelada')
    .reduce((acc, c) => acc + Number(c.valor || 0), 0);

  // Saudação por horário do dia
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-20">
      
      {/* Top Header Mobile com Menu Hambúrguer e Notificações */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawerAberto(true)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card hover:bg-muted active:scale-95 transition-all text-foreground shadow-sm"
            title="Abrir Menu Drawer"
            aria-label="Abrir Menu Drawer"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white font-extrabold shadow-sm">
              <Sparkles size={16} />
            </div>
            <div>
              <span className="text-[11px] font-medium text-muted-foreground block">{saudacao} 👋</span>
              <h1 className="text-sm font-extrabold tracking-tight text-foreground">LoanSystem</h1>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/notificacoes')}
          className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card hover:bg-muted active:scale-95 transition-all text-foreground"
          title="Notificações"
          aria-label="Notificações"
        >
          <Bell size={18} />
          {naoLidas > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-background animate-pulse">
              {naoLidas}
            </span>
          )}
        </button>
      </div>

      {/* Card Principal de Saldo (Mobile Premium com Olho Toggle) */}
      <CardSaldoMobile
        saldo={saldoAtual}
        reservado={reservado}
        disponivel={disponivel}
        entradasMes={entradas}
        saidasMes={saidas}
        visivel={visivel}
        onToggleVisibilidade={toggleVisibilidade}
      />

      {/* Carrossel de Atalhos Rápidos (Mobile First - 1 mão) */}
      <AtalhosRapidos />

      {/* Atenção para Hoje (Contas vencendo hoje & Atrasadas & Recebimentos) */}
      <ContasHojeCard
        vencendoHoje={vencendoHoje}
        atrasadas={contasAtrasadas}
        proximosRecebimentos={proximosRecebimentos}
        visivel={visivel}
      />

      {/* Notificações Recentes */}
      <NotificacoesResumoCard />

      {/* Feed de Últimas Movimentações */}
      <UltimasMovimentacoesCard movimentacoes={movimentacoes} visivel={visivel} />

      {/* Menu Drawer Lateral Mobile */}
      <MenuDrawer
        isOpen={drawerAberto}
        onClose={() => setDrawerAberto(false)}
        naoLidas={naoLidas}
      />

    </div>
  );
}

export default Inicio;
