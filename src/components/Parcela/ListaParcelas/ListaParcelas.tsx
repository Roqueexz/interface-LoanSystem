import { useEffect, useState } from "react";
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
  const [parcelaAction, setParcelaAction] = useState<{ id: number; action: 'pagar' | 'desfazer' } | null>(null);
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
    }

    setLoading(false);
  }

  useEffect(() => {
    if (id_emprestimo) {
      carregarParcelas();
    }
  }, [id_emprestimo]);

  function handlePagar(id_parcela: number) {
    setParcelaAction({ id: id_parcela, action: 'pagar' });
    setModalConfirmOpen(true);
  }

  function handleDesfazer(id_parcela: number) {
    setParcelaAction({ id: id_parcela, action: 'desfazer' });
    setModalConfirmOpen(true);
  }

  async function confirmarAcao() {
    if (!parcelaAction) return;

    const { id, action } = parcelaAction;

    if (action === 'pagar') {
      const sucesso = await toast.promise(
        ParcelaRequests.pagar(id),
        {
          loading: 'Processando pagamento...',
          success: '✅ Parcela paga com sucesso!',
          error: '❌ Erro ao pagar parcela.',
        }
      );

      if (sucesso) {
        await carregarParcelas();
        onAtualizar?.();
      }
    } else {
      const sucesso = await toast.promise(
        ParcelaRequests.desfazerPagamento(id),
        {
          loading: 'Desfazendo pagamento...',
          success: '✅ Pagamento desfeito com sucesso!',
          error: '❌ Erro ao desfazer pagamento.',
        }
      );

      if (sucesso) {
        await carregarParcelas();
        onAtualizar?.();
      }
    }

    setParcelaAction(null);
    setModalConfirmOpen(false);
  }

  function getBadge(status: ParcelaDTO["status_parcela"]) {
    switch (status) {
      case "PAGA":
        return "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20";
      case "ATRASADA":
        return "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20";
      default:
        return "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20";
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Carregando parcelas...</p>;
  }

  if (erro) {
    return <p className="text-red-500 dark:text-red-400">{erro}</p>;
  }

  if (parcelas.length === 0) {
    return <p className="text-muted-foreground">Nenhuma parcela encontrada para este empréstimo.</p>;
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
      {parcelas.map((p) => (
        <div
          key={p.id_parcela}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/30 p-3 rounded-lg hover:bg-muted/50 transition-all"
        >
          <div>
            <p className="text-sm font-medium text-foreground">
              Parcela {p.numero_parcela} - R$ {p.valor_parcela.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              Venc: {new Date(p.data_vencimento).toLocaleDateString("pt-BR")}
            </p>
            {p.data_pagamento && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                Pago em: {new Date(p.data_pagamento).toLocaleDateString("pt-BR")}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getBadge(p.status_parcela)}`}>
              {p.status_parcela}
            </span>

            {p.status_parcela !== "PAGA" ? (
              <button
                onClick={() => handlePagar(p.id_parcela)}
                className="text-xs bg-primary text-primary-foreground hover:opacity-90 px-3 py-1 rounded-lg font-medium transition-all"
              >
                Dar baixa
              </button>
            ) : (
              <button
                onClick={() => handleDesfazer(p.id_parcela)}
                className="text-xs bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 px-3 py-1 rounded-lg font-medium transition-all"
              >
                Desfazer
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Modal de Confirmacao */}
      <ModalConfirmacao
        isOpen={modalConfirmOpen}
        onClose={() => {
          setModalConfirmOpen(false);
          setParcelaAction(null);
        }}
        onConfirm={confirmarAcao}
        title={parcelaAction?.action === 'pagar' ? "Confirmar Pagamento" : "Desfazer Pagamento"}
        message={parcelaAction?.action === 'pagar' 
          ? "Tem certeza que deseja marcar esta parcela como paga?" 
          : "Tem certeza que deseja desfazer o pagamento desta parcela?"}
        confirmText={parcelaAction?.action === 'pagar' ? "Pagar" : "Desfazer"}
        cancelText="Cancelar"
        variant={parcelaAction?.action === 'pagar' ? "info" : "danger"}
      />
    </div>
  );
}

export default ListaParcelas;