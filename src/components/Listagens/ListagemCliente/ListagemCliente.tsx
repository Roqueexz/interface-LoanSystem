import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ClienteRequests from "../../../fetch/ClienteRequests";
import type ClienteDTO from "../../../interface/ClienteDTO";

function ListagemCliente() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // -----------------------------
  // CARREGAR CLIENTES
  // -----------------------------
  async function carregarClientes() {
    setLoading(true);
    setErro("");

    const dados = await ClienteRequests.obterListaDeClientes();

    if (dados) {
      setClientes(dados);
    } else {
      setErro("Erro ao carregar clientes.");
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  // -----------------------------
  // EXCLUIR CLIENTE
  // -----------------------------
  async function handleExcluir(id: number | undefined) {
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
  // RENDER
  // -----------------------------
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">

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

        {/* ESTADOS */}
        {loading && (
          <p className="text-slate-500">Carregando clientes...</p>
        )}

        {erro && (
          <p className="text-red-500 font-medium">{erro}</p>
        )}

        {/* TABELA */}
        {!loading && clientes.length > 0 && (
          <div className="overflow-x-auto bg-white shadow-xl rounded-2xl">
            <table className="w-full text-left">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4">Nome</th>
                  <th className="p-4">Telefone</th>
                  <th className="p-4">Cidade</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>

              <tbody>
                {clientes.map((cliente) => (
                  <tr
                    key={cliente.id_cliente}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="p-4">
                      {cliente.nome_cliente} {cliente.sobrenome_cliente}
                    </td>

                    <td className="p-4">{cliente.telefone}</td>
                    <td className="p-4">{cliente.cidade}</td>
                    <td className="p-4">{cliente.estado}</td>

                    <td className="p-4">
                      <div className="flex gap-2 justify-center">

                        {/* VER */}
                        <button
                          onClick={() =>
                            navigate(`/clientes/${cliente.id_cliente}`)
                          }
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
                        >
                          Ver
                        </button>

                        {/* EDITAR */}
                        <button
                          onClick={() =>
                            navigate(`/clientes/editar/${cliente.id_cliente}`)
                          }
                          className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm"
                        >
                          Editar
                        </button>

                        {/* EXCLUIR */}
                        <button
                          onClick={() =>
                            handleExcluir(cliente.id_cliente)
                          }
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

        {/* VAZIO */}
        {!loading && clientes.length === 0 && (
          <p className="text-slate-500">
            Nenhum cliente cadastrado.
          </p>
        )}
      </div>
    </div>
  );
}

export default ListagemCliente;