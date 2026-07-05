import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, CreditCard} from "lucide-react";

import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import ClienteRequests from "../../../fetch/ClienteRequests";

import type EmprestimoDTO from "../../../interface/EmprestimoDTO";
import type ClienteDTO from "../../../interface/ClienteDTO";
import { useToast } from "../../../hooks/useToast";
import ModalConfirmacao from "../../../ui/Modal/ModalConfirmacao";
import { SkeletonLista } from "../../../ui/Skeleton";
import Avatar from "../../shared/Avatar/Avatar";
import StatusBadge from "../../shared/StatusBadge/StatusBadge";
import ActionButtons from "../../shared/ActionButtons/ActionButtons";

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

  // Placeholder para progresso - futuramente virá do backend
  function getProgress(emp: EmprestimoDTO): number {
    return 0;
  }

  const statusCounts = {
    "EM DIA": emprestimos.filter((e) => getStatus(e) === "EM DIA").length,
    "EM ABERTO": emprestimos.filter((e) => getStatus(e) === "EM ABERTO").length,
    ATRASADO: emprestimos.filter((e) => getStatus(e) === "ATRASADO").length,
  };

  const emprestimosFiltrados = emprestimos.filter((emp) => {
    const status = getStatus(emp);
    if (filtro === "TODOS") return true;
    return status === filtro;
  });

  if (loading) {
    return <SkeletonLista itens={5} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Empréstimos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {emprestimos.length} empréstimos registrados
          </p>
        </div>

        <button
          onClick={() => navigate("/emprestimos/novo")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)" }}
        >
          <Plus size={15} />
          Novo Empréstimo
        </button>
      </div>

      {/* Status summary chips */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {Object.entries(statusCounts).map(([status, count]) => {
          const colors: Record<string, string> = {
            "EM DIA": "border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10",
            "EM ABERTO": "border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10",
            ATRASADO: "border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10",
          };
          const textColors: Record<string, string> = {
            "EM DIA": "text-emerald-700 dark:text-emerald-400",
            "EM ABERTO": "text-amber-700 dark:text-amber-400",
            ATRASADO: "text-red-700 dark:text-red-400",
          };
          return (
            <button
              key={status}
              onClick={() => setFiltro(status as typeof filtro)}
              className={`p-3.5 rounded-xl border text-left transition-all ${colors[status]} ${
                filtro === status ? "ring-2 ring-primary/40" : ""
              }`}
            >
              <p className={`text-xl font-bold ${textColors[status]}`}>{count}</p>
              <p className={`text-xs font-semibold mt-0.5 ${textColors[status]} opacity-80`}>{status}</p>
            </button>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["TODOS", "EM DIA", "EM ABERTO", "ATRASADO"].map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f as typeof filtro)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filtro === f
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "TODOS" ? "Todos" : f}
          </button>
        ))}
      </div>

      {/* ERRO */}
      {erro && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 text-red-600 dark:text-red-400 mb-6">
          {erro}
        </div>
      )}

      {/* TABLE */}
      {!loading && emprestimosFiltrados.length > 0 && (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Cliente
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                    Valor
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                    Parcelas
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                    Vl. Parcela
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
                {emprestimosFiltrados.map((emp) => {
                  const status = getStatus(emp);
                  const nomeCliente = getNomeCliente(emp.id_cliente);
                  const iniciais = nomeCliente
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2);

                  const progress = getProgress(emp);

                  return (
                    <tr
                      key={emp.id_emprestimo}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => navigate(`/emprestimos/${emp.id_emprestimo}`)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar initials={iniciais} size="sm" />
                          <p className="font-semibold text-foreground text-sm">
                            {nomeCliente}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className="text-sm font-bold text-foreground">
                          R$ {Number(emp.valor_emprestimo).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <div>
                          <p className="text-sm text-foreground font-medium">
                            {emp.num_parcelas}x
                          </p>
                          <div className="w-20 h-1.5 bg-muted rounded-full mt-1.5">
                            <div
                              className="h-full rounded-full bg-primary transition-all duration-300"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-sm text-foreground">
                          R$ {Number(emp.valor_parcela).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <ActionButtons
                          onView={() => navigate(`/emprestimos/${emp.id_emprestimo}`)}
                          onEdit={() => navigate(`/editar-emprestimo/${emp.id_emprestimo}`)}
                          onDelete={() => handleExcluir(emp.id_emprestimo!)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {emprestimosFiltrados.length > 0 && (
            <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Mostrando {emprestimosFiltrados.length} de {emprestimos.length} empréstimos
              </p>
            </div>
          )}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && emprestimosFiltrados.length === 0 && (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <CreditCard size={28} className="text-muted-foreground/50" />
          </div>
          <p className="font-semibold text-foreground mb-1">Nenhum empréstimo encontrado</p>
          <p className="text-sm text-muted-foreground mb-4">
            {filtro !== "TODOS"
              ? `Nenhum empréstimo com status "${filtro}" encontrado.`
              : "Comece cadastrando seu primeiro empréstimo."}
          </p>
          <button
            onClick={() => navigate("/emprestimos/novo")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-primary-foreground"
            style={{ background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)" }}
          >
            <Plus size={14} /> Novo Empréstimo
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