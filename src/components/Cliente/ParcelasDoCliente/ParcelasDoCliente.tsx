import { useEffect, useState } from "react";
import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import ParcelaRequests from "../../../fetch/ParcelaRequests";
import type ParcelaDTO from "../../../interface/ParcelaDTO";
import { useToast } from "../../../hooks/useToast";

interface EmprestimoComParcelas {
  id_emprestimo: number;
  valor_emprestimo: number;
  parcelas: ParcelaDTO[];
}

interface Props {
  id_cliente: number;
  onRefresh: () => void;
}

function ParcelasDoCliente({ id_cliente, onRefresh }: Props) {
  const toast = useToast();
  const [emprestimos, setEmprestimos] = useState<EmprestimoComParcelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarDados() {
    setLoading(true);
    setErro("");

    try {
      const lista = await EmprestimoRequests.obterListaDeEmprestimos();

      if (!lista) {
        setErro("Erro ao carregar emprestimos.");
        setLoading(false);
        return;
      }

      const filtrados = lista.filter(
        (emp: any) => emp.id_cliente === id_cliente
      );

      const emprestimosComParcelas: EmprestimoComParcelas[] = [];

      for (const emp of filtrados) {
        const parcelas = await ParcelaRequests.listarPorEmprestimo(emp.id_emprestimo!);
        emprestimosComParcelas.push({
          id_emprestimo: emp.id_emprestimo!,
          valor_emprestimo: emp.valor_emprestimo,
          parcelas: parcelas || [],
        });
      }

      setEmprestimos(emprestimosComParcelas);
    } catch (err) {
      console.error(err);
      setErro("Erro inesperado ao carregar parcelas.");
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarDados();
  }, [id_cliente]);

  async function marcarComoPaga(id_parcela: number) {
    const sucesso = await toast.promise(
      ParcelaRequests.pagar(id_parcela),
      {
        loading: 'Processando pagamento...',
        success: '✅ Parcela paga com sucesso!',
        error: (err) => {
          if (err?.message) {
            return `❌ ${err.message}`;
          }
          return '❌ Erro ao pagar parcela. Tente novamente.';
        },
      }
    );

    if (sucesso) {
      await carregarDados();
      onRefresh();
    }
  }

  async function desfazerPagamento(id_parcela: number) {
    const sucesso = await toast.promise(
      ParcelaRequests.desfazerPagamento(id_parcela),
      {
        loading: 'Desfazendo pagamento...',
        success: '✅ Pagamento desfeito com sucesso!',
        error: (err) => {
          if (err?.message) {
            return `❌ ${err.message}`;
          }
          return '❌ Erro ao desfazer pagamento. Tente novamente.';
        },
      }
    );

    if (sucesso) {
      await carregarDados();
      onRefresh();
    }
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">Parcelas</h2>
        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
          Controle financeiro
        </span>
      </div>

      {loading && <p className="text-muted-foreground">Carregando parcelas...</p>}
      {erro && <p className="text-red-500 dark:text-red-400">{erro}</p>}

      {!loading &&
        emprestimos.map((emp) => (
          <div
            key={emp.id_emprestimo}
            className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold text-foreground">
                Empréstimo #{emp.id_emprestimo}
              </h3>
              <span className="text-sm text-muted-foreground">
                R$ {Number(emp.valor_emprestimo).toFixed(2)}
              </span>
            </div>

            <div className="space-y-2">
              {emp.parcelas && emp.parcelas.length > 0 ? (
                emp.parcelas.map((p) => (
                  <div
                    key={p.id_parcela}
                    className="flex justify-between items-center bg-muted/30 p-3 rounded-lg hover:bg-muted/50 transition-all"
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
                          Pago em {new Date(p.data_pagamento).toLocaleDateString("pt-BR")}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getBadge(p.status_parcela)}`}>
                        {p.status_parcela}
                      </span>

                      {p.status_parcela !== "PAGA" ? (
                        <button
                          onClick={() => marcarComoPaga(p.id_parcela)}
                          className="text-xs bg-primary text-primary-foreground hover:opacity-90 px-3 py-1 rounded-lg font-medium transition-all"
                        >
                          Dar baixa
                        </button>
                      ) : (
                        <button
                          onClick={() => desfazerPagamento(p.id_parcela)}
                          className="text-xs bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 px-3 py-1 rounded-lg font-medium transition-all"
                        >
                          Desfazer
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma parcela encontrada.</p>
              )}
            </div>
          </div>
        ))}

      {!loading && emprestimos.length === 0 && (
        <p className="text-muted-foreground">Nenhum empréstimo encontrado para este cliente.</p>
      )}
    </div>
  );
}

export default ParcelasDoCliente;