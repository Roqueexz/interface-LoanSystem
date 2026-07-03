import { useEffect, useState } from "react";

import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import type EmprestimoDTO from "../../../interface/EmprestimoDTO";

interface Props {
  id_cliente: number;
}

function EmprestimosDoCliente({ id_cliente }: Props) {
  const [emprestimos, setEmprestimos] = useState<EmprestimoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // -----------------------------
  // CARREGAR EMPRÉSTIMOS
  // -----------------------------
  async function carregarEmprestimos() {
    setLoading(true);
    setErro("");

    const dados = await EmprestimoRequests.obterListaDeEmprestimos();

    if (dados) {
      const filtrados = dados.filter(
        (emp) => emp.id_cliente === id_cliente
      );

      setEmprestimos(filtrados);
    } else {
      setErro("Erro ao carregar empréstimos.");
    }

    setLoading(false);
  }

  useEffect(() => {
    if (id_cliente) {
      carregarEmprestimos();
    }
  }, [id_cliente]);

  // -----------------------------
  // STATUS SIMPLES (ajuste futuro depois)
  // -----------------------------
  function getStatus(emp: EmprestimoDTO) {
    if (!emp.status_emprestimo) return "Quitado";
    return "Ativo";
  }

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="mt-6">

      <h2 className="text-xl font-bold text-slate-800 mb-4">
        Empréstimos do Cliente
      </h2>

      {/* STATES */}
      {loading && (
        <p className="text-slate-500">
          Carregando empréstimos...
        </p>
      )}

      {erro && (
        <p className="text-red-500">
          {erro}
        </p>
      )}

      {/* EMPTY */}
      {!loading && emprestimos.length === 0 && (
        <p className="text-slate-500">
          Nenhum empréstimo encontrado.
        </p>
      )}

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {emprestimos.map((emp) => (
          <div
            key={emp.id_emprestimo}
            className="bg-white shadow-md rounded-xl p-4 border hover:shadow-lg transition"
          >

            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">

              <span className="text-sm font-bold text-slate-600">
                #{emp.id_emprestimo}
              </span>

              <span
                className={`text-xs px-2 py-1 rounded-full font-bold ${
                  getStatus(emp) === "Ativo"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {getStatus(emp)}
              </span>

            </div>

            {/* INFO */}
            <p className="text-slate-700 font-bold text-lg">
              R$ {Number(emp.valor_emprestimo).toFixed(2)}
            </p>

            <p className="text-slate-500 text-sm">
              Parcelas: {emp.num_parcelas}
            </p>

            <p className="text-slate-500 text-sm">
              Juros: {emp.juros}%
            </p>

            <p className="text-slate-500 text-sm">
              Tipo: {emp.tipo_juros}
            </p>

            {/* DATA */}
            <p className="text-slate-400 text-xs mt-2">
              {new Date(emp.data_emprestimo).toLocaleDateString()}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}

export default EmprestimosDoCliente;