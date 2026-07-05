import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import type EmprestimoDTO from "../../../interface/EmprestimoDTO";

interface Props {
  id_cliente: number;
  onRefresh: () => void;
}

function EmprestimosDoCliente({ id_cliente }: Props) {
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

  const formatarMoeda = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (loading) {
    return <p className="text-muted-foreground">Carregando emprestimos...</p>;
  }

  if (erro) {
    return <p className="text-red-500 dark:text-red-400">{erro}</p>;
  }

  if (emprestimos.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 text-center shadow-sm">
        <p className="text-muted-foreground">Nenhum empréstimo encontrado.</p>
        <button
          onClick={() => navigate(`/emprestimos/novo?cliente=${id_cliente}`)}
          className="mt-4 inline-flex items-center gap-2 text-sm bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded-xl font-medium transition-all"
        >
          <Plus size={16} />
          Criar Empréstimo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-foreground">Empréstimos do Cliente</h2>

      {emprestimos.map((emp) => (
        <div
          key={emp.id_emprestimo}
          className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary/30"
          onClick={() => navigate(`/emprestimos/${emp.id_emprestimo}`)}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-foreground">
                Empréstimo #{emp.id_emprestimo}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatarMoeda(emp.valor_emprestimo)} - {emp.num_parcelas} parcelas
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                emp.status_emprestimo
                  ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                  : "bg-muted text-muted-foreground border border-border"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${emp.status_emprestimo ? "bg-emerald-500" : "bg-muted-foreground"}`} />
              {emp.status_emprestimo ? "Ativo" : "Liquidado"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EmprestimosDoCliente;