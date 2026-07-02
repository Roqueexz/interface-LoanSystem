import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  CreditCard,
  Search,
  X,
  ChevronRight,
  CalendarDays,
  TrendingUp,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Clock3,
} from "lucide-react";

import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import ClienteRequests from "../../../fetch/ClienteRequests";

import type EmprestimoDTO from "../../../interface/EmprestimoDTO";
import type ClienteDTO from "../../../interface/ClienteDTO";

// ─── Tipos auxiliares ──────────────────────────────────────────────────────────
type StatusParcela = "Pago" | "Atrasado" | "Pendente";

interface Parcela {
  numero: number;
  total: number;
  vencimento: Date;
  status: StatusParcela;
}

// ─── Lógica de geração de parcelas ────────────────────────────────────────────
function gerarParcelas(emprestimo: EmprestimoDTO): Parcela[] {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const inicio = new Date(emprestimo.data_emprestimo);
  const parcelas: Parcela[] = [];

  for (let i = 0; i < emprestimo.num_parcelas; i++) {
    const vencimento = new Date(inicio);
    vencimento.setMonth(vencimento.getMonth() + i + 1);

    let status: StatusParcela;
    if (vencimento < hoje) {
      // Empréstimo liquidado → todas pagas; ativo → atrasado
      status = !emprestimo.status_emprestimo ? "Pago" : "Atrasado";
    } else {
      status = "Pendente";
    }

    parcelas.push({
      numero: i + 1,
      total: emprestimo.valor_parcela,
      vencimento,
      status,
    });
  }

  return parcelas;
}

// ─── Badge de status da parcela ───────────────────────────────────────────────
function BadgeStatus({ status }: { status: StatusParcela }) {
  if (status === "Pago")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
        <CheckCircle2 size={11} />
        Pago
      </span>
    );
  if (status === "Atrasado")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
        <AlertCircle size={11} />
        Atrasado
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-600">
      <Clock3 size={11} />
      Pendente
    </span>
  );
}

// ─── Modal de especificações do empréstimo ────────────────────────────────────
function ModalEspecificacoes({
  emprestimo,
  nomeCliente,
  onClose,
}: {
  emprestimo: EmprestimoDTO;
  nomeCliente: string;
  onClose: () => void;
}) {
  const parcelas = gerarParcelas(emprestimo);

  const formatarMoeda = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatarData = (d: Date) =>
    new Date(d).toLocaleDateString("pt-BR");

  const totalPago = parcelas.filter((p) => p.status === "Pago").reduce((s, p) => s + p.total, 0);
  const totalAtrasado = parcelas.filter((p) => p.status === "Atrasado").reduce((s, p) => s + p.total, 0);
  const totalPendente = parcelas.filter((p) => p.status === "Pendente").reduce((s, p) => s + p.total, 0);

  const pagas = parcelas.filter((p) => p.status === "Pago").length;
  const atrasadas = parcelas.filter((p) => p.status === "Atrasado").length;
  const pendentes = parcelas.filter((p) => p.status === "Pendente").length;
  const progresso = Math.round((pagas / parcelas.length) * 100);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(ev) => { if (ev.target === ev.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* ── Cabeçalho ── */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-t-2xl p-6 text-white flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-indigo-200 text-xs font-medium uppercase tracking-wider mb-1">
                Empréstimo #{emprestimo.id_emprestimo}
              </p>
              <h2 className="text-xl font-bold">{nomeCliente}</h2>
              <p className="text-indigo-200 text-sm mt-0.5">
                {formatarMoeda(emprestimo.valor_emprestimo)} · {emprestimo.num_parcelas}x de {formatarMoeda(emprestimo.valor_parcela)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-indigo-500/50 transition-colors flex-shrink-0"
              aria-label="Fechar modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Barra de progresso */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-indigo-200 mb-1.5">
              <span>{pagas} de {parcelas.length} parcelas pagas</span>
              <span>{progresso}%</span>
            </div>
            <div className="w-full h-2 bg-indigo-500/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Resumo de cards ── */}
        <div className="grid grid-cols-3 gap-3 p-4 border-b border-slate-100 flex-shrink-0">
          <div className="bg-emerald-50 rounded-xl p-3 text-center">
            <p className="text-emerald-700 text-xs font-medium mb-0.5">Pago</p>
            <p className="text-emerald-800 font-bold text-sm">{pagas}x</p>
            <p className="text-emerald-600 text-xs mt-0.5">{formatarMoeda(totalPago)}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3 text-center">
            <p className="text-red-600 text-xs font-medium mb-0.5">Atrasado</p>
            <p className="text-red-700 font-bold text-sm">{atrasadas}x</p>
            <p className="text-red-500 text-xs mt-0.5">{formatarMoeda(totalAtrasado)}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <p className="text-amber-600 text-xs font-medium mb-0.5">Pendente</p>
            <p className="text-amber-700 font-bold text-sm">{pendentes}x</p>
            <p className="text-amber-500 text-xs mt-0.5">{formatarMoeda(totalPendente)}</p>
          </div>
        </div>

        {/* ── Infos do empréstimo ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 py-3 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-indigo-400 flex-shrink-0" />
            <div>
              <p className="text-slate-400 text-xs">Juros</p>
              <p className="text-slate-700 text-sm font-semibold">{emprestimo.juros}% ({emprestimo.tipo_juros})</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Banknote size={14} className="text-indigo-400 flex-shrink-0" />
            <div>
              <p className="text-slate-400 text-xs">Valor total</p>
              <p className="text-slate-700 text-sm font-semibold">{formatarMoeda(emprestimo.valor_emprestimo)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={14} className="text-indigo-400 flex-shrink-0" />
            <div>
              <p className="text-slate-400 text-xs">Início</p>
              <p className="text-slate-700 text-sm font-semibold">{formatarData(emprestimo.data_emprestimo)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={14} className="text-indigo-400 flex-shrink-0" />
            <div>
              <p className="text-slate-400 text-xs">Devolução</p>
              <p className="text-slate-700 text-sm font-semibold">
                {emprestimo.data_devolucao ? formatarData(emprestimo.data_devolucao) : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* ── Lista de parcelas ── */}
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
              <tr className="text-slate-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-semibold">Parcela</th>
                <th className="text-left px-5 py-3 font-semibold">Vencimento</th>
                <th className="text-right px-5 py-3 font-semibold">Valor</th>
                <th className="text-center px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {parcelas.map((p) => (
                <tr
                  key={p.numero}
                  className={`border-b border-slate-50 transition-colors ${
                    p.status === "Atrasado"
                      ? "bg-red-50/50 hover:bg-red-50"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-5 py-3 font-medium text-slate-700">
                    <span className="inline-flex items-center gap-1.5">
                      <ChevronRight size={13} className="text-slate-300" />
                      {p.numero}ª de {parcelas.length}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{formatarData(p.vencimento)}</td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-700">
                    {formatarMoeda(p.total)}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <BadgeStatus status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Rodapé ── */}
        <div className="px-5 py-4 bg-slate-50 rounded-b-2xl border-t border-slate-100 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
function ListagemEmprestimo() {
  const navigate = useNavigate();

  const [emprestimos, setEmprestimos] = useState<EmprestimoDTO[]>([]);
  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [busca, setBusca] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [modalEmprestimo, setModalEmprestimo] = useState<EmprestimoDTO | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const listaEmprestimos = await EmprestimoRequests.obterListaDeEmprestimos();
    const listaClientes = await ClienteRequests.obterListaDeClientes();

    if (listaEmprestimos) setEmprestimos(listaEmprestimos);
    if (listaClientes) setClientes(listaClientes);
  };

  const getCliente = (id_cliente: number) =>
    clientes.find((c) => c.id_cliente === id_cliente);

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
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="p-4 sm:p-8">
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
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente ou ID..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Listagem */}
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
                    const nomeCliente = cliente
                      ? `${cliente.nome_cliente} ${cliente.sobrenome_cliente}`
                      : "Cliente não encontrado";

                    return (
                      <tr
                        key={e.id_emprestimo}
                        className="border-t border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 text-slate-500">#{e.id_emprestimo}</td>
                        <td className="px-5 py-4 font-medium text-slate-700">{nomeCliente}</td>

                        {/* ── Célula de valor clicável ── */}
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setModalEmprestimo(e)}
                            className="group text-left"
                            title="Ver especificações das parcelas"
                          >
                            <p className="font-semibold text-indigo-600 group-hover:text-indigo-800 group-hover:underline transition-colors">
                              {formatarMoeda(e.valor_emprestimo)}
                            </p>
                            <p className="text-xs text-slate-400 group-hover:text-slate-500 transition-colors flex items-center gap-0.5 mt-0.5">
                              {formatarMoeda(e.valor_parcela)} /parcela
                              <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </p>
                          </button>
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

      {/* ── Modal de Especificações das Parcelas ── */}
      {modalEmprestimo && (
        <ModalEspecificacoes
          emprestimo={modalEmprestimo}
          nomeCliente={(() => {
            const c = getCliente(modalEmprestimo.id_cliente);
            return c ? `${c.nome_cliente} ${c.sobrenome_cliente}` : "Cliente não encontrado";
          })()}
          onClose={() => setModalEmprestimo(null)}
        />
      )}

      {/* ── Modal de Exclusão ── */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
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