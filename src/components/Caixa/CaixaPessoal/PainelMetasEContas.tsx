import { useState } from 'react';
import { Target, Receipt, CheckCircle, Plus, ShieldAlert } from 'lucide-react';
import { useContas } from '../../../hooks/useContas';
import { useMetas } from '../../../hooks/useMetas';
import { formatarMoeda } from '../../../services/Utilitario';
import type { ContaCaixaPessoalDTO } from '../../../interface/CaixaPessoalDTO';
import NovaContaModal from './NovaContaModal';
import NovaMetaModal from './NovaMetaModal';

interface PainelMetasEContasProps {
  saldoDisponivel: number;
}

export function PainelMetasEContas({ saldoDisponivel }: PainelMetasEContasProps) {
  const { contas, pagarConta } = useContas();
  const { criarMeta, atualizarMeta } = useMetas();

  const [modalContaAberto, setModalContaAberto] = useState(false);
  const [modalMetaAberto, setModalMetaAberto] = useState(false);
  const [alertaContaId, setAlertaContaId] = useState<string | null>(null);

  // Filtra contas do tipo 'pagar' que não foram pagas ainda
  const contasPendentes = contas.filter((c) => c.tipo === 'pagar' && !c.pago);

  const handleTentarPagar = async (conta: ContaCaixaPessoalDTO) => {
    // Validação de Saldo Insuficiente no Caixa Pessoal
    if (saldoDisponivel < conta.valor) {
      setAlertaContaId(conta.id);
      setTimeout(() => setAlertaContaId(null), 4000);
      return;
    }

    await pagarConta(conta.id);
  };

  return (
    <div className="space-y-6">
      {/* Header do Painel Dedicado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h3 className="text-base font-extrabold text-foreground">Painel de Contas & Metas Pessoais</h3>
          <p className="text-xs text-muted-foreground">Faturas recorrentes (luz, internet, escola) e metas financeiras</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setModalContaAberto(true)}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
          >
            <Plus size={14} /> Nova Conta
          </button>
          <button
            type="button"
            onClick={() => setModalMetaAberto(true)}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted active:scale-95 transition-all"
          >
            <Target size={14} className="text-emerald-500" /> Nova Meta
          </button>
        </div>
      </div>

      {/* Seção 1: Faturas & Contas a Pagar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Receipt size={14} className="text-indigo-500" /> Próximas Faturas & Contas ({contasPendentes.length})
          </h4>
          <span className="text-xs font-semibold text-muted-foreground">
            Saldo Disponível: <strong className="text-foreground">{formatarMoeda(saldoDisponivel)}</strong>
          </span>
        </div>

        {contasPendentes.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-6 text-center bg-card">
            <CheckCircle size={28} className="text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-foreground">Nenhuma conta pendente por aqui!</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Todas as suas faturas estão em dia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {contasPendentes.map((conta) => {
              const temSaldoInsuficiente = saldoDisponivel < conta.valor;
              const emAlerta = alertaContaId === conta.id;

              return (
                <div
                  key={conta.id}
                  className={`rounded-3xl border p-4 transition-all bg-card shadow-sm ${
                    emAlerta
                      ? 'border-rose-500/80 ring-2 ring-rose-500/20 bg-rose-500/5'
                      : temSaldoInsuficiente
                      ? 'border-amber-500/40'
                      : 'border-border hover:border-indigo-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-foreground block">{conta.descricao}</span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5 capitalize">
                        Categoria: {conta.categoria || 'Geral'} • Vencimento: {conta.vencimento ? new Date(conta.vencimento).toLocaleDateString('pt-BR') : 'Sem data'}
                      </span>
                    </div>

                    <span className="text-sm font-extrabold text-foreground block">
                      {formatarMoeda(conta.valor)}
                    </span>
                  </div>

                  {/* Alerta Visual de Saldo Insuficiente */}
                  {emAlerta && (
                    <div className="mt-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 p-2.5 text-[11px] font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5 animate-bounce">
                      <ShieldAlert size={15} />
                      <span>Saldo insuficiente no Caixa Pessoal para pagar esta conta!</span>
                    </div>
                  )}

                  {/* Botão de Quitar / Baixar */}
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      Status: <strong className="text-amber-500">Pendente</strong>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleTentarPagar(conta)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                        temSaldoInsuficiente
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      <CheckCircle size={14} /> Pagar Fatura
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modais */}
      {modalContaAberto && (
        <NovaContaModal
          isOpen={modalContaAberto}
          onClose={() => setModalContaAberto(false)}
        />
      )}

      {modalMetaAberto && (
        <NovaMetaModal
          isOpen={modalMetaAberto}
          onClose={() => setModalMetaAberto(false)}
          onSave={async (metaPayload, id) => {
            if (id) {
              await atualizarMeta(id, metaPayload);
            } else {
              await criarMeta(metaPayload);
            }
            setModalMetaAberto(false);
          }}
        />
      )}
    </div>
  );
}

export default PainelMetasEContas;

