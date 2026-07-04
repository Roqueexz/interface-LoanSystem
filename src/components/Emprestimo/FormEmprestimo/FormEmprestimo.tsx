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
    valor_parcela: 0, // Mantido para exibição, mas NÃO será enviado
    tipo_juros: "simples",
    juros: 0,
    data_emprestimo: (() => {
      const hoje = new Date();
      hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
      return hoje.toISOString().split("T")[0];
    })(),
    data_devolucao: "",
    forma_pagamento: "",
    status_emprestimo: true,
  });

  // ---------------------------
  // CARREGAR CLIENTES
  // ---------------------------
  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    const lista = await ClienteRequests.obterListaDeClientes();

    if (lista) {
      setClientes(lista);
    }
  }

  // ---------------------------
  // CÁLCULO DA PARCELA (apenas para exibição)
  // ---------------------------
  useEffect(() => {
    if (formData.valor_emprestimo <= 0 || formData.num_parcelas <= 0) return;

    let total = formData.valor_emprestimo;

    if (formData.tipo_juros === "simples") {
      total =
        formData.valor_emprestimo +
        (formData.valor_emprestimo * formData.juros) / 100;
    } else {
      total =
        formData.valor_emprestimo *
        Math.pow(1 + formData.juros / 100, formData.num_parcelas);
    }

    const valorParcela = Number(
      (total / formData.num_parcelas).toFixed(2)
    );

    if (valorParcela !== formData.valor_parcela) {
      setFormData((prev) => ({
        ...prev,
        valor_parcela: valorParcela,
      }));
    }
  }, [
    formData.valor_emprestimo,
    formData.num_parcelas,
    formData.juros,
    formData.tipo_juros,
  ]);

  // ---------------------------
  // CÁLCULO DATA DEVOLUÇÃO
  // ---------------------------
  useEffect(() => {
    if (!formData.data_emprestimo) return;

    const data = new Date(formData.data_emprestimo);

    data.setMonth(data.getMonth() + Number(formData.num_parcelas));

    const novaData = data.toISOString().split("T")[0];

    if (novaData !== formData.data_devolucao) {
      setFormData((prev) => ({
        ...prev,
        data_devolucao: novaData,
      }));
    }
  }, [formData.data_emprestimo, formData.num_parcelas]);

  // ---------------------------
  // HANDLE CHANGE
  // ---------------------------
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    const camposNumericos = [
      "id_cliente",
      "valor_emprestimo",
      "num_parcelas",
      "juros",
    ];

    setFormData((prev) => ({
      ...prev,
      [name]: camposNumericos.includes(name)
        ? Number(value)
        : value,
    }));
  }

  // ---------------------------
  // SUBMIT - CORRIGIDO
  // ---------------------------
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // 🔥 CRIA UMA CÓPIA DO FORMULÁRIO SEM O valor_parcela
    const { valor_parcela, ...dadosParaEnviar } = formData;

    const sucesso =
      await EmprestimoRequests.enviarFormularioEmprestimo(dadosParaEnviar as EmprestimoDTO);

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

            {/* CLIENTE */}
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
                <option value={0}>Selecione um cliente</option>

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

            {/* VALOR EMPRÉSTIMO */}
            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Valor do Empréstimo
              </label>

              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                name="valor_emprestimo"
                value={formData.valor_emprestimo || ""}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
                placeholder="Ex: 1000.00"
              />
            </div>

            {/* PARCELAS */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">
                  Número de Parcelas
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
                  Valor da Parcela (calculado)
                </label>

                <input
                  type="text"
                  readOnly
                  value={formData.valor_parcela > 0 ? `R$ ${formData.valor_parcela.toFixed(2)}` : "Aguardando dados..."}
                  className="w-full border rounded-xl p-3 bg-slate-100 font-semibold text-indigo-600"
                />
              </div>
            </div>

            {/* JUROS */}
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
                  <option value="simples">Simples</option>
                  <option value="compostos">Compostos</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Juros (%)
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  name="juros"
                  value={formData.juros}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                  placeholder="Ex: 5"
                />
              </div>
            </div>

            {/* DATAS */}
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
                  Data da Devolução (estimada)
                </label>

                <input
                  type="text"
                  readOnly
                  value={formData.data_devolucao ? new Date(formData.data_devolucao).toLocaleDateString('pt-BR') : "..."}
                  className="w-full border rounded-xl p-3 bg-slate-100"
                />
              </div>
            </div>

            {/* PAGAMENTO */}
            <div>
              <label className="block mb-2 font-medium">
                Forma de Pagamento (opcional)
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

          {/* BOTÕES */}
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all"
            >
              CADASTRAR
            </button>

            <button
              type="button"
              onClick={() => navigate("/emprestimos")}
              className="flex-1 border border-slate-300 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all"
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