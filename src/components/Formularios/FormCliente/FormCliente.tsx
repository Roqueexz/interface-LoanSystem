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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const resposta =
      await ClienteRequests.enviarFormularioCliente(formData);

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

          <div className="space-y-6">

            {/* Nome e Sobrenome */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-2 font-medium">
                  Nome
                </label>

                <input
                  type="text"
                  name="nome_cliente"
                  required
                  minLength={3}
                  value={formData.nome_cliente}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                  placeholder="Digite o nome"
                />
              </div>

              <div className="flex-1">
                <label className="block mb-2 font-medium">
                  Sobrenome
                </label>

                <input
                  type="text"
                  name="sobrenome_cliente"
                  required
                  minLength={3}
                  value={formData.sobrenome_cliente}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                  placeholder="Digite o sobrenome"
                />
              </div>
            </div>

            {/* Telefone */}
            <div>
              <label className="block mb-2 font-medium">
                Telefone
              </label>

              <input
                type="tel"
                name="telefone"
                required
                value={formData.telefone}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
                placeholder="(13) 99999-9999"
              />
            </div>

            {/* Cidade e Estado */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-2 font-medium">
                  Cidade
                </label>

                <input
                  type="text"
                  name="cidade"
                  required
                  value={formData.cidade}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                  placeholder="Ex: Peruíbe"
                />
              </div>

              <div className="flex-1">
                <label className="block mb-2 font-medium">
                  Estado
                </label>

                <input
                  type="text"
                  name="estado"
                  required
                  maxLength={2}
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                  placeholder="SP"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700"
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