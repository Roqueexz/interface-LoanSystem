import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import type EmprestimoDTO from "../../../interface/EmprestimoDTO";
import { SkeletonDetalhes } from "../../../ui/Skeleton";

interface DetalhesEmprestimoProps {
  id_emprestimo: number;
}

function DetalhesEmprestimo({ id_emprestimo }: DetalhesEmprestimoProps) {
  const navigate = useNavigate();

  const [emprestimo, setEmprestimo] = useState<EmprestimoDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarEmprestimo() {
      try {
        setLoading(true);

        const resposta = await EmprestimoRequests.obterEmprestimoPorId(id_emprestimo);

        if (resposta) {
          setEmprestimo(resposta);
        } else {
          setError("Empréstimo não encontrado.");
        }
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar os dados do empréstimo.");
      } finally {
        setLoading(false);
      }
    }

    carregarEmprestimo();
  }, [id_emprestimo]);

  const formatarData = (data: string | Date | undefined) => {
    if (!data) return "Não informada";
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  if (loading) {
    return <SkeletonDetalhes />;
  }

  if (error || !emprestimo) {
    return (
      <div className="py-8 px-4 flex items-center justify-center min-h-[50vh]">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
          <h2 className="text-red-600 font-bold mb-4">{error}</h2>
          <button
            onClick={() => navigate("/emprestimos")}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-xl font-bold transition-all"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Empréstimo #{emprestimo.id_emprestimo}
        </h1>

        <p className="text-slate-400 font-medium mb-8">
          Informações completas do empréstimo
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4 text-slate-800 border-b border-slate-100 pb-2">
              Dados Financeiros
            </h2>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-0.5">
                  Valor do Empréstimo
                </span>
                <p className="font-extrabold text-2xl text-slate-800">
                  {formatarMoeda(emprestimo.valor_emprestimo)}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-0.5">
                  Valor da Parcela
                </span>
                <p className="font-extrabold text-xl text-emerald-600">
                  {emprestimo.valor_parcela
                    ? formatarMoeda(emprestimo.valor_parcela)
                    : "N/A"}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-0.5">
                  Número de Parcelas
                </span>
                <p className="text-slate-700 font-medium">{emprestimo.num_parcelas}</p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-0.5">
                  Taxa de Juros
                </span>
                <p className="text-slate-700 font-medium">{emprestimo.juros}%</p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-0.5">
                  Tipo de Juros
                </span>
                <p className="text-slate-700 font-medium capitalize">{emprestimo.tipo_juros}</p>
              </div>

              {emprestimo.forma_pagamento && (
                <div>
                  <span className="text-xs font-semibold uppercase text-slate-400 block mb-0.5">
                    Forma de Pagamento
                  </span>
                  <p className="text-slate-700 font-medium capitalize">
                    {emprestimo.forma_pagamento}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 text-slate-800 border-b border-slate-100 pb-2">
              Dados Gerais
            </h2>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-0.5">
                  ID do Cliente
                </span>
                <p className="text-slate-700 font-medium">#{emprestimo.id_cliente}</p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-0.5">
                  Data do Empréstimo
                </span>
                <p className="text-slate-700 font-medium">
                  {formatarData(emprestimo.data_emprestimo)}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-0.5">
                  Data de Devolução
                </span>
                <p className="text-slate-700 font-medium">
                  {formatarData(emprestimo.data_devolucao)}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">
                  Status
                </span>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      emprestimo.status_emprestimo
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {emprestimo.status_emprestimo ? "Ativo" : "Finalizado"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row gap-4">
          <button
            onClick={() => navigate(`/editar-emprestimo/${emprestimo.id_emprestimo}`)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-md transition-all"
          >
            Editar Empréstimo
          </button>

          <button
            onClick={() => navigate("/emprestimos")}
            className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-bold transition-all"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetalhesEmprestimo;