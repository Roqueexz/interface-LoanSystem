import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, Search } from "lucide-react";

import ClienteRequests from "../../../fetch/ClienteRequests";
import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import type ClienteDTO from "../../../interface/ClienteDTO";
import type EmprestimoDTO from "../../../interface/EmprestimoDTO";
import { useToast } from "../../../hooks/useToast";
import ModalConfirmacao from "../../../ui/Modal/ModalConfirmacao";
import { SkeletonLista } from "../../../ui/Skeleton";
import Avatar from "../../shared/Avatar/Avatar";
import StatusBadge from "../../shared/StatusBadge/StatusBadge";
import ActionButtons from "../../shared/ActionButtons/ActionButtons";

function ListagemCliente() {
  const navigate = useNavigate();
  const toast = useToast();

  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [emprestimos, setEmprestimos] = useState<EmprestimoDTO[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");

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
        error: (err) => {
          if (err?.message) {
            return `❌ ${err.message}`;
          }
          return '❌ Erro ao remover cliente. Tente novamente.';
        },
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
    return clienteTemDivida(id_cliente) ? "COM DIVIDA" : "SEM DIVIDA";
  }

  // Filtros
  const filtered = clientes.filter((c) => {
    const matchSearch =
      c.nome_cliente.toLowerCase().includes(search.toLowerCase()) ||
      c.cidade.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "TODOS"
        ? true
        : statusFilter === "COM DIVIDA"
        ? clienteTemDivida(c.id_cliente!)
        : !clienteTemDivida(c.id_cliente!);
    return matchSearch && matchStatus;
  });

  if (loading) {
    return <SkeletonLista itens={5} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {clientes.length} clientes cadastrados ·{" "}
            {clientes.filter((c) => clienteTemDivida(c.id_cliente!)).length} com dívida
          </p>
        </div>
        <button
          onClick={() => navigate("/clientes/novo")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)" }}
        >
          <Plus size={15} />
          Novo Cliente
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou cidade..."
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all"
          />
        </div>
        <div className="flex gap-2">
          {["TODOS", "COM DIVIDA", "SEM DIVIDA"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "TODOS" ? "Todos" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {erro && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 text-red-600 dark:text-red-400 mb-6">
          {erro}
        </div>
      )}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Cliente
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                    Telefone
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                    Cidade
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                    UF
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cliente) => {
                  const status = getClienteStatus(cliente.id_cliente!);
                  const iniciais = `${cliente.nome_cliente?.[0] || ""}${cliente.sobrenome_cliente?.[0] || ""}`;

                  return (
                    <tr
                      key={cliente.id_cliente}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => navigate(`/clientes/${cliente.id_cliente!}`)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar initials={iniciais} size="sm" />
                          <div>
                            <p className="font-semibold text-foreground text-sm leading-none mb-1">
                              {cliente.nome_cliente} {cliente.sobrenome_cliente}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {emprestimos.filter((e) => e.id_cliente === cliente.id_cliente).length} empréstimo(s)
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">{cliente.telefone}</span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-sm text-foreground">{cliente.cidade}</span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="inline-flex items-center justify-center w-8 h-6 rounded-md text-xs font-bold bg-muted text-muted-foreground">
                          {cliente.estado}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <ActionButtons
                          onView={() => navigate(`/clientes/${cliente.id_cliente!}`)}
                          onEdit={() => navigate(`/editar-cliente/${cliente.id_cliente!}`)}
                          onDelete={() => handleExcluir(cliente.id_cliente!)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Mostrando {filtered.length} de {clientes.length} clientes
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-muted-foreground/50" />
          </div>
          <p className="font-semibold text-foreground mb-1">Nenhum cliente encontrado</p>
          <p className="text-sm text-muted-foreground mb-4">
            {search || statusFilter !== "TODOS"
              ? "Ajuste a busca ou os filtros para encontrar clientes."
              : "Comece cadastrando seu primeiro cliente."}
          </p>
          <button
            onClick={() => navigate("/clientes/novo")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-primary-foreground"
            style={{ background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)" }}
          >
            <Plus size={14} /> Adicionar Cliente
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