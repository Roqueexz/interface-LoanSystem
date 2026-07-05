import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Banknote,
  Smartphone,
  FileText,
  CreditCard,
  ArrowLeft,
  Save,
  Loader2,
  Calendar,
  DollarSign,
} from "lucide-react";

import ClienteRequests from "../../../fetch/ClienteRequests";
import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import { useToast } from "../../../hooks/useToast";

import type ClienteDTO from "../../../interface/ClienteDTO";
import type EmprestimoDTO from "../../../interface/EmprestimoDTO";

const FORMAS_PAGAMENTO = [
  { value: "dinheiro", label: "Dinheiro", Icon: Banknote },
  { value: "pix", label: "Pix", Icon: Smartphone },
  { value: "boleto", label: "Boleto", Icon: FileText },
  { value: "cartao", label: "Cartão", Icon: CreditCard },
] as const;

function FormEmprestimo() {
  const navigate = useNavigate();
  const toast = useToast();

  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [carregandoClientes, setCarregandoClientes] = useState(true);

  const [formData, setFormData] = useState({
    id_cliente: 0,
    valor_emprestimo: 0,
    num_parcelas: 1,
    tipo_juros: "simples",
    juros: 0,
    data_emprestimo: (() => {
      const hoje = new Date();
      hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
      return hoje.toISOString().split("T")[0];
    })(),
    data_devolucao: "",
    forma_pagamento: "",
  });

  const [valorParcela, setValorParcela] = useState(0);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    setCarregandoClientes(true);
    const lista = await ClienteRequests.obterListaDeClientes();
    if (lista) {
      setClientes(lista);
    }
    setCarregandoClientes(false);
  }

  useEffect(() => {
    if (formData.valor_emprestimo <= 0 || formData.num_parcelas <= 0) return;

    let total = formData.valor_emprestimo;

    if (formData.tipo_juros === "simples") {
      total = formData.valor_emprestimo * (1 + (formData.juros / 100) * formData.num_parcelas);
    } else {
      total = formData.valor_emprestimo * Math.pow(1 + formData.juros / 100, formData.num_parcelas);
    }

    const valorCalculado = Number((total / formData.num_parcelas).toFixed(2));
    setValorParcela(valorCalculado);
  }, [
    formData.valor_emprestimo,
    formData.num_parcelas,
    formData.juros,
    formData.tipo_juros,
  ]);

  useEffect(() => {
    if (!formData.data_emprestimo) return;

    const data = new Date(formData.data_emprestimo);
    data.setMonth(data.getMonth() + Number(formData.num_parcelas));

    const novaData = data.toISOString().split("T")[0];

    if (novaData !== formData.data_devolucao) {
      setFormData((prev) => ({
        ...prev,
        data_devolucao: novaData,
      }));
    }
  }, [formData.data_emprestimo, formData.num_parcelas]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    const camposNumericos = [
      "id_cliente",
      "valor_emprestimo",
      "num_parcelas",
      "juros",
    ];

    setFormData((prev) => ({
      ...prev,
      [name]: camposNumericos.includes(name)
        ? Number(value)
        : value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSalvando(true);

    const payload: EmprestimoDTO = {
      id_cliente: formData.id_cliente,
      valor_emprestimo: formData.valor_emprestimo,
      num_parcelas: formData.num_parcelas,
      tipo_juros: formData.tipo_juros,
      juros: formData.juros,
      data_emprestimo: new Date(formData.data_emprestimo),
      data_devolucao: formData.data_devolucao
        ? new Date(formData.data_devolucao)
        : undefined,
      forma_pagamento: formData.forma_pagamento || undefined,
    };

    const sucesso = await toast.promise(
      EmprestimoRequests.enviarFormularioEmprestimo(payload),
      {
        loading: 'Cadastrando empréstimo...',
        success: '✅ Empréstimo cadastrado com sucesso!',
        error: '❌ Erro ao cadastrar empréstimo.',
      }
    );

    setSalvando(false);

    if (sucesso) {
      navigate("/emprestimos");
    }
  }

  const formatarMoeda = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/emprestimos")}
          className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Novo Empréstimo</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Preencha os dados para criar um novo empréstimo
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados do Empréstimo */}
        <div className="card shadow-sm p-6">
          <h2 className="text-base font-semibold text-foreground mb-5 pb-3 border-b border-border">
            Dados do Empréstimo
          </h2>
          <div className="space-y-5">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-foreground">
                Cliente
              </label>
              <select
                required
                name="id_cliente"
                value={formData.id_cliente}
                onChange={handleChange}
                className="input"
              >
                <option value={0}>
                  {carregandoClientes ? "Carregando..." : "Selecione um cliente"}
                </option>
                {clientes.map((cliente) => (
                  <option key={cliente.id_cliente} value={cliente.id_cliente}>
                    {cliente.nome_cliente} {cliente.sobrenome_cliente}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-foreground">
                  Valor do Empréstimo (R$)
                </label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  name="valor_emprestimo"
                  value={formData.valor_emprestimo || ""}
                  onChange={handleChange}
                  className="input"
                  placeholder="Ex: 1000.00"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-medium text-foreground">
                  Número de Parcelas
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  name="num_parcelas"
                  value={formData.num_parcelas}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  step="0.01"
                  min="0"
                  required
                  name="juros"
                  value={formData.juros ?? ""}
                  onChange={handleChange}
                  className="input"
                  placeholder="Ex: 5"
                />
              </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl px-4 py-3">
              <p className="text-xs text-indigo-400 dark:text-indigo-400 mb-0.5">
                Valor por parcela (calculado automaticamente)
              </p>
              <p className="text-lg font-bold text-indigo-700 dark:text-indigo-400">
                {valorParcela > 0 ? formatarMoeda(valorParcela) : "Aguardando dados..."}
              </p>
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
                required
                name="data_emprestimo"
                value={formData.data_emprestimo}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium text-foreground">
                Data de Devolução (estimada)
              </label>
              <input
                type="text"
                readOnly
                value={
                  formData.data_devolucao
                    ? new Date(formData.data_devolucao).toLocaleDateString("pt-BR")
                    : "..."
                }
                className="input bg-muted cursor-default"
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
            <p className="text-xs text-muted-foreground mt-3">
              Nenhuma forma selecionada (opcional)
            </p>
          )}
        </div>

        {/* BOTÕES */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={salvando || formData.id_cliente === 0}
            className="btn-primary flex-1 justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {salvando ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Cadastrando...
              </>
            ) : (
              <>
                <Save size={18} />
                CADASTRAR
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

export default FormEmprestimo;