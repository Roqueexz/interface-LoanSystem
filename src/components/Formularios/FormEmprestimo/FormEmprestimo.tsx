import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import ClienteRequests from "../../../fetch/ClienteRequests";
import EmprestimoRequests from "../../../fetch/EmprestimoRequests";

import type ClienteDTO from "../../../interface/ClienteDTO";
import type EmprestimoDTO from "../../../interface/EmprestimoDTO";

function FormEmprestimo() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<ClienteDTO[]>([]);

  const [formData, setFormData] = useState<EmprestimoDTO>({
    id_cliente: 0,
    valor_emprestimo: 0,
    num_parcelas: 1,
    valor_parcela: 0,
    tipo_juros: "simples",
    juros: 0,
    data_emprestimo: new Date().toISOString().split("T")[0],
    data_devolucao: "",
    forma_pagamento: "",
    status_emprestimo: true,
  });

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    const lista = await ClienteRequests.obterListaDeClientes();

    if (lista) {
      setClientes(lista);
    }
  }

  function handleChange(
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "id_cliente" ||
        name === "num_parcelas" ||
        name === "valor_emprestimo" ||
        name === "valor_parcela" ||
        name === "juros"
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const sucesso =
      await EmprestimoRequests.enviarFormularioEmprestimo(formData);

    if (sucesso) {
      alert("Empréstimo cadastrado com sucesso!");
      navigate("/emprestimos");
    } else {
      alert("Erro ao cadastrar empréstimo.");
    }
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-2xl p-8"
        >

          <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">
            Novo Empréstimo
          </h1>

          <div className="space-y-6">

            {/* Cliente */}

            <div>

              <label className="block mb-2 font-medium text-slate-700">
                Cliente
              </label>

              <select
                required
                name="id_cliente"
                value={formData.id_cliente}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-3"
              >

                <option value={0}>
                  Selecione um cliente
                </option>

                {clientes.map((cliente) => (
                  <option
                    key={cliente.id_cliente}
                    value={cliente.id_cliente}
                  >
                    {cliente.nome_cliente} {cliente.sobrenome_cliente}
                  </option>
                ))}

              </select>

            </div>

            {/* Valor */}

            <div>

              <label className="block mb-2 font-medium text-slate-700">
                Valor do Empréstimo
              </label>

              <input
                type="number"
                required
                step="0.01"
                name="valor_emprestimo"
                value={formData.valor_emprestimo}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-3"
              />

            </div>

            {/* Parcelas */}

            <div className="grid grid-cols-2 gap-4">

              <div>

                <label className="block mb-2 font-medium">
                  Parcelas
                </label>

                <input
                  type="number"
                  required
                  min={1}
                  name="num_parcelas"
                  value={formData.num_parcelas}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Valor Parcela
                </label>

                <input
                  type="number"
                  required
                  step="0.01"
                  name="valor_parcela"
                  value={formData.valor_parcela}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />

              </div>

            </div>

            {/* Juros */}

            <div className="grid grid-cols-2 gap-4">

              <div>

                <label className="block mb-2 font-medium">
                  Tipo de Juros
                </label>

                <select
                  name="tipo_juros"
                  value={formData.tipo_juros}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                >
                  <option value="simples">
                    Simples
                  </option>

                  <option value="compostos">
                    Compostos
                  </option>
                </select>

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Juros (%)
                </label>

                <input
                  type="number"
                  required
                  step="0.01"
                  name="juros"
                  value={formData.juros}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />

              </div>

            </div>

            {/* Datas */}

            <div className="grid grid-cols-2 gap-4">

              <div>

                <label className="block mb-2 font-medium">
                  Data do Empréstimo
                </label>

                <input
                  type="date"
                  required
                  name="data_emprestimo"
                  value={String(formData.data_emprestimo)}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Data da Devolução
                </label>

                <input
                  type="date"
                  name="data_devolucao"
                  value={String(formData.data_devolucao)}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />

              </div>

            </div>

            {/* Forma Pagamento */}

            <div>

              <label className="block mb-2 font-medium">
                Forma de Pagamento
              </label>

              <input
                type="text"
                name="forma_pagamento"
                value={formData.forma_pagamento ?? ""}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
                placeholder="PIX, Dinheiro, Transferência..."
              />

            </div>

          </div>

          <div className="mt-8 flex gap-4">

            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700"
            >
              CADASTRAR
            </button>

            <button
              type="button"
              onClick={() => navigate("/emprestimos")}
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

export default FormEmprestimo;