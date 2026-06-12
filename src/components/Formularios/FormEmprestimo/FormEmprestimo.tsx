import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import type EmprestimoDTO from "../../../interface/EmprestimoDTO";

import Juros from "../../../services/Juros";

type FormEmprestimoState = {
  id_cliente: number;
  valor_emprestimo: number;
  num_parcelas: number;
  tipo_juros: string;
  juros: number;
  data_emprestimo: string;
  data_devolucao: string;
  status_emprestimo: boolean;
};

function FormEmprestimo() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormEmprestimoState>({
    id_cliente: 0,
    valor_emprestimo: 0,
    num_parcelas: 1,
    tipo_juros: "simples",
    juros: 0,
    data_emprestimo: new Date().toISOString().split("T")[0],
    data_devolucao: "",
    status_emprestimo: true,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const resultado =
      formData.tipo_juros === "simples"
        ? Juros.calcularSimples(
            formData.valor_emprestimo,
            formData.juros,
            formData.num_parcelas
          )
        : Juros.calcularCompostos(
            formData.valor_emprestimo,
            formData.juros,
            formData.num_parcelas
          );

    const payload: EmprestimoDTO = {
      id_cliente: formData.id_cliente,
      valor_emprestimo: formData.valor_emprestimo,
      num_parcelas: formData.num_parcelas,
      valor_parcela: resultado.valorParcela,
      tipo_juros: formData.tipo_juros,
      juros: formData.juros,
      data_emprestimo: new Date(formData.data_emprestimo),
      data_devolucao: formData.data_devolucao
        ? new Date(formData.data_devolucao)
        : undefined,
      status_emprestimo: formData.status_emprestimo,
    };

    const resposta = await EmprestimoRequests.enviarFormularioEmprestimo(payload);

    if (resposta) {
      alert("Empréstimo cadastrado com sucesso!");
      navigate("/emprestimos");
    } else {
      alert("Erro ao cadastrar empréstimo.");
    }
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-2xl p-8"
        >
          <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">
            Novo Empréstimo
          </h1>

          <div className="space-y-5">
            <div>
              <label className="block mb-2 font-medium text-slate-700">ID do Cliente</label>
              <input
                type="number"
                name="id_cliente"
                min={1}
                required
                value={formData.id_cliente || ""}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: 12"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-700">Valor do Empréstimo</label>
              <input
                type="number"
                name="valor_emprestimo"
                step="0.01"
                required
                value={formData.valor_emprestimo || ""}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0,00"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-700">Número de Parcelas</label>
              <input
                type="number"
                name="num_parcelas"
                min={1}
                required
                value={formData.num_parcelas}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-700">Tipo de Juros</label>
              <select
                name="tipo_juros"
                value={formData.tipo_juros}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="simples">Juros Simples</option>
                <option value="composto">Juros Compostos</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-700">Taxa de Juros (%)</label>
              <input
                type="number"
                name="juros"
                step="0.01"
                required
                value={formData.juros || ""}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0,00"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-700">Data do Empréstimo</label>
              <input
                type="date"
                name="data_emprestimo"
                value={formData.data_emprestimo}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-700">Data de Devolução</label>
              <input
                type="date"
                name="data_devolucao"
                value={formData.data_devolucao}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md"
            >
              CADASTRAR
            </button>

            <button
              type="button"
              onClick={() => navigate("/emprestimos")}
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

export default FormEmprestimo;