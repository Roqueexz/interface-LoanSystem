import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ClienteRequests from "../../../fetch/ClienteRequests";
import EmprestimoRequests from "../../../fetch/EmprestimoRequests";

import type ClienteDTO from "../../../interface/ClienteDTO";
import type EmprestimoDTO from "../../../interface/EmprestimoDTO";

function ListagemCliente() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [emprestimos, setEmprestimos] = useState<EmprestimoDTO[]>([]);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // -----------------------------
  // CARREGAR DADOS
  // -----------------------------
  async function carregarClientes() {
    setLoading(true);
    setErro("");

    const [clientesData, emprestimosData] = await Promise.all([
      ClienteRequests.obterListaDeClientes(),
      EmprestimoRequests.obterListaDeEmprestimos(),
    ]);

    if (clientesData) {
      setClientes(clientesData);
    } else {
      setErro("Erro ao carregar clientes.");
    }

    if (emprestimosData) {
      setEmprestimos(emprestimosData);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  // -----------------------------
  // EXCLUIR CLIENTE
  // -----------------------------
  async function handleExcluir(id?: number) {
    if (!id) return;

    const confirmacao = confirm(
      "Tem certeza que deseja excluir este cliente?"
    );

    if (!confirmacao) return;

    const sucesso = await ClienteRequests.excluirCliente(id);

    if (sucesso) {
      setClientes((prev) =>
        prev.filter((c) => c.id_cliente !== id)
      );
      alert("Cliente removido com sucesso!");
    } else {
      alert("Erro ao remover cliente.");
    }
  }

  // -----------------------------
  // HELPERS
  // -----------------------------
  function clienteTemDivida(id_cliente: number) {
    return emprestimos.some(
      (emp) =>
        emp.id_cliente === id_cliente &&
        emp.status_emprestimo === true
    );
  }

  function getClienteStatus(id_cliente: number) {
    return clienteTemDivida(id_cliente)
      ? "COM DÍVIDA"
      : "SEM DÍVIDA";
  }

  function getStatusStyle(id_cliente: number) {
    return clienteTemDivida(id_cliente)
      ? "bg-red-100 text-red-700"
      : "bg-green-100 text-green-700";
  }

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          Clientes
        </h1>

        <button
          onClick={() => navigate("/clientes/novo")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700"
        >
          + Novo Cliente
        </button>
      </div>

      {/* STATES */}
      {loading && (
        <p className="text-slate-500">Carregando clientes...</p>
      )}

      {erro && (
        <p className="text-red-500 font-medium">{erro}</p>
      )}

      {/* TABLE */}
      {!loading && clientes.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-xl rounded-2xl">

          <table className="w-full">

            <thead className="bg-slate-100">
              <tr>
                <th className="p-4">Nome</th>
                <th className="p-4">Telefone</th>
                <th className="p-4">Cidade</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>

            <tbody>
              {clientes.map((cliente) => (
                <tr
                  key={cliente.id_cliente}
                  className="border-t hover:bg-slate-50 cursor-pointer"
                  onClick={() =>
                    navigate(`/clientes/${cliente.id_cliente!}`)
                  }
                >

                  {/* NOME */}
                  <td className="p-4 font-medium">
                    {cliente.nome_cliente} {cliente.sobrenome_cliente}
                  </td>

                  <td className="p-4">
                    {cliente.telefone}
                  </td>

                  <td className="p-4">
                    {cliente.cidade}
                  </td>

                  <td className="p-4">
                    {cliente.estado}
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                        cliente.id_cliente!
                      )}`}
                    >
                      {getClienteStatus(cliente.id_cliente!)}
                    </span>
                  </td>

                  {/* AÇÕES */}
                  <td className="p-4">
                    <div className="flex gap-2 justify-center">

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/clientes/${cliente.id_cliente!}`);
                        }}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
                      >
                        Ver
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/editar-cliente/${cliente.id_cliente!}`);
                        }}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm"
                      >
                        Editar
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExcluir(cliente.id_cliente);
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
                      >
                        Excluir
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && clientes.length === 0 && (
        <p className="text-slate-500">
          Nenhum cliente cadastrado.
        </p>
      )}

    </div>
  );
}

export default ListagemCliente;