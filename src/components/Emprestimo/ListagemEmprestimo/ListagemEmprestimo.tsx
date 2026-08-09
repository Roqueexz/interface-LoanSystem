import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  CreditCard,
  Search,
  Zap,
  MessageCircle,
  Eye,
  Edit2,
  Trash2,
  History,
  CheckCircle2,
  Briefcase,
} from "lucide-react";

import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import ClienteRequests from "../../../fetch/ClienteRequests";
import ParcelaRequests from "../../../fetch/ParcelaRequests";

import type EmprestimoDTO from "../../../interface/EmprestimoDTO";
import type ClienteDTO from "../../../interface/ClienteDTO";
import type ParcelaDTO from "../../../interface/ParcelaDTO";

import { useToast } from "../../../hooks/useToast";
import ModalConfirmacao from "../../../ui/Modal/ModalConfirmacao";
import { SkeletonLista } from "../../../ui/Skeleton";
import Avatar from "../../shared/Avatar/Avatar";
import StatusBadge from "../../shared/StatusBadge/StatusBadge";
import ModalBaixaRapida from "./ModalBaixaRapida";
import { gerarLinkCobrancaWhatsapp } from "../../../utils/whatsapp";

interface EmprestimoComDetalhes extends EmprestimoDTO {
  clienteObj?: ClienteDTO;
  parcelas?: ParcelaDTO[];
  parcelasPagasCount?: number;
  proximaParcela?: ParcelaDTO;
}

function ListagemEmprestimo() {
  const navigate = useNavigate();
  const toast = useToast();

  const [abaAtiva, setAbaAtiva] = useState<"ATIVOS" | "HISTORICO">("ATIVOS");

  const [emprestimos, setEmprestimos] = useState<EmprestimoComDetalhes[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");

  const [filtroStatus, setFiltroStatus] = useState<
    "TODOS" | "EM DIA" | "ATRASADO" | "EM ABERTO"
  >("TODOS");

  // Modal Baixa Rápida
  const [baixaModalOpen, setBaixaModalOpen] = useState(false);
  const [selectedEmprestimoBaixa, setSelectedEmprestimoBaixa] = useState<{
    id: number;
    nomeCliente: string;
    numParcelas: number;
  } | null>(null);

  // Modal Exclusão
  const [emprestimoParaExcluir, setEmprestimoParaExcluir] = useState<number | null>(null);
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);

  async function carregarDados() {
    setLoading(true);
    setErro("");

    try {
      // Busca todos os empréstimos (status=todos para termos ativos e liquidados)
      const [emprestimosData, clientesData] = await Promise.all([
        EmprestimoRequests.obterListaDeEmprestimos(),
        ClienteRequests.obterListaDeClientes(),
      ]);

      const clientesMap = new Map<number, ClienteDTO>();
      if (clientesData) {
        clientesData.forEach((c) => {
          if (c.id_cliente) clientesMap.set(c.id_cliente, c);
        });
      }

      if (emprestimosData) {
        // Busca parcelas de cada empréstimo para calcular progresso exato
        const listaComDetalhes = await Promise.all(
          emprestimosData.map(async (emp) => {
            const clienteObj = emp.id_cliente ? clientesMap.get(emp.id_cliente) : undefined;
            
            let parcelas: ParcelaDTO[] = [];
            if (emp.id_emprestimo) {
              const resP = await ParcelaRequests.listarPorEmprestimo(emp.id_emprestimo);
              if (resP) parcelas = resP;
            }

            const parcelasPagasCount = parcelas.filter((p) => p.status_parcela === "PAGA").length;
            const proximaParcela = parcelas.find((p) => p.status_parcela !== "PAGA");

            return {
              ...emp,
              clienteObj,
              parcelas,
              parcelasPagasCount,
              proximaParcela,
            };
          })
        );

        setEmprestimos(listaComDetalhes);
      } else {
        setErro("Erro ao carregar empréstimos.");
      }
    } catch (err) {
      console.error(err);
      setErro("Falha ao comunicar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function isEmprestimoQuitado(emp: EmprestimoComDetalhes) {
    if (emp.status_emprestimo === false) return true;
    const pagas = emp.parcelasPagasCount || 0;
    return emp.num_parcelas > 0 && pagas >= emp.num_parcelas;
  }

  function getStatus(emp: EmprestimoComDetalhes) {
    if (isEmprestimoQuitado(emp)) return "EM ABERTO"; // Ou Quitado

    // Se possui parcela atrasada
    const possuiAtraso = emp.parcelas?.some((p) => p.status_parcela === "ATRASADA");
    if (possuiAtraso) return "ATRASADO";

    if (emp.data_devolucao) {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const dev = new Date(emp.data_devolucao);
      if (dev < hoje && (emp.parcelasPagasCount || 0) < emp.num_parcelas) {
        return "ATRASADO";
      }
    }

    return "EM DIA";
  }

  function handleExcluir(e: React.MouseEvent, id: number) {
    e.stopPropagation();
    setEmprestimoParaExcluir(id);
    setModalConfirmOpen(true);
  }

  async function confirmarExclusao() {
    if (!emprestimoParaExcluir) return;

    const sucesso = await toast.promise(
      EmprestimoRequests.excluirEmprestimo(emprestimoParaExcluir),
      {
        loading: "Excluindo empréstimo...",
        success: "✅ Empréstimo removido com sucesso!",
        error: (err) => err?.message ? `❌ ${err.message}` : "❌ Erro ao remover empréstimo.",
      }
    );

    if (sucesso) {
      setEmprestimos((prev) => prev.filter((e) => e.id_emprestimo !== emprestimoParaExcluir));
    }

    setEmprestimoParaExcluir(null);
    setModalConfirmOpen(false);
  }

  function handleOpenBaixaRapida(e: React.MouseEvent, emp: EmprestimoComDetalhes) {
    e.stopPropagation();
    if (!emp.id_emprestimo) return;
    const nomeCliente = getNomeCliente(emp);
    setSelectedEmprestimoBaixa({
      id: emp.id_emprestimo,
      nomeCliente,
      numParcelas: emp.num_parcelas,
    });
    setBaixaModalOpen(true);
  }

  function handleAbrirWhatsapp(e: React.MouseEvent, emp: EmprestimoComDetalhes) {
    e.stopPropagation();
    const nomeCliente = getNomeCliente(emp);
    const telefone = emp.clienteObj?.telefone;
    const prox = emp.proximaParcela;

    const url = gerarLinkCobrancaWhatsapp({
      nomeCliente,
      telefone,
      valorParcela: prox?.valor_parcela || emp.valor_parcela,
      dataVencimento: prox?.data_vencimento || emp.data_devolucao?.toString(),
      numeroParcela: prox?.numero_parcela,
      totalParcelas: emp.num_parcelas,
      idEmprestimo: emp.id_emprestimo,
    });

    window.open(url, "_blank");
  }

  function getNomeCliente(emp: EmprestimoComDetalhes) {
    if (emp.clienteObj) {
      return `${emp.clienteObj.nome_cliente} ${emp.clienteObj.sobrenome_cliente}`;
    }
    if (emp.nome_cliente) {
      return `${emp.nome_cliente} ${emp.sobrenome_cliente || ""}`.trim();
    }
    return `Cliente #${emp.id_cliente}`;
  }

  // Filtragem por Aba (Ativos vs Histórico de Liquidados)
  const emprestimosPorAba = emprestimos.filter((emp) => {
    const quitado = isEmprestimoQuitado(emp);
    if (abaAtiva === "ATIVOS") return !quitado;
    return quitado;
  });

  const statusCounts = {
    "EM DIA": emprestimosPorAba.filter((e) => getStatus(e) === "EM DIA").length,
    "EM ABERTO": emprestimosPorAba.filter((e) => getStatus(e) === "EM ABERTO").length,
    ATRASADO: emprestimosPorAba.filter((e) => getStatus(e) === "ATRASADO").length,
  };

  const emprestimosFiltrados = emprestimosPorAba.filter((emp) => {
    const status = getStatus(emp);
    const atendeFiltroStatus = filtroStatus === "TODOS" || status === filtroStatus;

    if (!atendeFiltroStatus) return false;

    if (!busca.trim()) return true;
    const nome = getNomeCliente(emp).toLowerCase();
    const termo = busca.toLowerCase();
    return nome.includes(termo) || emp.id_emprestimo?.toString().includes(termo);
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <SkeletonLista itens={4} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Empréstimos
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {emprestimos.length} contratos no sistema • 1 toque para gerenciar
          </p>
        </div>

        <button
          onClick={() => navigate("/emprestimos/novo")}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-all active:scale-95 hover:opacity-95"
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)" }}
        >
          <Plus size={18} />
          <span>Novo Empréstimo</span>
        </button>
      </div>

      {/* TOP NAVIGATION TABS (ATIVOS VS HISTÓRICO DE LIQUIDADOS) */}
      <div className="flex border-b border-border bg-card p-1.5 rounded-2xl gap-2 shadow-sm">
        <button
          onClick={() => setAbaAtiva("ATIVOS")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            abaAtiva === "ATIVOS"
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Briefcase size={16} />
          <span>Empréstimos Ativos</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-card/20 border border-current">
            {emprestimos.filter((e) => !isEmprestimoQuitado(e)).length}
          </span>
        </button>

        <button
          onClick={() => setAbaAtiva("HISTORICO")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            abaAtiva === "HISTORICO"
              ? "bg-emerald-600 text-white shadow-md"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <History size={16} />
          <span>Histórico (Liquidados)</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-white/20 border border-current">
            {emprestimos.filter((e) => isEmprestimoQuitado(e)).length}
          </span>
        </button>
      </div>

      {/* STATUS CHIPS SUMMARY (SE FOR NA ABA ATIVOS) */}
      {abaAtiva === "ATIVOS" && (
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          {[
            { key: "EM DIA", label: "Em Dia", count: statusCounts["EM DIA"], color: "emerald" },
            { key: "EM ABERTO", label: "Em Aberto", count: statusCounts["EM ABERTO"], color: "amber" },
            { key: "ATRASADO", label: "Atrasados", count: statusCounts["ATRASADO"], color: "red" },
          ].map((item) => {
            const isSelected = filtroStatus === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setFiltroStatus(isSelected ? "TODOS" : (item.key as typeof filtroStatus))}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all ${
                  item.color === "emerald"
                    ? "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-700 dark:text-emerald-400"
                    : item.color === "amber"
                    ? "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40 text-amber-700 dark:text-amber-400"
                    : "bg-red-500/5 border-red-500/20 hover:border-red-500/40 text-red-700 dark:text-red-400"
                } ${isSelected ? "ring-2 ring-primary shadow-sm scale-[1.02]" : ""}`}
              >
                <p className="text-xl sm:text-2xl font-black">{item.count}</p>
                <p className="text-xs font-bold mt-0.5 opacity-90">{item.label}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={
              abaAtiva === "ATIVOS"
                ? "Buscar por cliente ou código nos ativos..."
                : "Buscar no histórico de empréstimos quitados..."
            }
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        {abaAtiva === "ATIVOS" && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {["TODOS", "EM DIA", "EM ABERTO", "ATRASADO"].map((f) => (
              <button
                key={f}
                onClick={() => setFiltroStatus(f as typeof filtroStatus)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  filtroStatus === f
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {f === "TODOS" ? "Todos" : f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ERRO */}
      {erro && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-4 text-red-600 dark:text-red-400 text-sm">
          {erro}
        </div>
      )}

      {/* CARDS LISTING (CLICK ON ENTIRE CARD TO SEE DETAILS) */}
      {!loading && emprestimosFiltrados.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emprestimosFiltrados.map((emp) => {
            const quitado = isEmprestimoQuitado(emp);
            const status = getStatus(emp);
            const nomeCliente = getNomeCliente(emp);
            const iniciais = nomeCliente
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2);

            const totalParcelasContrato = emp.num_parcelas || 1;
            const pagas = emp.parcelasPagasCount || 0;
            const pct = Math.min(Math.round((pagas / totalParcelasContrato) * 100), 100);

            return (
              <div
                key={emp.id_emprestimo}
                onClick={() => navigate(`/emprestimos/${emp.id_emprestimo}`)}
                className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between space-y-4 cursor-pointer group relative"
              >
                {/* Top Card Info */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={iniciais} size="md" />
                      <div>
                        <h3 className="font-bold text-foreground text-base leading-tight group-hover:text-primary transition-colors">
                          {nomeCliente}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Empréstimo #{emp.id_emprestimo}
                        </p>
                      </div>
                    </div>
                    {quitado ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 size={12} /> QUITADO
                      </span>
                    ) : (
                      <StatusBadge status={status} />
                    )}
                  </div>

                  {/* Finance Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-xl my-3">
                    <div>
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        Valor Emprestado
                      </span>
                      <span className="text-base font-extrabold text-foreground">
                        R$ {Number(emp.valor_emprestimo).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        Valor Parcela
                      </span>
                      <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                        R$ {Number(emp.valor_parcela || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar Sincronizada */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="text-foreground">
                        {pagas} de {totalParcelasContrato} parcelas ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          pct === 100 || quitado ? "bg-emerald-500" : "bg-primary"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 1-TOUCH QUICK ACTIONS BAR (STOP PROPAGATION) */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-1.5">
                  {!quitado && (
                    <>
                      {/* Baixa Rápida */}
                      <button
                        onClick={(e) => handleOpenBaixaRapida(e, emp)}
                        title="Registrar Pagamento de Parcela"
                        className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <Zap size={14} className="fill-emerald-500" />
                        <span>Baixa</span>
                      </button>

                      {/* Cobrar WhatsApp */}
                      <button
                        onClick={(e) => handleAbrirWhatsapp(e, emp)}
                        title="Cobrar via WhatsApp"
                        className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <MessageCircle size={14} />
                        <span>Cobrar</span>
                      </button>
                    </>
                  )}

                  {/* Ver Parcelas / Detalhes (Mantendo o olho) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/emprestimos/${emp.id_emprestimo}`);
                    }}
                    title="Ver Detalhes do Empréstimo"
                    className="py-2 px-3 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-95"
                  >
                    <Eye size={14} />
                    {quitado && <span>Ver</span>}
                  </button>

                  {/* Editar */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/editar-emprestimo/${emp.id_emprestimo}`);
                    }}
                    title="Editar Empréstimo"
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  >
                    <Edit2 size={14} />
                  </button>

                  {/* Excluir */}
                  <button
                    onClick={(e) => handleExcluir(e, emp.id_emprestimo!)}
                    title="Excluir Empréstimo"
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
      {!loading && emprestimosFiltrados.length === 0 && (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            {abaAtiva === "HISTORICO" ? <History size={32} /> : <CreditCard size={32} />}
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg">
              {abaAtiva === "HISTORICO"
                ? "Nenhum empréstimo liquidado no histórico"
                : "Nenhum empréstimo ativo encontrado"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              {busca
                ? `Nenhum resultado para "${busca}".`
                : abaAtiva === "HISTORICO"
                ? "Quando um empréstimo tiver todas as parcelas quitadas, ele aparecerá automaticamente aqui neste histórico."
                : "Cadastre o primeiro empréstimo para começar a gerenciar sua carteira."}
            </p>
          </div>
          {abaAtiva === "ATIVOS" && (
            <button
              onClick={() => navigate("/emprestimos/novo")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md hover:opacity-90 transition-all"
              style={{ background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)" }}
            >
              <Plus size={16} /> Novo Empréstimo
            </button>
          )}
        </div>
      )}

      {/* Modal Baixa Rápida */}
      {selectedEmprestimoBaixa && (
        <ModalBaixaRapida
          isOpen={baixaModalOpen}
          onClose={() => {
            setBaixaModalOpen(false);
            setSelectedEmprestimoBaixa(null);
          }}
          onSuccess={carregarDados}
          idEmprestimo={selectedEmprestimoBaixa.id}
          nomeCliente={selectedEmprestimoBaixa.nomeCliente}
          numParcelasContrato={selectedEmprestimoBaixa.numParcelas}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
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