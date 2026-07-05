import { useEffect, useState } from "react";
import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import type EmprestimoDTO from "../../../interface/EmprestimoDTO";

interface Props {
  id_cliente: number;
}

function ResumoClienteFinanceiro({ id_cliente }: Props) {
  const [emprestimos, setEmprestimos] = useState<EmprestimoDTO[]>([]);
  const [loading, setLoading] = useState(true);

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

  const formatarMoeda = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-foreground mb-4">
        Resumo Financeiro
      </h2>

      {loading && (
        <p className="text-muted-foreground">
          Calculando resumo...
        </p>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* TOTAL EMPRESTADO */}
          <div className="bg-card shadow-sm rounded-xl p-4 border border-border">
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
              Total Emprestado
            </p>
            <p className="text-2xl font-bold text-foreground">
              {formatarMoeda(totalEmprestado)}
            </p>
          </div>

          {/* TOTAL ATIVO */}
          <div className="bg-card shadow-sm rounded-xl p-4 border border-border">
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
              Em Aberto
            </p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {formatarMoeda(totalAtivo)}
            </p>
          </div>

          {/* TOTAL QUITADO */}
          <div className="bg-card shadow-sm rounded-xl p-4 border border-border">
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
              Quitado
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatarMoeda(totalQuitado)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumoClienteFinanceiro;