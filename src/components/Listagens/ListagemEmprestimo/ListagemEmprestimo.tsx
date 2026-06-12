import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  CreditCard,
  Search,
} from "lucide-react";

import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import ClienteRequests from "../../../fetch/ClienteRequests";

import type EmprestimoDTO from "../../../interface/EmprestimoDTO";
import type ClienteDTO from "../../../interface/ClienteDTO";

function ListagemEmprestimo() {
  const navigate = useNavigate();

  const [emprestimos, setEmprestimos] = useState<EmprestimoDTO[]>([]);
  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [busca, setBusca] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const listaEmprestimos = await EmprestimoRequests.obterListaDeEmprestimos();
    const listaClientes = await ClienteRequests.obterListaDeClientes();

    if (listaEmprestimos) {
      setEmprestimos(listaEmprestimos);
    }
    if (listaClientes) {
      setClientes(listaClientes);
    }
  };

  const getCliente = (id_cliente: number) => {
    return clientes.find((cliente) => cliente.id_cliente === id_cliente);
  };

  const handleDelete = async (id: number) => {
    const sucesso = await EmprestimoRequests.excluirEmprestimo(id);

    if (sucesso) {
      setEmprestimos((prev) => prev.filter((e) => e.id_emprestimo !== id));
      alert("Empréstimo excluído com sucesso!");
    } else {
      alert("Erro ao excluir empréstimo.");
    }

    setConfirmDelete(null);
  };

  const filtrados = emprestimos.filter((e) => {
    const cliente = getCliente(e.id_cliente);
    const nomeCliente = cliente
      ? `${cliente.nome_cliente} ${cliente.sobrenome_cliente}`
      : "";

    return (
      nomeCliente.toLowerCase().includes(busca.toLowerCase()) ||
      String(e.id_emprestimo).includes(busca)
    );
  });

  const formatarMoeda = (valor: number) =>
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className="p-4 sm:p-8"> {/* Removido o min-h-screen e bg originais para casar com o Layout */}
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Empréstimos</h1>
            <p className="text-slate-500 text-sm mt-1">
              {emprestimos.length} empréstimo(s) registrado(s)
            </p>
          </div>

          <button
            onClick={() => navigate("/novo-emprestimo")}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md"
          >
            <Plus size={18} />
            Novo Empréstimo
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
            placeholder="Buscar por cliente ou ID..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Listagem principal */}
        {filtrados.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 flex flex-col items-center gap-4 text-center">
            <div className="bg-indigo-50 p-5 rounded-full">
              <CreditCard size={36} className="text-indigo-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-700">Nenhum empréstimo encontrado</p>
              <p className="text-sm text-slate-400 mt-1">
                {busca ? "Tente outra busca." : "Cadastre seu primeiro empréstimo."}
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
                    <th className="text-left px-5 py-3">Cliente</th>
                    <th className="text-left px-5 py-3">Valor</th>
                    <th className="text-left px-5 py-3">Parcelas</th>
                    <th className="text-left px-5 py-3">Juros</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-center px-5 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((e) => {
                    const cliente = getCliente(e.id_cliente);

                    return (
                      <tr
                        key={e.id_emprestimo}
                        className="border-t border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">#{e.id_emprestimo}</td>
                        <td className="px-5 py-4 font-medium text-slate-700">
                          {cliente
                            ? `${cliente.nome_cliente} ${cliente.sobrenome_cliente}`
                            : "Cliente não encontrado"}
                        </td>
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-semibold text-slate-800">
                              {formatarMoeda(e.valor_emprestimo)}
                            </p>
                            <p className="text-xs text-slate-400">
                              {formatarMoeda(e.valor_parcela)} /parcela
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-600">{e.num_parcelas}x</td>
                        <td className="px-5 py-4 text-slate-600">{e.juros}%</td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                              e.status_emprestimo
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {e.status_emprestimo ? "Ativo" : "Liquidado"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => navigate(`/emprestimos/${e.id_emprestimo}`)}
                              className="p-2 rounded-lg hover:bg-indigo-50"
                              title="Visualizar detalhes"
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              onClick={() => navigate(`/editar-emprestimo/${e.id_emprestimo}`)}
                              className="p-2 rounded-lg hover:bg-blue-50"
                              title="Editar empréstimo"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              onClick={() => setConfirmDelete(e.id_emprestimo!)}
                              className="p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700"
                              title="Excluir empréstimo"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
            <h2 className="text-lg font-bold mb-3 text-slate-800">Excluir Empréstimo</h2>
            <p className="text-slate-600 mb-6 text-sm">
              Deseja realmente excluir este empréstimo? Os registros vinculados a este histórico serão removidos do sistema local.
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

export default ListagemEmprestimo;