import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Users,
  Search,
} from "lucide-react";

import ClienteRequests from "../../../fetch/ClienteRequests";
import type ClienteDTO from "../../../interface/ClienteDTO";

function ListagemCliente() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [busca, setBusca] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    const lista = await ClienteRequests.obterListaDeClientes();
    if (lista) {
      setClientes(lista);
    }
  };

  const handleDelete = async (id: number) => {
    const sucesso = await ClienteRequests.excluirCliente(id);

    if (sucesso) {
      setClientes((prev) => prev.filter((c) => c.id_cliente !== id));
      alert("Cliente excluído com sucesso!");
    } else {
      alert("Erro ao excluir cliente.");
    }

    setConfirmDelete(null);
  };

  const filtrados = clientes.filter((c) =>
    `${c.nome_cliente} ${c.sobrenome_cliente} ${c.telefone} ${c.cidade} ${c.estado}`
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8"> {/* Removido min-h-screen e bg para herdar do Layout */}
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
            <p className="text-slate-500 text-sm mt-1">
              {clientes.length} cliente(s) cadastrado(s)
            </p>
          </div>

          <button
            onClick={() => navigate("/novo-cliente")}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md"
          >
            <Plus size={18} />
            Novo Cliente
          </button>
        </div>

        {/* Busca */}
        <div className="relative mb-6">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Lista vazia */}
        {filtrados.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 flex flex-col items-center gap-4 text-center">
            <div className="bg-indigo-50 p-5 rounded-full">
              <Users size={36} className="text-indigo-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-700">Nenhum cliente encontrado</p>
              <p className="text-sm text-slate-400 mt-1">
                {busca ? "Tente outra busca." : "Cadastre seu primeiro cliente."}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-700 text-white text-sm">
                    <th className="text-left px-5 py-3">ID</th>
                    <th className="text-left px-5 py-3">Nome</th>
                    <th className="text-left px-5 py-3">Telefone</th>
                    <th className="text-left px-5 py-3">Cidade</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-center px-5 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((c) => (
                    <tr
                      key={c.id_cliente}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">#{c.id_cliente}</td>
                      <td className="px-5 py-4">
                        {c.nome_cliente} {c.sobrenome_cliente}
                      </td>
                      <td className="px-5 py-4">{c.telefone}</td>
                      <td className="px-5 py-4">{c.cidade}/{c.estado}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                            c.status_cliente
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {c.status_cliente ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => navigate(`/clientes/${c.id_cliente}`)}
                            className="p-2 rounded-lg hover:bg-indigo-50"
                            title="Visualizar detalhes"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() => navigate(`/editar-cliente/${c.id_cliente}`)}
                            className="p-2 rounded-lg hover:bg-blue-50"
                            title="Editar cliente"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => setConfirmDelete(c.id_cliente!)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700"
                            title="Excluir cliente"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Exclusão */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-lg font-bold mb-3 text-slate-800">Excluir Cliente</h2>
            <p className="text-slate-600 mb-6 text-sm">
              Deseja realmente excluir este cliente? Essa operação desativará seus empréstimos ativos de forma correspondente no sistema.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 border border-slate-300 rounded-xl py-2 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 bg-red-600 text-white rounded-xl py-2 font-semibold text-sm hover:bg-red-700 transition-all"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListagemCliente;