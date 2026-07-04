import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Pencil, Trash2, Users } from "lucide-react";

import ClienteRequests from "../../../fetch/ClienteRequests";
import EmprestimoRequests from "../../../fetch/EmprestimoRequests";

import type ClienteDTO from "../../../interface/ClienteDTO";
import type EmprestimoDTO from "../../../interface/EmprestimoDTO";
import { useToast } from "../../../hooks/useToast";
import ModalConfirmacao from "../../../ui/Modal/ModalConfirmacao";
import { SkeletonLista } from "../../../ui/Skeleton";

function ListagemCliente() {
  const navigate = useNavigate();
  const toast = useToast();

  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [emprestimos, setEmprestimos] = useState<EmprestimoDTO[]>([]);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [clienteParaExcluir, setClienteParaExcluir] = useState<number | null>(null);
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);

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

  function handleExcluir(id: number) {
    setClienteParaExcluir(id);
    setModalConfirmOpen(true);
  }

  async function confirmarExclusao() {
    if (!clienteParaExcluir) return;

    const sucesso = await toast.promise(
      ClienteRequests.excluirCliente(clienteParaExcluir),
      {
        loading: 'Excluindo cliente...',
        success: '✅ Cliente removido com sucesso!',
        error: '❌ Erro ao remover cliente.',
      }
    );

    if (sucesso) {
      setClientes((prev) =>
        prev.filter((c) => c.id_cliente !== clienteParaExcluir)
      );
    }

    setClienteParaExcluir(null);
    setModalConfirmOpen(false);
  }

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
      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  }

  if (loading) {
    return <SkeletonLista itens={5} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground text-sm">Gerencie todos os seus clientes</p>
        </div>

        <button
          onClick={() => navigate("/clientes/novo")}
          className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/25"
        >
          <Plus size={18} />
          Novo Cliente
        </button>
      </div>

      {/* ERRO */}
      {erro && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400 mb-6">
          {erro}
        </div>
      )}

      {/* TABLE */}
      {!loading && clientes.length > 0 && (
        <div className="card overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Telefone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Cidade</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr
                    key={cliente.id_cliente}
                    className="table-row cursor-pointer hover:bg-accent/50"
                    onClick={() => navigate(`/clientes/${cliente.id_cliente!}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                          {cliente.nome_cliente?.[0]}{cliente.sobrenome_cliente?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {cliente.nome_cliente} {cliente.sobrenome_cliente}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {cliente.telefone}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {cliente.cidade}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {cliente.estado}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                          cliente.id_cliente!
                        )}`}
                      >
                        {getClienteStatus(cliente.id_cliente!)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/clientes/${cliente.id_cliente!}`);
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                          title="Ver"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/editar-cliente/${cliente.id_cliente!}`);
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExcluir(cliente.id_cliente!);
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                          title="Excluir"
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

      {/* EMPTY STATE */}
      {!loading && clientes.length === 0 && (
        <div className="card p-12 text-center">
          <Users size={48} className="mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum cliente cadastrado</h3>
          <p className="text-muted-foreground text-sm mb-4">Comece cadastrando seu primeiro cliente.</p>
          <button
            onClick={() => navigate("/clientes/novo")}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all"
          >
            <Plus size={18} />
            Novo Cliente
          </button>
        </div>
      )}

      {/* Modal de Confirmacao */}
      <ModalConfirmacao
        isOpen={modalConfirmOpen}
        onClose={() => {
          setModalConfirmOpen(false);
          setClienteParaExcluir(null);
        }}
        onConfirm={confirmarExclusao}
        title="Excluir Cliente"
        message="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}

export default ListagemCliente;