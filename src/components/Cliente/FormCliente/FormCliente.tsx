import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import ClienteRequests from "../../../fetch/ClienteRequests";
import type ClienteDTO from "../../../interface/ClienteDTO";
import { useToast } from "../../../hooks/useToast";

function FormCliente() {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState<ClienteDTO>({
    nome_cliente: "",
    sobrenome_cliente: "",
    telefone: "",
    cidade: "",
    estado: "",
    status_cliente: true,
  });

  const [loading, setLoading] = useState(false);

  // -------------------------
  // HANDLE CHANGE
  // -------------------------
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // -------------------------
  // SUBMIT
  // -------------------------
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setLoading(true);

    const sucesso = await toast.promise(
      ClienteRequests.enviarFormularioCliente(formData),
      {
        loading: 'Cadastrando cliente...',
        success: '✅ Cliente cadastrado com sucesso!',
        error: '❌ Erro ao cadastrar cliente.',
      }
    );

    setLoading(false);

    if (sucesso) {
      navigate("/clientes");
    }
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-2xl p-8"
        >
          <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">
            Novo Cliente
          </h1>

          <div className="space-y-6">

            {/* NOME */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Nome
                </label>

                <input
                  type="text"
                  required
                  name="nome_cliente"
                  value={formData.nome_cliente}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  placeholder="Ex: João"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Sobrenome
                </label>

                <input
                  type="text"
                  required
                  name="sobrenome_cliente"
                  value={formData.sobrenome_cliente}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  placeholder="Ex: Silva"
                />
              </div>
            </div>

            {/* TELEFONE */}
            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Telefone
              </label>

              <input
                type="text"
                required
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                placeholder="(11) 99999-9999"
              />
            </div>

            {/* CIDADE / ESTADO */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Cidade
                </label>

                <input
                  type="text"
                  required
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  placeholder="Ex: São Paulo"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Estado
                </label>

                <input
                  type="text"
                  required
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  maxLength={2}
                  placeholder="SP"
                />
              </div>
            </div>
          </div>

          {/* BOTÕES */}
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "SALVANDO..." : "CADASTRAR"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/clientes")}
              className="flex-1 border border-slate-300 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              VOLTAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormCliente;