import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import ClienteRequests from "../../../fetch/ClienteRequests";

import type EmprestimoDTO from "../../../interface/EmprestimoDTO";
import type ClienteDTO from "../../../interface/ClienteDTO";
import { useToast } from "../../../hooks/useToast";
import ModalConfirmacao from "../../../ui/Modal/ModalConfirmacao";

function ListagemEmprestimo() {
  const navigate = useNavigate();
  const toast = useToast();

  const [emprestimos, setEmprestimos] = useState<EmprestimoDTO[]>([]);
  const [clientes, setClientes] = useState<ClienteDTO[]>([]);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [filtro, setFiltro] = useState<
    "TODOS" | "EM DIA" | "ATRASADO" | "EM ABERTO"
  >("TODOS");

  // Estado para o modal de confirmacao
  const [emprestimoParaExcluir, setEmprestimoParaExcluir] = useState<number | null>(null);
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);

  // -----------------------------
  // LOAD DATA
  // -----------------------------
  async function carregarEmprestimos() {
    setLoading(true);
    setErro("");

    const [emprestimosData, clientesData] = await Promise.all([
      EmprestimoRequests.obterListaDeEmprestimos(),
      ClienteRequests.obterListaDeClientes(),
    ]);

    if (emprestimosData) {
      setEmprestimos(emprestimosData);
    } else {
      setErro("Erro ao carregar empréstimos.");
    }

    if (clientesData) {
      setClientes(clientesData);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarEmprestimos();
  }, []);

  // -----------------------------
  // DELETE
  // -----------------------------
  function handleExcluir(id: number) {
    setEmprestimoParaExcluir(id);
    setModalConfirmOpen(true);
  }

 async function confirmarExclusao() {
  if (!emprestimoParaExcluir) return;

  const sucesso = await toast.promise(
    EmprestimoRequests.excluirEmprestimo(emprestimoParaExcluir),
    {
      loading: 'Excluindo empréstimo...',
      success: '✅ Empréstimo removido com sucesso!',
      error: (err) => err?.message || '❌ Erro ao remover empréstimo.',
    }
  );

  if (sucesso) {
    setEmprestimos((prev) =>
      prev.filter((e) => e.id_emprestimo !== emprestimoParaExcluir)
    );
  }

  setEmprestimoParaExcluir(null);
  setModalConfirmOpen(false);
}
  // -----------------------------
  // HELPERS
  // -----------------------------
  function getNomeCliente(id_cliente: number) {
    const cliente = clientes.find(
      (c) => c.id_cliente === id_cliente
    );

    return cliente
      ? `${cliente.nome_cliente} ${cliente.sobrenome_cliente}`
      : `Cliente #${id_cliente}`;
  }

  function getStatus(emp: EmprestimoDTO) {
    if (!emp.data_devolucao) return "EM ABERTO";

    const hoje = new Date();
    const dev = new Date(emp.data_devolucao);

    if (dev < hoje) return "ATRASADO";

    return "EM DIA";
  }

  function getStatusStyle(status: string) {
    switch (status) {
      case "EM DIA":
        return "bg-green-100 text-green-700";
      case "ATRASADO":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  // -----------------------------
  // FILTERED DATA
  // -----------------------------
  const emprestimosFiltrados = emprestimos.filter((emp) => {
    const status = getStatus(emp);

    if (filtro === "TODOS") return true;

    return status === filtro;
  });

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-slate-800">
          Empréstimos
        </h1>

        <button
          onClick={() => navigate("/emprestimos/novo")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700"
        >
          + Novo
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 mb-6">

        <button
          onClick={() => setFiltro("TODOS")}
          className={`px-3 py-1 rounded-lg text-sm font-bold ${
            filtro === "TODOS"
              ? "bg-slate-800 text-white"
              : "bg-slate-200"
          }`}
        >
          Todos
        </button>

        <button
          onClick={() => setFiltro("EM DIA")}
          className={`px-3 py-1 rounded-lg text-sm font-bold ${
            filtro === "EM DIA"
              ? "bg-green-600 text-white"
              : "bg-green-100 text-green-700"
          }`}
        >
          Em Dia
        </button>

        <button
          onClick={() => setFiltro("ATRASADO")}
          className={`px-3 py-1 rounded-lg text-sm font-bold ${
            filtro === "ATRASADO"
              ? "bg-red-600 text-white"
              : "bg-red-100 text-red-700"
          }`}
        >
          Atrasado
        </button>

        <button
          onClick={() => setFiltro("EM ABERTO")}
          className={`px-3 py-1 rounded-lg text-sm font-bold ${
            filtro === "EM ABERTO"
              ? "bg-yellow-500 text-white"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          Em Aberto
        </button>

      </div>

      {/* STATES */}
      {loading && (
        <p className="text-slate-500">Carregando...</p>
      )}

      {erro && (
        <p className="text-red-500 font-medium">{erro}</p>
      )}

      {/* TABLE */}
      {!loading && emprestimosFiltrados.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-xl rounded-2xl">
          <table className="w-full">

            <thead className="bg-slate-100">
              <tr>
                <th className="p-4">Cliente</th>
                <th className="p-4">Valor</th>
                <th className="p-4">Parcelas</th>
                <th className="p-4">Parcela</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>

            <tbody>
              {emprestimosFiltrados.map((emp) => {
                const status = getStatus(emp);

                return (
                  <tr
                    key={emp.id_emprestimo}
                    className="border-t hover:bg-slate-50"
                  >

                    {/* CLIENTE */}
                    <td className="p-4 font-medium">
                      {getNomeCliente(emp.id_cliente)}
                    </td>

                    <td className="p-4 font-semibold">
                      R$ {Number(emp.valor_emprestimo).toFixed(2)}
                    </td>

                    <td className="p-4">
                      {emp.num_parcelas}
                    </td>

                    <td className="p-4">
                      R$ {Number(emp.valor_parcela).toFixed(2)}
                    </td>

                    {/* STATUS BADGE */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(status)}`}
                      >
                        {status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4">
                      <div className="flex gap-2 justify-center">

                        <button
                          onClick={() =>
                            navigate(`/emprestimos/${emp.id_emprestimo}`)
                          }
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-all"
                        >
                          Ver
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/editar-emprestimo/${emp.id_emprestimo}`)
                          }
                          className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition-all"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() =>
                            handleExcluir(emp.id_emprestimo!)
                          }
                          className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-all"
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

      {/* EMPTY */}
      {!loading && emprestimosFiltrados.length === 0 && (
        <p className="text-slate-500">
          Nenhum empréstimo encontrado para este filtro.
        </p>
      )}

      {/* Modal de Confirmacao */}
      <ModalConfirmacao
        isOpen={modalConfirmOpen}
        onClose={() => {
          setModalConfirmOpen(false);
          setEmprestimoParaExcluir(null);
        }}
        onConfirm={confirmarExclusao}
        title="Excluir Empréstimo"
        message="Tem certeza que deseja excluir este empréstimo? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}

export default ListagemEmprestimo;