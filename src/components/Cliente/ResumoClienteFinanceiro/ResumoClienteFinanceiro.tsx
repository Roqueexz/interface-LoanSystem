import { useEffect, useState } from "react";
import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import type EmprestimoDTO from "../../../interface/EmprestimoDTO";

interface Props {
  id_cliente: number;
}

function ResumoClienteFinanceiro({ id_cliente }: Props) {
  const [emprestimos, setEmprestimos] = useState<EmprestimoDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // CARREGAR DADOS
  // -----------------------------
  async function carregar() {
    setLoading(true);

    const dados = await EmprestimoRequests.obterListaDeEmprestimos();

    if (dados) {
      const filtrados = dados.filter(
        (emp) => emp.id_cliente === id_cliente
      );

      setEmprestimos(filtrados);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (id_cliente) {
      carregar();
    }
  }, [id_cliente]);

  // -----------------------------
  // MÉTRICAS
  // -----------------------------
  const totalEmprestado = emprestimos.reduce(
    (acc, emp) => acc + Number(emp.valor_emprestimo),
    0
  );

  const totalAtivo = emprestimos
    .filter((emp) => emp.status_emprestimo)
    .reduce((acc, emp) => acc + Number(emp.valor_emprestimo), 0);

  const totalQuitado = emprestimos
    .filter((emp) => !emp.status_emprestimo)
    .reduce((acc, emp) => acc + Number(emp.valor_emprestimo), 0);

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="mt-6">

      <h2 className="text-xl font-bold text-slate-800 mb-4">
        Resumo Financeiro
      </h2>

      {loading && (
        <p className="text-slate-500">
          Calculando resumo...
        </p>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* TOTAL EMPRESTADO */}
          <div className="bg-white shadow-md rounded-xl p-4 border">
            <p className="text-slate-500 text-sm">
              Total Emprestado
            </p>
            <p className="text-2xl font-bold text-slate-800">
              R$ {totalEmprestado.toFixed(2)}
            </p>
          </div>

          {/* TOTAL ATIVO */}
          <div className="bg-white shadow-md rounded-xl p-4 border">
            <p className="text-slate-500 text-sm">
              Em Aberto
            </p>
            <p className="text-2xl font-bold text-yellow-600">
              R$ {totalAtivo.toFixed(2)}
            </p>
          </div>

          {/* TOTAL QUITADO */}
          <div className="bg-white shadow-md rounded-xl p-4 border">
            <p className="text-slate-500 text-sm">
              Quitado
            </p>
            <p className="text-2xl font-bold text-green-600">
              R$ {totalQuitado.toFixed(2)}
            </p>
          </div>

        </div>
      )}

    </div>
  );
}

export default ResumoClienteFinanceiro;