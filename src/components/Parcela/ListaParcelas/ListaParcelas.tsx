import { useEffect, useState } from "react";
import { CheckCircle2, Clock, AlertTriangle, RotateCcw, Check } from "lucide-react";
import ParcelaRequests from "../../../fetch/ParcelaRequests";
import type ParcelaDTO from "../../../interface/ParcelaDTO";
import { useToast } from "../../../hooks/useToast";
import ModalConfirmacao from "../../../ui/Modal/ModalConfirmacao";

interface Props {
  id_emprestimo: number;
  onAtualizar?: () => void;
}

function ListaParcelas({ id_emprestimo, onAtualizar }: Props) {
  const toast = useToast();
  const [parcelas, setParcelas] = useState<ParcelaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [parcelaAction, setParcelaAction] = useState<{ id: number; action: "pagar" | "desfazer" } | null>(null);
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);

  async function carregarParcelas() {
    setLoading(true);
    setErro("");

    try {
      const lista = await ParcelaRequests.listarPorEmprestimo(id_emprestimo);
      if (lista) {
        setParcelas(lista);
      } else {
        setParcelas([]);
      }
    } catch (err) {
      console.error(err);
      setErro("Erro ao carregar parcelas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id_emprestimo) {
      carregarParcelas();
    }
  }, [id_emprestimo]);

  function handlePagar(id_parcela: number) {
    setParcelaAction({ id: id_parcela, action: "pagar" });
    setModalConfirmOpen(true);
  }

  function handleDesfazer(id_parcela: number) {
    setParcelaAction({ id: id_parcela, action: "desfazer" });
    setModalConfirmOpen(true);
  }

  async function confirmarAcao() {
    if (!parcelaAction) return;

    const { id, action } = parcelaAction;

    if (action === "pagar") {
      const sucesso = await toast.promise(ParcelaRequests.pagar(id), {
        loading: "Processando pagamento...",
        success: "✅ Parcela paga com sucesso!",
        error: "❌ Erro ao pagar parcela.",
      });

      if (sucesso) {
        await carregarParcelas();
        onAtualizar?.();
      }
    } else {
      const sucesso = await toast.promise(ParcelaRequests.desfazerPagamento(id), {
        loading: "Desfazendo pagamento...",
        success: "✅ Pagamento desfeito com sucesso!",
        error: "❌ Erro ao desfazer pagamento.",
      });

      if (sucesso) {
        await carregarParcelas();
        onAtualizar?.();
      }
    }

    setParcelaAction(null);
    setModalConfirmOpen(false);
  }

  const calcularDiasAtraso = (vencimentoStr: string) => {
    try {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const venc = new Date(vencimentoStr);
      venc.setHours(0, 0, 0, 0);

      const diffTime = hoje.getTime() - venc.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      return 0;
    }
  };

  const formatarMoeda = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatarData = (dt?: string | null) => {
    if (!dt) return "";
    try {
      return new Date(dt).toLocaleDateString("pt-BR");
    } catch {
      return String(dt);
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-3">
        <p className="text-sm font-semibold text-muted-foreground animate-pulse">Carregando parcelas...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-4 text-red-600 dark:text-red-400 text-sm">
        {erro}
      </div>
    );
  }

  if (parcelas.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 text-center text-muted-foreground text-sm">
        Nenhuma parcela encontrada para este empréstimo.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-foreground">Plano de Parcelas</h2>
        <span className="text-xs font-semibold text-muted-foreground">
          {parcelas.filter((p) => p.status_parcela === "PAGA").length} de {parcelas.length} quitadas
        </span>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-sm">
        {parcelas.map((p) => {
          const isPaga = p.status_parcela === "PAGA";
          const isAtrasada = p.status_parcela === "ATRASADA";
          const diasAtraso = isAtrasada ? calcularDiasAtraso(p.data_vencimento) : 0;

          return (
            <div
              key={p.id_parcela}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all ${
                isPaga
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : isAtrasada
                  ? "bg-red-500/5 border-red-500/30"
                  : "bg-muted/30 border-border hover:bg-muted/50"
              }`}
            >
              {/* Info Parcela */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isPaga
                      ? "bg-emerald-500 text-white"
                      : isAtrasada
                      ? "bg-red-500 text-white"
                      : "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                  }`}
                >
                  #{p.numero_parcela}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-extrabold text-foreground text-base">
                      {formatarMoeda(p.valor_parcela)}
                    </p>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isPaga
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : isAtrasada
                          ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {p.status_parcela}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                    <Clock size={13} /> Vencimento: <span className="font-semibold">{formatarData(p.data_vencimento)}</span>
                  </p>

                  {isPaga && p.data_pagamento && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Pago em: {formatarData(p.data_pagamento)}
                    </p>
                  )}

                  {isAtrasada && diasAtraso > 0 && (
                    <p className="text-xs text-red-600 dark:text-red-400 font-bold mt-0.5 flex items-center gap-1">
                      <AlertTriangle size={13} /> Atrasado há {diasAtraso} {diasAtraso === 1 ? "dia" : "dias"}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                {!isPaga ? (
                  <button
                    onClick={() => handlePagar(p.id_parcela)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Check size={14} /> Dar baixa
                  </button>
                ) : (
                  <button
                    onClick={() => handleDesfazer(p.id_parcela)}
                    className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-muted border border-border hover:bg-red-500/10 hover:text-red-500 text-muted-foreground text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <RotateCcw size={13} /> Desfazer
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Confirmacao */}
      <ModalConfirmacao
        isOpen={modalConfirmOpen}
        onClose={() => {
          setModalConfirmOpen(false);
          setParcelaAction(null);
        }}
        onConfirm={confirmarAcao}
        title={parcelaAction?.action === "pagar" ? "Confirmar Pagamento" : "Desfazer Pagamento"}
        message={
          parcelaAction?.action === "pagar"
            ? "Tem certeza que deseja marcar esta parcela como paga?"
            : "Tem certeza que deseja desfazer o pagamento desta parcela?"
        }
        confirmText={parcelaAction?.action === "pagar" ? "Confirmar Baixa" : "Desfazer"}
        cancelText="Cancelar"
        variant={parcelaAction?.action === "pagar" ? "info" : "danger"}
      />
    </div>
  );
}

export default ListaParcelas;