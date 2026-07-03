import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ClienteRequests from "../../../fetch/ClienteRequests";
import type ClienteDTO from "../../../interface/ClienteDTO";

function FormEditarCliente() {
  const navigate = useNavigate();
  const { id } = useParams();

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

    const sucesso = await ClienteRequests.atualizarCliente(
      Number(id),
      formData
    );

    if (sucesso) {
      alert("Cliente atualizado com sucesso!");
      navigate("/clientes");
    } else {
      alert("Erro ao atualizar cliente.");
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
                className="border rounded-xl p-3"
                placeholder="Nome"
              />

              <input
                type="text"
                name="sobrenome_cliente"
                value={formData.sobrenome_cliente}
                onChange={handleChange}
                className="border rounded-xl p-3"
                placeholder="Sobrenome"
              />

            </div>

            {/* TELEFONE */}
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
              placeholder="Telefone"
            />

            {/* CIDADE / ESTADO */}
            <div className="grid grid-cols-2 gap-4">

              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                className="border rounded-xl p-3"
                placeholder="Cidade"
              />

              <input
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="border rounded-xl p-3"
                placeholder="Estado"
              />

            </div>

          </div>

          {/* BOTÕES */}
          <div className="mt-8 flex gap-4">

            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold"
            >
              SALVAR
            </button>

            <button
              type="button"
              onClick={() => navigate("/clientes")}
              className="flex-1 border py-3 rounded-xl font-bold"
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