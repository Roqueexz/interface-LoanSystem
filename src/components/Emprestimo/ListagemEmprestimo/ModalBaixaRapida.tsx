import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Calendar, Loader2, DollarSign, X } from "lucide-react";
import ParcelaRequests from "../../../fetch/ParcelaRequests";
import type ParcelaDTO from "../../../interface/ParcelaDTO";
import { useToast } from "../../../hooks/useToast";

interface ModalBaixaRapidaProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  idEmprestimo: number;
  nomeCliente: string;
  numParcelasContrato?: number;
}

export default function ModalBaixaRapida({
  isOpen,
  onClose,
  onSuccess,
  idEmprestimo,
  nomeCliente,
  numParcelasContrato,
}: ModalBaixaRapidaProps) {
  const toast = useToast();
  const [parcelas, setParcelas] = useState<ParcelaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [dataPagamento, setDataPagamento] = useState(() => {
    const hoje = new Date();
    return hoje.toISOString().split("T")[0];
  });

  useEffect(() => {
    if (isOpen && idEmprestimo) {
      carregarParcelas();
    }
  }, [isOpen, idEmprestimo]);

  async function carregarParcelas() {
    setLoading(true);
    try {
      const lista = await ParcelaRequests.listarPorEmprestimo(idEmprestimo);
      setParcelas(lista || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  // Encontra a primeira parcela pendente ou atrasada (ordem crescente de número)
  const proximaParcela = parcelas.find((p) => p.status_parcela !== "PAGA");
  const parcelasPagasCount = parcelas.filter((p) => p.status_parcela === "PAGA").length;
  const totalParcelas = numParcelasContrato || parcelas.length || 1;
  const pctProgresso = Math.min(Math.round((parcelasPagasCount / totalParcelas) * 100), 100);

  async function handleConfirmarPagamento() {
    if (!proximaParcela) return;

    setProcessando(true);
    const dataObj = dataPagamento ? new Date(dataPagamento) : undefined;

    const sucesso = await toast.promise(
      ParcelaRequests.pagar(proximaParcela.id_parcela, dataObj),
      {
        loading: `Baixando parcela ${proximaParcela.numero_parcela}...`,
        success: `✅ Parcela ${proximaParcela.numero_parcela} marcada como paga!`,
        error: "❌ Erro ao registrar pagamento da parcela.",
      }
    );

    setProcessando(false);

    if (sucesso) {
      onSuccess();
      onClose();
    }
  }

  const formatarMoeda = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatarData = (dt: string) => {
    try {
      return new Date(dt).toLocaleDateString("pt-BR");
    } catch {
      return dt;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <DollarSign size={20} />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base leading-tight">Baixa Rápida</h3>
              <p className="text-xs text-muted-foreground">{nomeCliente}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="animate-spin text-primary" size={28} />
              <p className="text-sm">Buscando próxima parcela...</p>
            </div>
          ) : !proximaParcela ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="font-bold text-foreground text-lg">Empréstimo Quitado!</h4>
              <p className="text-sm text-muted-foreground">
                Todas as {totalParcelas} parcelas deste empréstimo já foram devidamente pagas.
              </p>
            </div>
          ) : (
            <>
              {/* Highlight Card */}
              <div
                className={`p-4 rounded-xl border ${
                  proximaParcela.status_parcela === "ATRASADA"
                    ? "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400"
                    : "bg-primary/5 border-primary/20 text-foreground"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-card border border-border text-foreground">
                    Parcela {proximaParcela.numero_parcela} de {totalParcelas}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      proximaParcela.status_parcela === "ATRASADA"
                        ? "bg-red-500 text-white"
                        : "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {proximaParcela.status_parcela}
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-xs text-muted-foreground block mb-0.5">Valor a ser baixado</span>
                  <p className="text-3xl font-extrabold text-foreground">
                    {formatarMoeda(proximaParcela.valor_parcela)}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar size={14} /> Vencimento:
                  </span>
                  <span className="font-bold text-foreground">
                    {formatarData(proximaParcela.data_vencimento)}
                  </span>
                </div>
              </div>

              {proximaParcela.status_parcela === "ATRASADA" && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <p>Esta parcela está atrasada. O registro de baixa atualizará o saldo e movimentações do caixa pessoal em tempo real.</p>
                </div>
              )}

              {/* Data Pagamento Selection */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Data do Pagamento
                </label>
                <input
                  type="date"
                  value={dataPagamento}
                  onChange={(e) => setDataPagamento(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-input-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>

              {/* Resumo Quitação */}
              <div className="bg-muted/40 p-3 rounded-xl flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progresso do Empréstimo:</span>
                <span className="font-bold text-foreground">
                  {parcelasPagasCount} de {totalParcelas} pagas ({pctProgresso}%)
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/20 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={processando}
            className="flex-1 py-2.5 px-4 text-xs font-bold rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-all"
          >
            Cancelar
          </button>
          {proximaParcela && (
            <button
              type="button"
              onClick={handleConfirmarPagamento}
              disabled={processando}
              className="flex-1 py-2.5 px-4 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processando ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Processando...
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} /> Confirmar Baixa
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
