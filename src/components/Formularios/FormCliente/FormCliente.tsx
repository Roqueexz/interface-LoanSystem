import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import ClienteRequests from "../../../fetch/ClienteRequests";
import type ClienteDTO from "../../../interface/ClienteDTO";

type FormClienteState = {
  nome_cliente: string;
  sobrenome_cliente: string;
  telefone: string;
  cidade: string;
  estado: string;
};

function FormCliente() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormClienteState>({
    nome_cliente: "",
    sobrenome_cliente: "",
    telefone: "",
    cidade: "",
    estado: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const payload: ClienteDTO = {
      nome_cliente: formData.nome_cliente,
      sobrenome_cliente: formData.sobrenome_cliente,
      telefone: formData.telefone,
      cidade: formData.cidade,
      estado: formData.estado.toUpperCase(),
      status_cliente: true,
    };

    const resposta =
      await ClienteRequests.enviarFormularioCliente(
        payload
      );

    if (resposta) {
      alert("Cliente cadastrado com sucesso!");
      navigate("/clientes");
    } else {
      alert("Erro ao cadastrar cliente.");
    }
  };

  return (
    <main className="bg-gray-100 flex-1 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-2xl p-8"
        >
          <h1 className="text-3xl font-bold text-center mb-8">
            Novo Cliente
          </h1>

          <div className="space-y-5">

            <div>
              <label className="block mb-2">
                Nome
              </label>

              <input
                type="text"
                name="nome_cliente"
                required
                value={formData.nome_cliente}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2">
                Sobrenome
              </label>

              <input
                type="text"
                name="sobrenome_cliente"
                required
                value={formData.sobrenome_cliente}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2">
                Telefone
              </label>

              <input
                type="text"
                name="telefone"
                required
                value={formData.telefone}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2">
                Cidade
              </label>

              <input
                type="text"
                name="cidade"
                required
                value={formData.cidade}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2">
                Estado (UF)
              </label>

              <input
                type="text"
                name="estado"
                maxLength={2}
                required
                value={formData.estado}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>

          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold"
            >
              CADASTRAR
            </button>

            <button
              type="button"
              onClick={() => navigate("/clientes")}
              className="flex-1 border border-slate-300 py-3 rounded-xl font-bold"
            >
              VOLTAR
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default FormCliente;