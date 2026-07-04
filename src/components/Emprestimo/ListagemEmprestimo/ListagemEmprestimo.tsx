import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Pencil, Trash2, CreditCard, Filter } from "lucide-react";

import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import ClienteRequests from "../../../fetch/ClienteRequests";

import type EmprestimoDTO from "../../../interface/EmprestimoDTO";
import type ClienteDTO from "../../../interface/ClienteDTO";
import { useToast } from "../../../hooks/useToast";
import ModalConfirmacao from "../../../ui/Modal/ModalConfirmacao";
import { SkeletonLista } from "../../../ui/Skeleton";

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

  const [emprestimoParaExcluir, setEmprestimoParaExcluir] = useState<number | null>(null);
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);

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
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "ATRASADO":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "EM DIA":
        return "✅";
      case "ATRASADO":
        return "⚠️";
      default:
        return "⏳";
    }
  }

  const emprestimosFiltrados = emprestimos.filter((emp) => {
    const status = getStatus(emp);
    if (filtro === "TODOS") return true;
    return status === filtro;
  });

  if (loading) {
    return <SkeletonLista itens={5} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Empréstimos</h1>
          <p className="text-muted-foreground text-sm">Gerencie todos os empréstimos registrados</p>
        </div>

        <button
          onClick={() => navigate("/emprestimos/novo")}
          className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/25"
        >
          <Plus size={18} />
          Novo Empréstimo
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Filter size={18} className="text-muted-foreground mr-1" />
        {["TODOS", "EM DIA", "ATRASADO", "EM ABERTO"].map((opcao) => (
          <button
            key={opcao}
            onClick={() => setFiltro(opcao as typeof filtro)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filtro === opcao
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {opcao === "TODOS" ? "Todos" : opcao}
          </button>
        ))}
      </div>

      {/* ERRO */}
      {erro && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400 mb-6">
          {erro}
        </div>
      )}

      {/* TABLE */}
      {!loading && emprestimosFiltrados.length > 0 && (
        <div className="card overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Valor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Parcelas</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Parcela</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody>
                {emprestimosFiltrados.map((emp) => {
                  const status = getStatus(emp);

                  return (
                    <tr
                      key={emp.id_emprestimo}
                      className="table-row cursor-pointer hover:bg-accent/50"
                      onClick={() => navigate(`/emprestimos/${emp.id_emprestimo}`)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                            {getNomeCliente(emp.id_cliente).charAt(0)}
                          </div>
                          <p className="font-medium text-foreground">
                            {getNomeCliente(emp.id_cliente)}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-foreground">
                        R$ {Number(emp.valor_emprestimo).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        {emp.num_parcelas}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                        R$ {Number(emp.valor_parcela).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(status)}`}>
                          {getStatusIcon(status)} {status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/emprestimos/${emp.id_emprestimo}`);
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                            title="Ver"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/editar-emprestimo/${emp.id_emprestimo}`);
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all"
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExcluir(emp.id_emprestimo!);
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                            title="Excluir"
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

      {/* EMPTY STATE */}
      {!loading && emprestimosFiltrados.length === 0 && (
        <div className="card p-12 text-center">
          <CreditCard size={48} className="mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum empréstimo encontrado</h3>
          <p className="text-muted-foreground text-sm mb-4">
            {filtro !== "TODOS"
              ? `Nenhum empréstimo com status "${filtro}" encontrado.`
              : "Comece cadastrando seu primeiro empréstimo."}
          </p>
          <button
            onClick={() => navigate("/emprestimos/novo")}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all"
          >
            <Plus size={18} />
            Novo Empréstimo
          </button>
        </div>
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