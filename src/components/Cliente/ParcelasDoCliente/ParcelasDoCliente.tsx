import { useEffect, useState } from "react";

import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import type ParcelaDTO from "../../../interface/ParcelaDTO";

interface EmprestimoComParcelas {
  id_emprestimo: number;
  valor_emprestimo: number;
  parcelas: ParcelaDTO[];
}

interface Props {
  id_cliente: number;
}

function ParcelasDoCliente({ id_cliente }: Props) {
  const [emprestimos, setEmprestimos] = useState<EmprestimoComParcelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // --------------------------------------
  // CARREGAR DADOS
  // --------------------------------------
  async function carregarDados() {
    setLoading(true);
    setErro("");

    try {
      const lista = await EmprestimoRequests.obterListaDeEmprestimos();

      if (!lista) {
        setErro("Erro ao carregar parcelas.");
        setLoading(false);
        return;
      }

      const filtrados = lista.filter(
        (emp: any) => emp.id_cliente === id_cliente
      );

      setEmprestimos(filtrados);
    } catch (err) {
      setErro("Erro inesperado ao carregar parcelas.");
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarDados();
  }, [id_cliente]);

  // --------------------------------------
  // DAR BAIXA NA PARCELA (FRONT SIMULADO)
  // --------------------------------------
  function marcarComoPaga(id_parcela: number) {
    setEmprestimos((prev) =>
      prev.map((emp) => ({
        ...emp,
        parcelas: emp.parcelas.map((p) =>
          p.id_parcela === id_parcela
            ? {
                ...p,
                status_parcela: "PAGA",
                data_pagamento: new Date().toISOString(),
              }
            : p
        ),
      }))
    );
  }

  // --------------------------------------
  // BADGE STATUS
  // --------------------------------------
  function getBadge(status: ParcelaDTO["status_parcela"]) {
    switch (status) {
      case "PAGA":
        return "bg-green-100 text-green-700";
      case "ATRASADA":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  // --------------------------------------
  // RENDER
  // --------------------------------------
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">
          Parcelas
        </h2>

        <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
          Controle financeiro
        </span>
      </div>

      {/* STATES */}
      {loading && (
        <p className="text-slate-500">Carregando parcelas...</p>
      )}

      {erro && (
        <p className="text-red-500">{erro}</p>
      )}

      {/* CONTENT */}
      {!loading &&
        emprestimos.map((emp) => (
          <div
            key={emp.id_emprestimo}
            className="bg-white border rounded-xl p-4 space-y-3 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* EMPRESTIMO HEADER */}
            <div className="flex justify-between">
              <h3 className="font-semibold text-slate-700">
                Empréstimo #{emp.id_emprestimo}
              </h3>

              <span className="text-sm text-slate-500">
                R$ {Number(emp.valor_emprestimo).toFixed(2)}
              </span>
            </div>

            {/* PARCELAS */}
            <div className="space-y-2">
              {emp.parcelas?.map((p) => (
                <div
                  key={p.id_parcela}
                  className="flex justify-between items-center bg-slate-50 p-3 rounded-lg hover:bg-slate-100 transition-all"
                >
                  {/* INFO */}
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Parcela {p.numero_parcela}
                    </p>

                    <p className="text-xs text-slate-500">
                      Venc:{" "}
                      {new Date(p.data_vencimento).toLocaleDateString()}
                    </p>

                    {p.data_pagamento && (
                      <p className="text-xs text-green-600">
                        Pago em{" "}
                        {new Date(p.data_pagamento).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-3">

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getBadge(
                        p.status_parcela
                      )}`}
                    >
                      {p.status_parcela}
                    </span>

                    {p.status_parcela !== "PAGA" && (
                      <button
                        onClick={() =>
                          marcarComoPaga(p.id_parcela)
                        }
                        className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg transition-all"
                      >
                        Dar baixa
                      </button>
                    )}

                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      {!loading && emprestimos.length === 0 && (
        <p className="text-slate-500">
          Nenhuma parcela encontrada para este cliente.
        </p>
      )}
    </div>
  );
}

export default ParcelasDoCliente;