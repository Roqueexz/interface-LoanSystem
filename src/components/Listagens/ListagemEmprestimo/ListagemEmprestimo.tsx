import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import type EmprestimoDTO from "../../../interface/EmprestimoDTO";

function ListagemEmprestimo() {
  const navigate = useNavigate();

  const [emprestimos, setEmprestimos] = useState<EmprestimoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // -----------------------------
  // CARREGAR EMPRÉSTIMOS
  // -----------------------------
  async function carregarEmprestimos() {
    setLoading(true);
    setErro("");

    const dados = await EmprestimoRequests.obterListaDeEmprestimos();

    if (dados) {
      setEmprestimos(dados);
    } else {
      setErro("Erro ao carregar empréstimos.");
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarEmprestimos();
  }, []);

  // -----------------------------
  // EXCLUIR EMPRÉSTIMO
  // -----------------------------
  async function handleExcluir(id: number | undefined) {
    if (!id) return;

    const confirmacao = confirm(
      "Tem certeza que deseja excluir este empréstimo?"
    );

    if (!confirmacao) return;

    const sucesso = await EmprestimoRequests.excluirEmprestimo(id);

    if (sucesso) {
      setEmprestimos((prev) =>
        prev.filter((e) => e.id_emprestimo !== id)
      );
      alert("Empréstimo removido com sucesso!");
    } else {
      alert("Erro ao remover empréstimo.");
    }
  }

  // -----------------------------
  // STATUS VISUAL (simples)
  // -----------------------------
  function getStatus(emp: EmprestimoDTO) {
    if (!emp.data_devolucao) return "EM ABERTO";

    const hoje = new Date();
    const dev = new Date(emp.data_devolucao);

    if (dev < hoje) return "ATRASADO";

    return "EM DIA";
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "EM DIA":
        return "text-green-600";
      case "ATRASADO":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  }

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">
            Empréstimos
          </h1>

          <button
            onClick={() => navigate("/emprestimos/novo")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700"
          >
            + Novo Empréstimo
          </button>
        </div>

        {/* ESTADOS */}
        {loading && (
          <p className="text-slate-500">Carregando empréstimos...</p>
        )}

        {erro && (
          <p className="text-red-500 font-medium">{erro}</p>
        )}

        {/* TABELA */}
        {!loading && emprestimos.length > 0 && (
          <div className="overflow-x-auto bg-white shadow-xl rounded-2xl">
            <table className="w-full text-left">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4">Cliente ID</th>
                  <th className="p-4">Valor</th>
                  <th className="p-4">Parcelas</th>
                  <th className="p-4">Parcela</th>
                  <th className="p-4">Juros</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>

              <tbody>
                {emprestimos.map((emp) => {
                  const status = getStatus(emp);

                  return (
                    <tr
                      key={emp.id_emprestimo}
                      className="border-t hover:bg-slate-50"
                    >

                      {/* CLIENTE */}
                      <td className="p-4">
                        {emp.id_cliente}
                      </td>

                      {/* VALOR */}
                      <td className="p-4 font-semibold">
                        R$ {Number(emp.valor_emprestimo).toFixed(2)}
                      </td>

                      {/* PARCELAS */}
                      <td className="p-4">
                        {emp.num_parcelas}
                      </td>

                      {/* PARCELA */}
                      <td className="p-4">
                        R$ {Number(emp.valor_parcela).toFixed(2)}
                      </td>

                      {/* JUROS */}
                      <td className="p-4">
                        {emp.juros}%
                      </td>

                      {/* STATUS */}
                      <td className={`p-4 font-bold ${getStatusColor(status)}`}>
                        {status}
                      </td>

                      {/* AÇÕES */}
                      <td className="p-4">
                        <div className="flex gap-2 justify-center">

                          {/* VER */}
                          <button
                            onClick={() =>
                              navigate(`/emprestimos/${emp.id_emprestimo}`)
                            }
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
                          >
                            Ver
                          </button>

                          {/* EDITAR */}
                          <button
                            onClick={() =>
                              navigate(`/emprestimos/editar/${emp.id_emprestimo}`)
                            }
                            className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm"
                          >
                            Editar
                          </button>

                          {/* EXCLUIR */}
                          <button
                            onClick={() =>
                              handleExcluir(emp.id_emprestimo)
                            }
                            className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
                          >
                            Excluir
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* VAZIO */}
        {!loading && emprestimos.length === 0 && (
          <p className="text-slate-500">
            Nenhum empréstimo cadastrado.
          </p>
        )}
      </div>
    </div>
  );
}

export default ListagemEmprestimo;