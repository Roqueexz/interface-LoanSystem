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
import { useToast } from "../../../hooks/useToast";
import { SkeletonDetalhes } from "../../../ui/Skeleton";

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

const FORMAS_PAGAMENTO = [
  { value: "dinheiro", label: "Dinheiro", Icon: Banknote },
  { value: "pix", label: "Pix", Icon: Smartphone },
  { value: "boleto", label: "Boleto", Icon: FileText },
  { value: "cartao", label: "Cartão", Icon: CreditCard },
] as const;

const PARCELAS_PRESETS = [1, 2, 3, 6, 10, 12];
const JUROS_PRESETS = [0, 5, 10, 15];

function toInputDate(d: Date | string | undefined): string {
  if (!d) return "";
  return new Date(d).toISOString().split("T")[0];
}

function FormEditarEmprestimo() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

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
        setValorParcela(emp.valor_parcela ?? 0);
      } catch {
        setErro("Erro ao carregar empréstimo.");
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, [id]);

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

    const ok = await toast.promise(
      EmprestimoRequests.atualizarEmprestimo(Number(id), payload),
      {
        loading: "Atualizando empréstimo...",
        success: "✅ Empréstimo atualizado com sucesso!",
        error: (err) => err?.message ? `❌ ${err.message}` : "❌ Erro ao atualizar empréstimo.",
      }
    );

    setSalvando(false);

    if (ok) {
      navigate("/emprestimos");
    }
  };

  const formatarMoeda = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (carregando) {
    return <SkeletonDetalhes />;
  }

  if (erro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-3 text-red-500">
        <XCircle size={32} />
        <p className="font-semibold text-red-600 dark:text-red-400">{erro}</p>
        <button
          onClick={() => navigate("/emprestimos")}
          className="text-sm text-primary hover:underline"
        >
          Voltar para lista
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/emprestimos")}
          className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Editar Empréstimo</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Contrato #{id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* DADOS FINANCEIROS */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-5 sm:p-6 space-y-5">
          <h2 className="text-base font-bold text-foreground pb-3 border-b border-border">
            Dados Financeiros
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                  ID do Cliente *
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  name="id_cliente"
                  min={1}
                  required
                  value={formData.id_cliente || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-base bg-input-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                  Valor do Empréstimo (R$) *
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  name="valor_emprestimo"
                  step="0.01"
                  min={0}
                  required
                  value={formData.valor_emprestimo || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-base bg-input-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                  Número de Parcelas *
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  name="num_parcelas"
                  min={1}
                  required
                  value={formData.num_parcelas}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-base bg-input-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {PARCELAS_PRESETS.map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, num_parcelas: num }))}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                        formData.num_parcelas === num
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {num}x
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                  Tipo de Juros
                </label>
                <select
                  name="tipo_juros"
                  value={formData.tipo_juros}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-base bg-input-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                >
                  <option value="simples">Juros Simples</option>
                  <option value="compostos">Juros Compostos</option>
                </select>
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                  Taxa de Juros (% ao mês) *
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  name="juros"
                  step="0.01"
                  min={0}
                  required
                  value={formData.juros ?? ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-base bg-input-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {JUROS_PRESETS.map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, juros: rate }))}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                        formData.juros === rate
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-end">
                <div className="w-full bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
                  <p className="text-xs text-muted-foreground font-semibold">Valor por parcela (calculado)</p>
                  <p className="text-xl font-extrabold text-foreground mt-0.5">{formatarMoeda(valorParcela)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DATAS */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-5 sm:p-6 space-y-5">
          <h2 className="text-base font-bold text-foreground pb-3 border-b border-border">
            Datas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                Data do Empréstimo
              </label>
              <input
                type="date"
                name="data_emprestimo"
                value={formData.data_emprestimo}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-base bg-input-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                Data de Devolução
              </label>
              <input
                type="date"
                name="data_devolucao"
                value={formData.data_devolucao}
                onChange={handleChange}
                className="w-full px-4 py-3 text-base bg-input-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>
          </div>
        </div>

        {/* FORMA DE PAGAMENTO */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-5 sm:p-6 space-y-5">
          <h2 className="text-base font-bold text-foreground pb-3 border-b border-border">
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
                  className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                    selecionado
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                      : "border-border bg-muted/40 text-muted-foreground hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <Icon size={22} />
                  <span className="text-xs font-semibold">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STATUS DO EMPRÉSTIMO */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-5 sm:p-6 space-y-5">
          <h2 className="text-base font-bold text-foreground pb-3 border-b border-border">
            Status do Empréstimo
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, status_emprestimo: true }))}
              className={`flex items-center justify-center gap-2.5 p-3.5 rounded-xl border-2 transition-all ${
                formData.status_emprestimo
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold"
                  : "border-border bg-muted/40 text-muted-foreground hover:border-emerald-300"
              }`}
            >
              <CheckCircle2 size={20} />
              <span className="text-xs font-bold">Ativo</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, status_emprestimo: false }))}
              className={`flex items-center justify-center gap-2.5 p-3.5 rounded-xl border-2 transition-all ${
                !formData.status_emprestimo
                  ? "border-slate-500 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 font-bold"
                  : "border-border bg-muted/40 text-muted-foreground hover:border-slate-400"
              }`}
            >
              <XCircle size={20} />
              <span className="text-xs font-bold">Liquidado</span>
            </button>
          </div>
        </div>

        {/* STICKY BOTTOM ACTIONS */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/emprestimos")}
            className="flex-1 py-3.5 px-4 border border-border bg-card text-foreground font-bold rounded-xl hover:bg-muted transition-all text-sm"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={salvando}
            className="flex-1 py-3.5 px-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {salvando ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Salvando...
              </>
            ) : (
              <>
                <Save size={18} /> Salvar Alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormEditarEmprestimo;