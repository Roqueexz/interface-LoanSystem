import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import type EmprestimoDTO from "../../../interface/EmprestimoDTO";

interface Props {
  id_cliente: number;
  onRefresh: () => void;
}

function EmprestimosDoCliente({ id_cliente, onRefresh }: Props) {
  const navigate = useNavigate();

  const [emprestimos, setEmprestimos] = useState<EmprestimoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarEmprestimos() {
    setLoading(true);
    setErro("");

    try {
      const lista = await EmprestimoRequests.obterListaDeEmprestimos();

      if (!lista) {
        setErro("Erro ao carregar emprestimos.");
        setLoading(false);
        return;
      }

      const filtrados = lista.filter(
        (emp: any) => emp.id_cliente === id_cliente
      );

      setEmprestimos(filtrados);
    } catch (err) {
      console.error(err);
      setErro("Erro inesperado ao carregar emprestimos.");
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarEmprestimos();
  }, [id_cliente]);

  if (loading) {
    return <p className="text-slate-500">Carregando emprestimos...</p>;
  }

  if (erro) {
    return <p className="text-red-500">{erro}</p>;
  }

  if (emprestimos.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
        <p className="text-slate-500">Nenhum emprestimo encontrado.</p>
        <button
          onClick={() => navigate(`/emprestimos/novo?cliente=${id_cliente}`)}
          className="mt-4 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all"
        >
          Criar Emprestimo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-slate-800">Emprestimos do Cliente</h2>

      {emprestimos.map((emp) => (
        <div
          key={emp.id_emprestimo}
          className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
          onClick={() => navigate(`/emprestimos/${emp.id_emprestimo}`)}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-slate-700">
                Emprestimo #{emp.id_emprestimo}
              </p>
              <p className="text-sm text-slate-500">
                R$ {emp.valor_emprestimo.toFixed(2)} - {emp.num_parcelas} parcelas
              </p>
            </div>

            <span
              className={`text-xs px-3 py-1 rounded-full ${
                emp.status_emprestimo
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {emp.status_emprestimo ? "Ativo" : "Liquidado"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EmprestimosDoCliente;