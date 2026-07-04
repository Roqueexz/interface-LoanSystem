import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Banknote,
  Smartphone,
  FileText,
  CreditCard,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import type EmprestimoDTO from "../../../interface/EmprestimoDTO";
import Juros from "../../../services/Juros";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type FormState = {
  id_cliente: number;
  valor_emprestimo: number;
  num_parcelas: number;
  tipo_juros: string;
  juros: number;
  data_emprestimo: string;
  data_devolucao: string;
  status_emprestimo: boolean;
  forma_pagamento: string;
};

// ─── Opções de forma de pagamento ─────────────────────────────────────────────
const FORMAS_PAGAMENTO = [
  { value: "dinheiro", label: "Dinheiro", Icon: Banknote },
  { value: "pix", label: "Pix", Icon: Smartphone },
  { value: "boleto", label: "Boleto", Icon: FileText },
  { value: "cartao", label: "Cartão", Icon: CreditCard },
] as const;

// ─── Helper: formata Date para input[type=date] ────────────────────────────────
function toInputDate(d: Date | string | undefined): string {
  if (!d) return "";
  return new Date(d).toISOString().split("T")[0];
}

// ─── Componente ───────────────────────────────────────────────────────────────
function FormEditarEmprestimo() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<FormState>({
    id_cliente: 0,
    valor_emprestimo: 0,
    num_parcelas: 1,
    tipo_juros: "simples",
    juros: 0,
    data_emprestimo: new Date().toISOString().split("T")[0],
    data_devolucao: "",
    status_emprestimo: true,
    forma_pagamento: "",
  });

  const [valorParcela, setValorParcela] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // ── Carrega dados do empréstimo ──
  useEffect(() => {
    const carregar = async () => {
      if (!id) return;
      setCarregando(true);
      try {
        const emp = await EmprestimoRequests.obterEmprestimoPorId(Number(id));
        if (!emp) {
          setErro("Empréstimo não encontrado.");
          return;
        }
        setFormData({
          id_cliente: emp.id_cliente,
          valor_emprestimo: emp.valor_emprestimo,
          num_parcelas: emp.num_parcelas,
          tipo_juros: emp.tipo_juros,
          juros: emp.juros,
          data_emprestimo: toInputDate(emp.data_emprestimo),
          data_devolucao: toInputDate(emp.data_devolucao),
          status_emprestimo: emp.status_emprestimo ?? true,
          forma_pagamento: emp.forma_pagamento ?? "",
        });
        setValorParcela(emp.valor_parcela);
      } catch {
        setErro("Erro ao carregar empréstimo.");
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, [id]);

  // ── Recalcula parcela ao mudar valores financeiros ──
  useEffect(() => {
    if (formData.valor_emprestimo > 0 && formData.num_parcelas > 0 && formData.juros >= 0) {
      const resultado =
        formData.tipo_juros === "simples"
          ? Juros.calcularSimples(formData.valor_emprestimo, formData.juros, formData.num_parcelas)
          : Juros.calcularCompostos(formData.valor_emprestimo, formData.juros, formData.num_parcelas);
      setValorParcela(resultado.valorParcela);
    }
  }, [formData.valor_emprestimo, formData.num_parcelas, formData.tipo_juros, formData.juros]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    setSalvando(true);

    const payload: EmprestimoDTO = {
      id_cliente: formData.id_cliente,
      valor_emprestimo: formData.valor_emprestimo,
      num_parcelas: formData.num_parcelas,
      valor_parcela: valorParcela,
      tipo_juros: formData.tipo_juros,
      juros: formData.juros,
      data_emprestimo: new Date(formData.data_emprestimo),
      data_devolucao: formData.data_devolucao ? new Date(formData.data_devolucao) : undefined,
      status_emprestimo: formData.status_emprestimo,
      forma_pagamento: formData.forma_pagamento || undefined,
    };

    const ok = await EmprestimoRequests.atualizarEmprestimo(Number(id), payload);
    setSalvando(false);

    if (ok) {
      navigate("/emprestimos");
    } else {
      alert("Erro ao atualizar empréstimo. Tente novamente.");
    }
  };

  const formatarMoeda = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // ── Estados de carregamento / erro ──
  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-64 text-slate-400">
        <Loader2 className="animate-spin mr-2" size={20} />
        Carregando empréstimo...
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-3 text-red-500">
        <XCircle size={32} />
        <p className="font-semibold">{erro}</p>
        <button
          onClick={() => navigate("/emprestimos")}
          className="text-sm text-indigo-600 hover:underline"
        >
          Voltar para lista
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Cabeçalho da página */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/emprestimos")}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Editar Empréstimo</h1>
            <p className="text-slate-400 text-sm">ID #{id}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Card: Dados Financeiros ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-base font-semibold text-slate-700 mb-5 pb-3 border-b border-slate-100">
              Dados Financeiros
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">
                  ID do Cliente
                </label>
                <input
                  type="number"
                  name="id_cliente"
                  min={1}
                  required
                  value={formData.id_cliente || ""}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">
                  Valor do Empréstimo (R$)
                </label>
                <input
                  type="number"
                  name="valor_emprestimo"
                  step="0.01"
                  min={0}
                  required
                  value={formData.valor_emprestimo || ""}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">
                  Número de Parcelas
                </label>
                <input
                  type="number"
                  name="num_parcelas"
                  min={1}
                  required
                  value={formData.num_parcelas}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">
                  Tipo de Juros
                </label>
                <select
                  name="tipo_juros"
                  value={formData.tipo_juros}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="simples">Juros Simples</option>
                  <option value="compostos">Juros Compostos</option>
                </select>
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">
                  Taxa de Juros (% ao mês)
                </label>
              <input
  type="number"
  name="juros"
  step="0.01"
  min={0}
  required
  value={formData.juros ?? ""}
  onChange={handleChange}
  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
/>
              </div>

              {/* Preview do valor da parcela */}
              <div className="flex items-end">
                <div className="w-full bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5">
                  <p className="text-xs text-indigo-400 mb-0.5">Valor por parcela (calculado)</p>
                  <p className="text-lg font-bold text-indigo-700">{formatarMoeda(valorParcela)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Card: Datas ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-base font-semibold text-slate-700 mb-5 pb-3 border-b border-slate-100">
              Datas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">
                  Data do Empréstimo
                </label>
                <input
                  type="date"
                  name="data_emprestimo"
                  value={formData.data_emprestimo}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">
                  Data de Devolução <span className="text-slate-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="date"
                  name="data_devolucao"
                  value={formData.data_devolucao}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* ── Card: Forma de Pagamento ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-base font-semibold text-slate-700 mb-5 pb-3 border-b border-slate-100">
              Forma de Pagamento
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {FORMAS_PAGAMENTO.map(({ value, label, Icon }) => {
                const selecionado = formData.forma_pagamento === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        forma_pagamento: prev.forma_pagamento === value ? "" : value,
                      }))
                    }
                    className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-150 cursor-pointer ${
                      selecionado
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100"
                        : "border-slate-200 bg-slate-50 text-slate-500 hover:border-indigo-300 hover:bg-indigo-50/50"
                    }`}
                  >
                    <Icon size={22} />
                    <span className="text-xs font-semibold">{label}</span>
                  </button>
                );
              })}
            </div>
            {!formData.forma_pagamento && (
              <p className="text-xs text-slate-400 mt-3">Nenhuma forma selecionada (opcional)</p>
            )}
          </div>

          {/* ── Card: Status do Empréstimo ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-base font-semibold text-slate-700 mb-5 pb-3 border-b border-slate-100">
              Status do Empréstimo
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, status_emprestimo: true }))}
                className={`flex items-center justify-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-150 ${
                  formData.status_emprestimo
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100"
                    : "border-slate-200 bg-slate-50 text-slate-500 hover:border-emerald-300"
                }`}
              >
                <CheckCircle2 size={20} />
                <span className="text-sm font-semibold">Ativo</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, status_emprestimo: false }))}
                className={`flex items-center justify-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-150 ${
                  !formData.status_emprestimo
                    ? "border-slate-500 bg-slate-100 text-slate-700 shadow-sm"
                    : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-400"
                }`}
              >
                <XCircle size={20} />
                <span className="text-sm font-semibold">Liquidado</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              {formData.status_emprestimo
                ? "O empréstimo está ativo e aparece na listagem principal."
                : "O empréstimo está liquidado e não aparece na listagem ativa."}
            </p>
          </div>

          {/* ── Botões ── */}
          <div className="flex gap-4 pb-8">
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {salvando ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  SALVAR ALTERAÇÕES
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/emprestimos")}
              className="flex-1 flex items-center justify-center gap-2 border border-slate-300 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <ArrowLeft size={18} />
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormEditarEmprestimo;
