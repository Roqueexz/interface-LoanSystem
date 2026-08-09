import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Users,
  Search,
  MessageCircle,
  Eye,
  Edit2,
  Trash2,
  Phone,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
} from "lucide-react";

import ClienteRequests from "../../../fetch/ClienteRequests";
import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import ParcelaRequests from "../../../fetch/ParcelaRequests";
import type ClienteDTO from "../../../interface/ClienteDTO";
import type EmprestimoDTO from "../../../interface/EmprestimoDTO";
import { useToast } from "../../../hooks/useToast";
import ModalConfirmacao from "../../../ui/Modal/ModalConfirmacao";
import { SkeletonLista } from "../../../ui/Skeleton";
import Avatar from "../../shared/Avatar/Avatar";
import StatusBadge from "../../shared/StatusBadge/StatusBadge";

interface ClienteComDetalhes extends ClienteDTO {
  emprestimos?: EmprestimoDTO[];
  hasAtraso?: boolean;
  hasEmprestimoAtivo?: boolean;
  totalValorAberto?: number;
}

function ListagemCliente() {
  const navigate = useNavigate();
  const toast = useToast();

  const [clientes, setClientes] = useState<ClienteComDetalhes[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "TODOS" | "ADIMPLENTE" | "INADIMPLENTE" | "SEM CONTRATO"
  >("TODOS");

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [clienteParaExcluir, setClienteParaExcluir] = useState<number | null>(null);
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);

  async function carregarClientes() {
    setLoading(true);
    setErro("");

    try {
      const [clientesData, emprestimosData] = await Promise.all([
        ClienteRequests.obterListaDeClientes(),
        EmprestimoRequests.obterListaDeEmprestimos(),
      ]);

      if (!clientesData) {
        setErro("Erro ao carregar clientes.");
        setLoading(false);
        return;
      }

      const empMap = new Map<number, EmprestimoDTO[]>();
      if (emprestimosData) {
        emprestimosData.forEach((emp) => {
          if (emp.id_cliente) {
            const list = empMap.get(emp.id_cliente) || [];
            list.push(emp);
            empMap.set(emp.id_cliente, list);
          }
        });
      }

      // Busca parcelas de empréstimos ativos para saber se há parcelas atrasadas por cliente
      const listaComDetalhes = await Promise.all(
        clientesData.map(async (c) => {
          const clientEmps = c.id_cliente ? empMap.get(c.id_cliente) || [] : [];
          const ativos = clientEmps.filter((e) => e.status_emprestimo !== false);

          let hasAtraso = false;
          let totalValorAberto = 0;

          await Promise.all(
            ativos.map(async (emp) => {
              if (emp.id_emprestimo) {
                const parcelas = await ParcelaRequests.listarPorEmprestimo(emp.id_emprestimo);
                if (parcelas) {
                  const comAtraso = parcelas.some((p) => p.status_parcela === "ATRASADA");
                  if (comAtraso) hasAtraso = true;

                  const pendentes = parcelas.filter((p) => p.status_parcela !== "PAGA");
                  totalValorAberto += pendentes.reduce((acc, p) => acc + Number(p.valor_parcela || 0), 0);
                }
              }
            })
          );

          return {
            ...c,
            emprestimos: clientEmps,
            hasEmprestimoAtivo: ativos.length > 0,
            hasAtraso,
            totalValorAberto,
          };
        })
      );

      setClientes(listaComDetalhes);
    } catch (err) {
      console.error(err);
      setErro("Falha ao comunicar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  function handleExcluir(e: React.MouseEvent, id: number) {
    e.stopPropagation();
    setClienteParaExcluir(id);
    setModalConfirmOpen(true);
  }

  async function confirmarExclusao() {
    if (!clienteParaExcluir) return;

    const sucesso = await toast.promise(
      ClienteRequests.excluirCliente(clienteParaExcluir),
      {
        loading: "Excluindo cliente...",
        success: "✅ Cliente removido com sucesso!",
        error: (err) => err?.message ? `❌ ${err.message}` : "❌ Erro ao remover cliente.",
      }
    );

    if (sucesso) {
      setClientes((prev) => prev.filter((c) => c.id_cliente !== clienteParaExcluir));
    }

    setClienteParaExcluir(null);
    setModalConfirmOpen(false);
  }

  function getStatusAdimplencia(c: ClienteComDetalhes) {
    if (!c.hasEmprestimoAtivo) return "SEM CONTRATO";
    if (c.hasAtraso) return "INADIMPLENTE";
    return "ADIMPLENTE";
  }

  const counts = {
    ADIMPLENTE: clientes.filter((c) => getStatusAdimplencia(c) === "ADIMPLENTE").length,
    INADIMPLENTE: clientes.filter((c) => getStatusAdimplencia(c) === "INADIMPLENTE").length,
    "SEM CONTRATO": clientes.filter((c) => getStatusAdimplencia(c) === "SEM CONTRATO").length,
  };

  const filtered = clientes.filter((c) => {
    const status = getStatusAdimplencia(c);
    const matchStatus = statusFilter === "TODOS" || status === statusFilter;

    if (!matchStatus) return false;

    if (!search.trim()) return true;
    const termo = search.toLowerCase();
    const nomeComp = `${c.nome_cliente} ${c.sobrenome_cliente}`.toLowerCase();
    const tel = (c.telefone || "").toLowerCase();
    const cid = (c.cidade || "").toLowerCase();
    const est = (c.estado || "").toLowerCase();

    return nomeComp.includes(termo) || tel.includes(termo) || cid.includes(termo) || est.includes(termo);
  });

  function handleAbrirWhatsapp(e: React.MouseEvent, c: ClienteComDetalhes) {
    e.stopPropagation();
    if (!c.telefone) return;
    const telClean = c.telefone.replace(/\D/g, "");
    window.open(`https://wa.me/55${telClean}`, "_blank");
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <SkeletonLista itens={5} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Clientes</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {clientes.length} contatos · {counts.INADIMPLENTE} com pendências em atraso
          </p>
        </div>
        <button
          onClick={() => navigate("/clientes/novo")}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-all active:scale-95 hover:opacity-95"
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)" }}
        >
          <Plus size={18} />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* STATUS COUNTERS SUMMARY CHIPS */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {[
          { key: "ADIMPLENTE", label: "Adimplentes", count: counts.ADIMPLENTE, color: "emerald", icon: CheckCircle2 },
          { key: "INADIMPLENTE", label: "Inadimplentes", count: counts.INADIMPLENTE, color: "red", icon: AlertTriangle },
          { key: "SEM CONTRATO", label: "Sem Contrato", count: counts["SEM CONTRATO"], color: "slate", icon: Users },
        ].map(({ key, label, count, color }) => {
          const isSelected = statusFilter === key;
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(isSelected ? "TODOS" : (key as typeof statusFilter))}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all ${
                color === "emerald"
                  ? "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-700 dark:text-emerald-400"
                  : color === "red"
                  ? "bg-red-500/5 border-red-500/20 hover:border-red-500/40 text-red-700 dark:text-red-400"
                  : "bg-slate-500/5 border-slate-500/20 hover:border-slate-500/40 text-slate-700 dark:text-slate-400"
              } ${isSelected ? "ring-2 ring-primary shadow-sm scale-[1.02]" : ""}`}
            >
              <p className="text-xl sm:text-2xl font-black">{count}</p>
              <p className="text-xs font-bold mt-0.5 opacity-90">{label}</p>
            </button>
          );
        })}
      </div>

      {/* SEARCH AND FILTER CHIPS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, telefone, cidade ou UF..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(["TODOS", "ADIMPLENTE", "INADIMPLENTE", "SEM CONTRATO"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === f
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {f === "TODOS" ? "Todos" : f}
            </button>
          ))}
        </div>
      </div>

      {/* ERRO */}
      {erro && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-4 text-red-600 dark:text-red-400 text-sm">
          {erro}
        </div>
      )}

      {/* MOBILE-FIRST CLIENT CONTACT CARDS GRID */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cliente) => {
            const status = getStatusAdimplencia(cliente);
            const nomeComp = `${cliente.nome_cliente} ${cliente.sobrenome_cliente}`;
            const iniciais = `${cliente.nome_cliente?.[0] || ""}${cliente.sobrenome_cliente?.[0] || ""}`;
            const totalEmprestimos = cliente.emprestimos?.length || 0;

            return (
              <div
                key={cliente.id_cliente}
                onClick={() => navigate(`/clientes/${cliente.id_cliente!}`)}
                className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
              >
                {/* Contact Card Header */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={iniciais} size="md" />
                      <div>
                        <h3 className="font-bold text-foreground text-base leading-tight group-hover:text-primary transition-colors">
                          {nomeComp}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          #{cliente.id_cliente} · {totalEmprestimos} contrato(s)
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={status} />
                  </div>

                  {/* Contact Info Pills */}
                  <div className="space-y-1.5 text-xs text-muted-foreground bg-muted/30 p-3 rounded-xl my-3">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-primary/70 shrink-0" />
                      <span className="font-medium text-foreground truncate">
                        {cliente.telefone || "Sem telefone cadastrado"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-primary/70 shrink-0" />
                      <span className="truncate">
                        {cliente.cidade ? `${cliente.cidade} - ${cliente.estado}` : "Localização não informada"}
                      </span>
                    </div>
                  </div>

                  {/* Financial Summary */}
                  {cliente.hasEmprestimoAtivo && (
                    <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-primary/5 border border-primary/10">
                      <span className="text-muted-foreground font-medium">Saldo Pendente:</span>
                      <span className="font-extrabold text-foreground">
                        R$ {Number(cliente.totalValorAberto || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                </div>

                {/* 1-TOUCH QUICK ACTIONS BAR */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-1.5">
                  {/* Novo Empréstimo Direto */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/emprestimos/novo?clienteId=${cliente.id_cliente}`);
                    }}
                    title="Criar novo empréstimo para este cliente"
                    className="flex-1 py-2 px-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <CreditCard size={14} />
                    <span>+ Empréstimo</span>
                  </button>

                  {/* WhatsApp Direct Link */}
                  {cliente.telefone && (
                    <button
                      onClick={(e) => handleAbrirWhatsapp(e, cliente)}
                      title="Abrir WhatsApp com cliente"
                      className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95"
                    >
                      <MessageCircle size={14} />
                    </button>
                  )}

                  {/* Ver Perfil */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/clientes/${cliente.id_cliente!}`);
                    }}
                    title="Ver perfil completo"
                    className="py-2 px-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-95"
                  >
                    <Eye size={14} />
                  </button>

                  {/* Editar */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/editar-cliente/${cliente.id_cliente!}`);
                    }}
                    title="Editar cliente"
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  >
                    <Edit2 size={14} />
                  </button>

                  {/* Excluir */}
                  <button
                    onClick={(e) => handleExcluir(e, cliente.id_cliente!)}
                    title="Excluir cliente"
                    className="p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && filtered.length === 0 && (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Users size={32} />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg">Nenhum cliente encontrado</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              {search || statusFilter !== "TODOS"
                ? `Nenhum resultado para a busca ou filtro selecionado.`
                : "Cadastre seu primeiro cliente para iniciar sua carteira de empréstimos."}
            </p>
          </div>
          <button
            onClick={() => navigate("/clientes/novo")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)" }}
          >
            <Plus size={16} /> Adicionar Cliente
          </button>
        </div>
      )}

      {/* Modal de Confirmação */}
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