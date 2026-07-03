import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import ClienteRequests from "../../../fetch/ClienteRequests";
import type ClienteDTO from "../../../interface/ClienteDTO";

function FormCliente() {
  const navigate = useNavigate();

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

    const sucesso =
      await ClienteRequests.enviarFormularioCliente(formData);

    setLoading(false);

    if (sucesso) {
      alert("Cliente cadastrado com sucesso!");
      navigate("/clientes");
    } else {
      alert("Erro ao cadastrar cliente.");
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
                <label className="block mb-2 font-medium">
                  Nome
                </label>

                <input
                  type="text"
                  required
                  name="nome_cliente"
                  value={formData.nome_cliente}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Sobrenome
                </label>

                <input
                  type="text"
                  required
                  name="sobrenome_cliente"
                  value={formData.sobrenome_cliente}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>
            </div>

            {/* TELEFONE */}
            <div>
              <label className="block mb-2 font-medium">
                Telefone
              </label>

              <input
                type="text"
                required
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
                placeholder="(11) 99999-9999"
              />
            </div>

            {/* CIDADE / ESTADO */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">
                  Cidade
                </label>

                <input
                  type="text"
                  required
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Estado
                </label>

                <input
                  type="text"
                  required
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
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
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "SALVANDO..." : "CADASTRAR"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/clientes")}
              className="flex-1 border py-3 rounded-xl font-bold"
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