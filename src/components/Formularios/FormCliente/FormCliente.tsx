import type { JSX, FormEvent } from "react";
import { useState } from "react";

interface Cliente {
  id?: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  renda_mensal: number;
}

interface FormClienteProps {
  onSubmit?: (cliente: Cliente) => void;
  clienteInicial?: Cliente;
  modo?: "criar" | "editar";
}

function FormCliente({ onSubmit, clienteInicial, modo = "criar" }: FormClienteProps): JSX.Element {
  const [formData, setFormData] = useState<Cliente>(
    clienteInicial || {
      nome: "",
      cpf: "",
      email: "",
      telefone: "",
      endereco: "",
      cidade: "",
      estado: "",
      renda_mensal: 0,
    }
  );

  const [erros, setErros] = useState<Partial<Record<keyof Cliente, string>>>({});
  const [sucesso, setSucesso] = useState(false);

  const validarFormulario = (): boolean => {
    const novosErros: Partial<Record<keyof Cliente, string>> = {};

    if (!formData.nome.trim()) {
      novosErros.nome = "Nome é obrigatório";
    }
    if (!formData.cpf.trim()) {
      novosErros.cpf = "CPF é obrigatório";
    } else if (!/^\d{11}$/.test(formData.cpf.replace(/\D/g, ""))) {
      novosErros.cpf = "CPF deve ter 11 dígitos";
    }
    if (!formData.email.trim()) {
      novosErros.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      novosErros.email = "Email inválido";
    }
    if (!formData.telefone.trim()) {
      novosErros.telefone = "Telefone é obrigatório";
    }
    if (!formData.endereco.trim()) {
      novosErros.endereco = "Endereço é obrigatório";
    }
    if (!formData.cidade.trim()) {
      novosErros.cidade = "Cidade é obrigatória";
    }
    if (!formData.estado.trim()) {
      novosErros.estado = "Estado é obrigatório";
    }
    if (formData.renda_mensal <= 0) {
      novosErros.renda_mensal = "Renda mensal deve ser maior que 0";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "renda_mensal" ? parseFloat(value) : value,
    }));
    if (erros[name as keyof Cliente]) {
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
          nome: "",
          cpf: "",
          email: "",
          telefone: "",
          endereco: "",
          cidade: "",
          estado: "",
          renda_mensal: 0,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-12">
            <h1 className="text-4xl font-bold text-white">
              {modo === "criar" ? "📋 Cadastrar Novo Cliente" : "✏️ Editar Cliente"}
            </h1>
            <p className="text-blue-100 mt-2">Preencha os dados abaixo para continuar</p>
          </div>

          {/* Alert de sucesso */}
          {sucesso && (
            <div className="mx-8 mt-8 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg animate-fade-in">
              <p className="text-green-700 font-semibold">✓ {modo === "criar" ? "Cliente cadastrado" : "Cliente atualizado"} com sucesso!</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Nome */}
            <div>
              <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-3">
                Nome Completo *
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                  erros.nome ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="João da Silva"
              />
              {erros.nome && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">⚠️ {erros.nome}</p>}
            </div>

            {/* CPF e Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="cpf" className="block text-sm font-semibold text-gray-700 mb-3">
                  CPF *
                </label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    erros.cpf ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="123.456.789-10"
                />
                {erros.cpf && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">⚠️ {erros.cpf}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    erros.email ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="joao@email.com"
                />
                {erros.email && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">⚠️ {erros.email}</p>}
              </div>
            </div>

            {/* Telefone e Renda */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="telefone" className="block text-sm font-semibold text-gray-700 mb-3">
                  Telefone *
                </label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    erros.telefone ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="(11) 98765-4321"
                />
                {erros.telefone && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">⚠️ {erros.telefone}</p>}
              </div>

              <div>
                <label htmlFor="renda_mensal" className="block text-sm font-semibold text-gray-700 mb-3">
                  Renda Mensal (R$) *
                </label>
                <input
                  type="number"
                  id="renda_mensal"
                  name="renda_mensal"
                  value={formData.renda_mensal}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    erros.renda_mensal ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="5000.00"
                  step="0.01"
                  min="0"
                />
                {erros.renda_mensal && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">⚠️ {erros.renda_mensal}</p>}
              </div>
            </div>

            {/* Endereço */}
            <div>
              <label htmlFor="endereco" className="block text-sm font-semibold text-gray-700 mb-3">
                Endereço *
              </label>
              <textarea
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                rows={2}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                  erros.endereco ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Rua das Flores, 123"
              />
              {erros.endereco && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">⚠️ {erros.endereco}</p>}
            </div>

            {/* Cidade e Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="cidade" className="block text-sm font-semibold text-gray-700 mb-3">
                  Cidade *
                </label>
                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    erros.cidade ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="São Paulo"
                />
                {erros.cidade && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">⚠️ {erros.cidade}</p>}
              </div>

              <div>
                <label htmlFor="estado" className="block text-sm font-semibold text-gray-700 mb-3">
                  Estado (UF) *
                </label>
                <input
                  type="text"
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  maxLength={2}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    erros.estado ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="SP"
                />
                {erros.estado && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">⚠️ {erros.estado}</p>}
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-8 border-t-2 border-gray-200">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                {modo === "criar" ? "✓ Cadastrar Cliente" : "✓ Atualizar Cliente"}
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

export default FormCliente;

