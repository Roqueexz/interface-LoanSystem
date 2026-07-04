import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ClienteRequests from "../../../fetch/ClienteRequests";
import type ClienteDTO from "../../../interface/ClienteDTO";
import { useToast } from "../../../hooks/useToast";

function FormEditarCliente() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<ClienteDTO>({
    nome_cliente: "",
    sobrenome_cliente: "",
    telefone: "",
    cidade: "",
    estado: "",
    status_cliente: true,
  });

  // -----------------------------
  // CARREGAR CLIENTE
  // -----------------------------
  async function carregarCliente() {
    if (!id) return;

    setLoading(true);

    const cliente = await ClienteRequests.obterClientePorId(Number(id));

    if (cliente) {
      setFormData(cliente);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarCliente();
  }, [id]);

  // -----------------------------
  // HANDLE CHANGE
  // -----------------------------
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // -----------------------------
  // SUBMIT
  // -----------------------------
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!id) return;

    const sucesso = await toast.promise(
      ClienteRequests.atualizarCliente(Number(id), formData),
      {
        loading: 'Atualizando cliente...',
        success: '✅ Cliente atualizado com sucesso!',
        error: '❌ Erro ao atualizar cliente.',
      }
    );

    if (sucesso) {
      navigate("/clientes");
    }
  }

  // -----------------------------
  // LOADING
  // -----------------------------
  if (loading) {
    return (
      <div className="p-6 text-slate-500">
        Carregando cliente...
      </div>
    );
  }

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-2xl p-8"
        >

          <h1 className="text-3xl font-bold text-center mb-8">
            Editar Cliente
          </h1>

          <div className="space-y-6">

            {/* NOME */}
            <div className="grid grid-cols-2 gap-4">

              <input
                type="text"
                name="nome_cliente"
                value={formData.nome_cliente}
                onChange={handleChange}
                className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Nome"
                required
              />

              <input
                type="text"
                name="sobrenome_cliente"
                value={formData.sobrenome_cliente}
                onChange={handleChange}
                className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Sobrenome"
                required
              />

            </div>

            {/* TELEFONE */}
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Telefone"
              required
            />

            {/* CIDADE / ESTADO */}
            <div className="grid grid-cols-2 gap-4">

              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Cidade"
                required
              />

              <input
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Estado (ex: SP)"
                required
                maxLength={2}
              />

            </div>

          </div>

          {/* BOTÕES */}
          <div className="mt-8 flex gap-4">

            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all"
            >
              SALVAR
            </button>

            <button
              type="button"
              onClick={() => navigate("/clientes")}
              className="flex-1 border border-slate-300 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              CANCELAR
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default FormEditarCliente;