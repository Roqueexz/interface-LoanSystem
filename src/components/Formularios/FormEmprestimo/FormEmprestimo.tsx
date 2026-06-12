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

      // Atualizar data de vencimento automaticamente
      if ((name === "data_inicio" || name === "prazo_meses") && updatedData.data_inicio && updatedData.prazo_meses > 0) {
        const dataInicio = new Date(updatedData.data_inicio);
        dataInicio.setMonth(dataInicio.getMonth() + updatedData.prazo_meses);
        updatedData.data_vencimento = dataInicio.toISOString().split("T")[0];
      }

      // Recalcular prestação mensal
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
    <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {modo === "criar" ? "Cadastrar Novo Empréstimo" : "Editar Empréstimo"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cliente */}
        <div>
          <label htmlFor="cliente_id" className="block text-sm font-medium text-gray-700 mb-2">
            Cliente *
          </label>
          <select
            id="cliente_id"
            name="cliente_id"
            value={formData.cliente_id}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              erros.cliente_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Selecione um cliente...</option>
            {clientesDisponiveis.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
          {erros.cliente_id && <p className="text-red-500 text-sm mt-1">{erros.cliente_id}</p>}
        </div>

        {/* Valor e Taxa de Juros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="valor_principal" className="block text-sm font-medium text-gray-700 mb-2">
              Valor Principal (R$) *
            </label>
            <input
              type="number"
              id="valor_principal"
              name="valor_principal"
              value={formData.valor_principal}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                erros.valor_principal ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="10000.00"
              step="0.01"
              min="0"
            />
            {erros.valor_principal && <p className="text-red-500 text-sm mt-1">{erros.valor_principal}</p>}
          </div>

          <div>
            <label htmlFor="taxa_juros" className="block text-sm font-medium text-gray-700 mb-2">
              Taxa de Juros (% a.a.) *
            </label>
            <input
              type="number"
              id="taxa_juros"
              name="taxa_juros"
              value={formData.taxa_juros}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                erros.taxa_juros ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="12.00"
              step="0.01"
              min="0"
            />
            {erros.taxa_juros && <p className="text-red-500 text-sm mt-1">{erros.taxa_juros}</p>}
          </div>
        </div>

        {/* Prazo e Tipo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="prazo_meses" className="block text-sm font-medium text-gray-700 mb-2">
              Prazo (Meses) *
            </label>
            <input
              type="number"
              id="prazo_meses"
              name="prazo_meses"
              value={formData.prazo_meses}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                erros.prazo_meses ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="24"
              min="1"
              max="360"
            />
            {erros.prazo_meses && <p className="text-red-500 text-sm mt-1">{erros.prazo_meses}</p>}
          </div>

          <div>
            <label htmlFor="tipo_emprestimo" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Empréstimo
            </label>
            <select
              id="tipo_emprestimo"
              name="tipo_emprestimo"
              value={formData.tipo_emprestimo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            <label htmlFor="data_inicio" className="block text-sm font-medium text-gray-700 mb-2">
              Data de Início *
            </label>
            <input
              type="date"
              id="data_inicio"
              name="data_inicio"
              value={formData.data_inicio}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                erros.data_inicio ? "border-red-500" : "border-gray-300"
              }`}
            />
            {erros.data_inicio && <p className="text-red-500 text-sm mt-1">{erros.data_inicio}</p>}
          </div>

          <div>
            <label htmlFor="data_vencimento" className="block text-sm font-medium text-gray-700 mb-2">
              Data de Vencimento *
            </label>
            <input
              type="date"
              id="data_vencimento"
              name="data_vencimento"
              value={formData.data_vencimento}
              onChange={handleChange}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ativo">Ativo</option>
            <option value="pago">Pago</option>
            <option value="inadimplente">Inadimplente</option>
          </select>
        </div>

        {/* Resumo Financeiro */}
        {formData.valor_principal > 0 && formData.prazo_meses > 0 && (
          <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Valor Principal</p>
                <p className="text-lg font-bold text-indigo-600">R$ {formData.valor_principal.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Prestação Mensal</p>
                <p className="text-lg font-bold text-green-600">R$ {prestacaoMensal.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Juros</p>
                <p className="text-lg font-bold text-orange-600">R$ {totalJuros.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Montante Total</p>
                <p className="text-lg font-bold text-blue-600">R$ {montanteTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {modo === "criar" ? "Criar Empréstimo" : "Atualizar Empréstimo"}
          </button>
          <button
            type="reset"
            className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Limpar
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormEmprestimo;
