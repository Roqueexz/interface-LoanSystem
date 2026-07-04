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
} from "lucide-react";

import ClienteRequests from "../../../fetch/ClienteRequests";
import EmprestimoRequests from "../../../fetch/EmprestimoRequests";

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
      total =
        formData.valor_emprestimo +
        (formData.valor_emprestimo * formData.juros) / 100;
    } else {
      total =
        formData.valor_emprestimo *
        Math.pow(1 + formData.juros / 100, formData.num_parcelas);
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

  const sucesso = await EmprestimoRequests.enviarFormularioEmprestimo(payload);
  setSalvando(false);

  if (sucesso) {
    navigate("/emprestimos");
  }
}

  const formatarMoeda = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/emprestimos")}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Novo Empréstimo
            </h1>
            <p className="text-slate-400 text-sm">
              Preencha os dados para criar um novo empréstimo
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-base font-semibold text-slate-700 mb-5 pb-3 border-b border-slate-100">
              Dados do Empréstimo
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">
                  Cliente
                </label>
                <select
                  required
                  name="id_cliente"
                  value={formData.id_cliente}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-slate-600">
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
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    placeholder="Ex: 1000.00"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-sm font-medium text-slate-600">
                    Número de Parcelas
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    name="num_parcelas"
                    value={formData.num_parcelas}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                    step="0.01"
                    min="0"
                    required
                    name="juros"
                    value={formData.juros}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    placeholder="Ex: 5"
                  />
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
                <p className="text-xs text-indigo-400 mb-0.5">
                  Valor por parcela (calculado automaticamente)
                </p>
                <p className="text-lg font-bold text-indigo-700">
                  {valorParcela > 0 ? formatarMoeda(valorParcela) : "Aguardando dados..."}
                </p>
              </div>
            </div>
          </div>

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
                  required
                  name="data_emprestimo"
                  value={formData.data_emprestimo}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">
                  Data de Devolução (estimada)
                </label>
                <input
                  type="text"
                  readOnly
                  value={
                    formData.data_devolucao
                      ? new Date(formData.data_devolucao).toLocaleDateString(
                          "pt-BR"
                        )
                      : "..."
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-100 text-slate-600"
                />
              </div>
            </div>
          </div>

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
              <p className="text-xs text-slate-400 mt-3">
                Nenhuma forma selecionada (opcional)
              </p>
            )}
          </div>

          <div className="flex gap-4 pb-8">
            <button
              type="submit"
              disabled={salvando || formData.id_cliente === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
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

export default FormEmprestimo;