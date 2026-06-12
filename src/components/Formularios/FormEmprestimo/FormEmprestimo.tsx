import type { JSX, FormEvent } from "react";
import { useState } from "react";

interface Emprestimo {
  id?: string;
  cliente_id: string;
  valor_principal: number;
  taxa_juros: number;
  prazo_meses: number;
  data_inicio: string;
  data_vencimento: string;
  tipo_emprestimo: "pessoal" | "imobiliario" | "veiculo" | "negocio";
  status: "ativo" | "pago" | "inadimplente";
}

interface FormEmprestimoProps {
  onSubmit?: (emprestimo: Emprestimo) => void;
  emprestimoInicial?: Emprestimo;
  modo?: "criar" | "editar";
  clientesDisponiveis?: Array<{ id: string; nome: string }>;
}

function FormEmprestimo({
  onSubmit,
  emprestimoInicial,
  modo = "criar",
  clientesDisponiveis = [],
}: FormEmprestimoProps): JSX.Element {
  const [formData, setFormData] = useState<Emprestimo>(
    emprestimoInicial || {
      cliente_id: "",
      valor_principal: 0,
      taxa_juros: 0,
      prazo_meses: 0,
      data_inicio: new Date().toISOString().split("T")[0],
      data_vencimento: "",
      tipo_emprestimo: "pessoal",
      status: "ativo",
    }
  );

  const [erros, setErros] = useState<Partial<Record<keyof Emprestimo, string>>>({});
  const [prestacaoMensal, setPrestacaoMensal] = useState(0);
  const [sucesso, setSucesso] = useState(false);

  const calcularPrestacao = (valor: number, taxa: number, meses: number): number => {
    if (valor <= 0 || taxa <= 0 || meses <= 0) return 0;
    const taxaMensal = taxa / 100 / 12;
    return (valor * taxaMensal * Math.pow(1 + taxaMensal, meses)) / (Math.pow(1 + taxaMensal, meses) - 1);
  };

  const validarFormulario = (): boolean => {
    const novosErros: Partial<Record<keyof Emprestimo, string>> = {};

    if (!formData.cliente_id) {
      novosErros.cliente_id = "Cliente é obrigatório";
    }
    if (formData.valor_principal <= 0) {
      novosErros.valor_principal = "Valor deve ser maior que 0";
    }
    if (formData.taxa_juros < 0) {
      novosErros.taxa_juros = "Taxa de juros não pode ser negativa";
    }
    if (formData.prazo_meses <= 0) {
      novosErros.prazo_meses = "Prazo deve ser maior que 0 meses";
    } else if (formData.prazo_meses > 360) {
      novosErros.prazo_meses = "Prazo não pode exceder 360 meses";
    }
    if (!formData.data_inicio) {
      novosErros.data_inicio = "Data de início é obrigatória";
    }
    if (!formData.data_vencimento) {
      novosErros.data_vencimento = "Data de vencimento é obrigatória";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const novoValor =
      name === "valor_principal" || name === "taxa_juros"
        ? parseFloat(value)
        : name === "prazo_meses"
          ? parseInt(value)
          : value;

    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: novoValor,
      };

      if ((name === "data_inicio" || name === "prazo_meses") && updatedData.data_inicio && updatedData.prazo_meses > 0) {
        const dataInicio = new Date(updatedData.data_inicio);
        dataInicio.setMonth(dataInicio.getMonth() + updatedData.prazo_meses);
        updatedData.data_vencimento = dataInicio.toISOString().split("T")[0];
      }

      if (name === "valor_principal" || name === "taxa_juros" || name === "prazo_meses") {
        const prestacao = calcularPrestacao(
          updatedData.valor_principal,
          updatedData.taxa_juros,
          updatedData.prazo_meses
        );
        setPrestacaoMensal(prestacao);
      }

      return updatedData;
    });

    if (erros[name as keyof Emprestimo]) {
      setErros((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validarFormulario()) {
      onSubmit?.(formData);
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
      if (modo === "criar") {
        setFormData({
          cliente_id: "",
          valor_principal: 0,
          taxa_juros: 0,
          prazo_meses: 0,
          data_inicio: new Date().toISOString().split("T")[0],
          data_vencimento: "",
          tipo_emprestimo: "pessoal",
          status: "ativo",
        });
        setPrestacaoMensal(0);
      }
    }
  };

  const montanteTotal = prestacaoMensal * formData.prazo_meses;
  const totalJuros = montanteTotal - formData.valor_principal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-12">
            <h1 className="text-4xl font-bold text-white">
              {modo === "criar" ? "💰 Cadastrar Novo Empréstimo" : "✏️ Editar Empréstimo"}
            </h1>
            <p className="text-green-100 mt-2">Configure os detalhes do empréstimo abaixo</p>
          </div>

          {/* Alert de sucesso */}
          {sucesso && (
            <div className="mx-8 mt-8 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg animate-fade-in">
              <p className="text-green-700 font-semibold">✓ {modo === "criar" ? "Empréstimo criado" : "Empréstimo atualizado"} com sucesso!</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Cliente */}
            <div>
              <label htmlFor="cliente_id" className="block text-sm font-semibold text-gray-700 mb-3">
                Cliente *
              </label>
              <select
                id="cliente_id"
                name="cliente_id"
                value={formData.cliente_id}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                  erros.cliente_id ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              >
                <option value="">Selecione um cliente...</option>
                {clientesDisponiveis.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </option>
                ))}
              </select>
              {erros.cliente_id && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">⚠️ {erros.cliente_id}</p>}
            </div>

            {/* Valor e Taxa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="valor_principal" className="block text-sm font-semibold text-gray-700 mb-3">
                  Valor Principal (R$) *
                </label>
                <input
                  type="number"
                  id="valor_principal"
                  name="valor_principal"
                  value={formData.valor_principal}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    erros.valor_principal ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="10000.00"
                  step="0.01"
                  min="0"
                />
                {erros.valor_principal && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">⚠️ {erros.valor_principal}</p>}
              </div>

              <div>
                <label htmlFor="taxa_juros" className="block text-sm font-semibold text-gray-700 mb-3">
                  Taxa de Juros (% a.a.) *
                </label>
                <input
                  type="number"
                  id="taxa_juros"
                  name="taxa_juros"
                  value={formData.taxa_juros}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    erros.taxa_juros ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="12.00"
                  step="0.01"
                  min="0"
                />
                {erros.taxa_juros && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">⚠️ {erros.taxa_juros}</p>}
              </div>
            </div>

            {/* Prazo e Tipo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="prazo_meses" className="block text-sm font-semibold text-gray-700 mb-3">
                  Prazo (Meses) *
                </label>
                <input
                  type="number"
                  id="prazo_meses"
                  name="prazo_meses"
                  value={formData.prazo_meses}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    erros.prazo_meses ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="24"
                  min="1"
                  max="360"
                />
                {erros.prazo_meses && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">⚠️ {erros.prazo_meses}</p>}
              </div>

              <div>
                <label htmlFor="tipo_emprestimo" className="block text-sm font-semibold text-gray-700 mb-3">
                  Tipo de Empréstimo
                </label>
                <select
                  id="tipo_emprestimo"
                  name="tipo_emprestimo"
                  value={formData.tipo_emprestimo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option value="pessoal">Pessoal</option>
                  <option value="imobiliario">Imobiliário</option>
                  <option value="veiculo">Veículo</option>
                  <option value="negocio">Negócio</option>
                </select>
              </div>
            </div>

            {/* Datas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="data_inicio" className="block text-sm font-semibold text-gray-700 mb-3">
                  Data de Início *
                </label>
                <input
                  type="date"
                  id="data_inicio"
                  name="data_inicio"
                  value={formData.data_inicio}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    erros.data_inicio ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                />
                {erros.data_inicio && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">⚠️ {erros.data_inicio}</p>}
              </div>

              <div>
                <label htmlFor="data_vencimento" className="block text-sm font-semibold text-gray-700 mb-3">
                  Data de Vencimento *
                </label>
                <input
                  type="date"
                  id="data_vencimento"
                  name="data_vencimento"
                  value={formData.data_vencimento}
                  onChange={handleChange}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-3">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="ativo">Ativo</option>
                <option value="pago">Pago</option>
                <option value="inadimplente">Inadimplente</option>
              </select>
            </div>

            {/* Resumo Financeiro */}
            {formData.valor_principal > 0 && formData.prazo_meses > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 animate-slide-up">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">📊 Resumo Financeiro</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <p className="text-xs text-gray-600 font-semibold mb-1">Valor Principal</p>
                    <p className="text-lg font-bold text-green-600">R$ {formData.valor_principal.toFixed(2)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <p className="text-xs text-gray-600 font-semibold mb-1">Prestação Mensal</p>
                    <p className="text-lg font-bold text-blue-600">R$ {prestacaoMensal.toFixed(2)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <p className="text-xs text-gray-600 font-semibold mb-1">Total de Juros</p>
                    <p className="text-lg font-bold text-orange-600">R$ {totalJuros.toFixed(2)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <p className="text-xs text-gray-600 font-semibold mb-1">Montante Total</p>
                    <p className="text-lg font-bold text-purple-600">R$ {montanteTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-4 pt-8 border-t-2 border-gray-200">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                {modo === "criar" ? "✓ Criar Empréstimo" : "✓ Atualizar Empréstimo"}
              </button>
              <button
                type="reset"
                className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-all"
              >
                🔄 Limpar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormEmprestimo;

