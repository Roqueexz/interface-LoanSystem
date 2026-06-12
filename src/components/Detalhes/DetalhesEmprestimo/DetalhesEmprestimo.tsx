import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import type EmprestimoDTO from "../../../interface/EmprestimoDTO";

interface DetalhesEmprestimoProps {
  id_emprestimo: number;
}

function DetalhesEmprestimo({
  id_emprestimo,
}: DetalhesEmprestimoProps) {
  const navigate = useNavigate();

  const [emprestimo, setEmprestimo] =
    useState<EmprestimoDTO | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function carregarEmprestimo() {
      try {
        setLoading(true);

        const resposta =
          await EmprestimoRequests.obterEmprestimoPorId(
            id_emprestimo
          );

        if (resposta) {
          setEmprestimo(resposta);
        } else {
          setError("Empréstimo não encontrado.");
        }
      } catch (err) {
        console.error(err);
        setError(
          "Erro ao carregar os dados do empréstimo."
        );
      } finally {
        setLoading(false);
      }
    }

    carregarEmprestimo();
  }, [id_emprestimo]);

  if (loading) {
    return (
      <main className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold">
            Carregando empréstimo...
          </h2>
        </div>
      </main>
    );
  }

  if (error || !emprestimo) {
    return (
      <main className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-red-600 font-semibold">
            {error}
          </h2>

          <button
            onClick={() => navigate("/emprestimos")}
            className="mt-4 bg-slate-700 text-white px-4 py-2 rounded-lg"
          >
            Voltar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-100 flex-1 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Empréstimo #{emprestimo.id_emprestimo}
        </h1>

        <p className="text-slate-500 mb-8">
          Informações completas do empréstimo
        </p>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Dados Financeiros */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-slate-700 border-b pb-2">
              Dados Financeiros
            </h2>

            <div className="space-y-4">

              <div>
                <span className="text-sm text-slate-500">
                  Valor do Empréstimo
                </span>

                <p className="font-bold text-lg">
                  R$
                  {" "}
                  {emprestimo.valor_emprestimo.toFixed(2)}
                </p>
              </div>

              <div>
                <span className="text-sm text-slate-500">
                  Valor da Parcela
                </span>

                <p className="font-bold text-lg">
                  R$
                  {" "}
                  {emprestimo.valor_parcela.toFixed(2)}
                </p>
              </div>

              <div>
                <span className="text-sm text-slate-500">
                  Número de Parcelas
                </span>

                <p>
                  {emprestimo.num_parcelas}
                </p>
              </div>

              <div>
                <span className="text-sm text-slate-500">
                  Taxa de Juros
                </span>

                <p>
                  {emprestimo.juros}%
                </p>
              </div>

              <div>
                <span className="text-sm text-slate-500">
                  Tipo de Juros
                </span>

                <p className="capitalize">
                  {emprestimo.tipo_juros}
                </p>
              </div>

            </div>
          </div>

          {/* Dados Gerais */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-slate-700 border-b pb-2">
              Dados Gerais
            </h2>

            <div className="space-y-4">

              <div>
                <span className="text-sm text-slate-500">
                  ID do Cliente
                </span>

                <p>
                  #{emprestimo.id_cliente}
                </p>
              </div>

              <div>
                <span className="text-sm text-slate-500">
                  Data do Empréstimo
                </span>

                <p>
                  {new Date(
                    emprestimo.data_emprestimo
                  ).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <div>
                <span className="text-sm text-slate-500">
                  Data de Devolução
                </span>

                <p>
                  {emprestimo.data_devolucao
                    ? new Date(
                        emprestimo.data_devolucao
                      ).toLocaleDateString("pt-BR")
                    : "Não informada"}
                </p>
              </div>

              <div>
                <span className="text-sm text-slate-500">
                  Status
                </span>

                <div className="mt-1">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      emprestimo.status_emprestimo
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {emprestimo.status_emprestimo
                      ? "Ativo"
                      : "Finalizado"}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        <div className="mt-10 flex flex-col md:flex-row gap-4">

          <button
            onClick={() =>
              navigate(
                `/editar-emprestimo/${emprestimo.id_emprestimo}`
              )
            }
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-bold"
          >
            Editar Empréstimo
          </button>

          <button
            onClick={() => navigate("/emprestimos")}
            className="flex-1 border border-slate-300 hover:bg-slate-100 py-3 rounded-xl font-bold"
          >
            Voltar
          </button>

        </div>
      </div>
    </main>
  );
}

export default DetalhesEmprestimo;