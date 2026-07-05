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
        loading: 'Atualizando empréstimo...',
        success: '✅ Empréstimo atualizado com sucesso!',
        error: '❌ Erro ao atualizar empréstimo.',
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
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Voltar para lista
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/emprestimos")}
          className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Editar Empréstimo</h1>
          <p className="text-sm text-muted-foreground mt-0.5">ID #{id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Financeiros */}
        <div className="card shadow-sm p-6">
          <h2 className="text-base font-semibold text-foreground mb-5 pb-3 border-b border-border">
            Dados Financeiros
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-foreground">
                ID do Cliente
              </label>
              <input
                type="number"
                name="id_cliente"
                min={1}
                required
                value={formData.id_cliente || ""}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-foreground">
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
                className="input"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-foreground">
                Número de Parcelas
              </label>
              <input
                type="number"
                name="num_parcelas"
                min={1}
                required
                value={formData.num_parcelas}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-foreground">
                Tipo de Juros
              </label>
              <select
                name="tipo_juros"
                value={formData.tipo_juros}
                onChange={handleChange}
                className="input"
              >
                <option value="simples">Juros Simples</option>
                <option value="compostos">Juros Compostos</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-foreground">
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
                className="input"
              />
            </div>

            <div className="flex items-end">
              <div className="w-full bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl px-4 py-2.5">
                <p className="text-xs text-indigo-400 dark:text-indigo-400 mb-0.5">Valor por parcela (calculado)</p>
                <p className="text-lg font-bold text-indigo-700 dark:text-indigo-400">{formatarMoeda(valorParcela)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Datas */}
        <div className="card shadow-sm p-6">
          <h2 className="text-base font-semibold text-foreground mb-5 pb-3 border-b border-border">
            Datas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-foreground">
                Data do Empréstimo
              </label>
              <input
                type="date"
                name="data_emprestimo"
                value={formData.data_emprestimo}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium text-foreground">
                Data de Devolução <span className="text-muted-foreground font-normal">(opcional)</span>
              </label>
              <input
                type="date"
                name="data_devolucao"
                value={formData.data_devolucao}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Forma de Pagamento */}
        <div className="card shadow-sm p-6">
          <h2 className="text-base font-semibold text-foreground mb-5 pb-3 border-b border-border">
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
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm shadow-indigo-100 dark:shadow-indigo-900/30"
                      : "border-border bg-muted/50 text-muted-foreground hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20"
                  }`}
                >
                  <Icon size={22} />
                  <span className="text-xs font-semibold">{label}</span>
                </button>
              );
            })}
          </div>
          {!formData.forma_pagamento && (
            <p className="text-xs text-muted-foreground mt-3">Nenhuma forma selecionada (opcional)</p>
          )}
        </div>

        {/* Status do Empréstimo */}
        <div className="card shadow-sm p-6">
          <h2 className="text-base font-semibold text-foreground mb-5 pb-3 border-b border-border">
            Status do Empréstimo
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, status_emprestimo: true }))}
              className={`flex items-center justify-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-150 ${
                formData.status_emprestimo
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-sm shadow-emerald-100 dark:shadow-emerald-900/30"
                  : "border-border bg-muted/50 text-muted-foreground hover:border-emerald-300"
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
                  ? "border-slate-500 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 shadow-sm"
                  : "border-border bg-muted/50 text-muted-foreground hover:border-slate-400"
              }`}
            >
              <XCircle size={20} />
              <span className="text-sm font-semibold">Liquidado</span>
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {formData.status_emprestimo
              ? "O empréstimo está ativo e aparece na listagem principal."
              : "O empréstimo está liquidado e não aparece na listagem ativa."}
          </p>
        </div>

        {/* BOTÕES */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={salvando}
            className="btn-primary flex-1 justify-center disabled:opacity-60 disabled:cursor-not-allowed"
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
            className="btn-outline flex-1 justify-center"
          >
            CANCELAR
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormEditarEmprestimo;