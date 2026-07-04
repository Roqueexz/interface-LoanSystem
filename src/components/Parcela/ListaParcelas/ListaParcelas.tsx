import { useEffect, useState } from "react";
import ParcelaRequests from "../../../fetch/ParcelaRequests";
import type ParcelaDTO from "../../../interface/ParcelaDTO";

interface Props {
  id_emprestimo: number;
}

function ListaParcelas({ id_emprestimo }: Props) {
  const [parcelas, setParcelas] = useState<ParcelaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

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

  async function marcarComoPaga(id_parcela: number) {
    const sucesso = await ParcelaRequests.pagar(id_parcela);
    if (sucesso) {
      await carregarParcelas();
    } else {
      alert("Erro ao pagar parcela.");
    }
  }

  async function desfazerPagamento(id_parcela: number) {
    const confirmacao = confirm("Tem certeza que deseja desfazer o pagamento?");
    if (!confirmacao) return;

    const sucesso = await ParcelaRequests.desfazerPagamento(id_parcela);
    if (sucesso) {
      await carregarParcelas();
    } else {
      alert("Erro ao desfazer pagamento.");
    }
  }

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

  if (loading) {
    return <p className="text-slate-500">Carregando parcelas...</p>;
  }

  if (erro) {
    return <p className="text-red-500">{erro}</p>;
  }

  if (parcelas.length === 0) {
    return <p className="text-slate-400">Nenhuma parcela encontrada para este emprestimo.</p>;
  }

  return (
    <div className="bg-white border rounded-xl p-4 space-y-3 shadow-sm">
      {parcelas.map((p) => (
        <div
          key={p.id_parcela}
          className="flex justify-between items-center bg-slate-50 p-3 rounded-lg hover:bg-slate-100 transition-all"
        >
          <div>
            <p className="text-sm font-medium text-slate-700">
              Parcela {p.numero_parcela} - R$ {p.valor_parcela.toFixed(2)}
            </p>
            <p className="text-xs text-slate-500">
              Venc: {new Date(p.data_vencimento).toLocaleDateString("pt-BR")}
            </p>
            {p.data_pagamento && (
              <p className="text-xs text-green-600">
                Pago em: {new Date(p.data_pagamento).toLocaleDateString("pt-BR")}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs px-2 py-1 rounded-full ${getBadge(p.status_parcela)}`}>
              {p.status_parcela}
            </span>

            {p.status_parcela !== "PAGA" ? (
              <button
                onClick={() => marcarComoPaga(p.id_parcela)}
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg transition-all"
              >
                Dar baixa
              </button>
            ) : (
              <button
                onClick={() => desfazerPagamento(p.id_parcela)}
                className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg transition-all"
              >
                Desfazer
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListaParcelas;