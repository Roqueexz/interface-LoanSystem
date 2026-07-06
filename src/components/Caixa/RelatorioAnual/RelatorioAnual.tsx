import { useState, useEffect } from "react";
import { Calendar, AlertCircle } from "lucide-react";
import CaixaRequests from "../../../fetch/CaixaRequests";
import GraficoMensal from "../GraficoMensal/GraficoMensal";
import { formatarMoeda } from "../../../services/Utilitario";
import { SkeletonCaixaCards } from "../../../ui/Skeleton";

function RelatorioAnual() {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());

  const [relatorio, setRelatorio] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    carregarRelatorio();
  }, [ano]);

  async function carregarRelatorio() {
    setCarregando(true);
    setErro(null);

    try {
      const dados = await CaixaRequests.obterRelatorioAnual(ano);
      if (dados) {
        setRelatorio(dados);
      } else {
        setErro("Não foi possível carregar o relatório.");
      }
    } catch {
      setErro("Erro ao carregar relatório.");
    } finally {
      setCarregando(false);
    }
  }

  const totalRecebido = relatorio.reduce((acc, r) => acc + r.recebido, 0);
  const totalEmprestado = relatorio.reduce((acc, r) => acc + r.emprestado, 0);
  const totalLucro = relatorio.reduce((acc, r) => acc + r.lucro, 0);

  if (carregando) {
    return <SkeletonCaixaCards />;
  }

  return (
    <div className="space-y-6">
      {/* Card do relatório anual */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">Relatório Anual</h2>
            <p className="text-sm text-muted-foreground">{`Ano ${ano}`}</p>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-muted-foreground" />
            <select
              value={ano}
              onChange={(e) => setAno(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            >
              {Array.from({ length: 5 }, (_, i) => hoje.getFullYear() - i).map(
                (a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {/* Estado de erro */}
        {erro && (
          <div className="flex items-center justify-center py-8 text-red-500 dark:text-red-400">
            <AlertCircle size={20} className="mr-2" />
            {erro}
          </div>
        )}

        {/* Totais do ano */}
        {!erro && relatorio.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4 text-center border border-emerald-200 dark:border-emerald-500/20">
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
                Total Recebido
              </p>
              <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                {formatarMoeda(totalRecebido)}
              </p>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-xl p-4 text-center border border-indigo-200 dark:border-indigo-500/20">
              <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                Total Emprestado
              </p>
              <p className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
                {formatarMoeda(totalEmprestado)}
              </p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-4 text-center border border-amber-200 dark:border-amber-500/20">
              <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">Lucro</p>
              <p className="text-xl font-bold text-amber-700 dark:text-amber-400">
                {formatarMoeda(totalLucro)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Gráfico */}
      {relatorio.length > 0 && (
        <GraficoMensal dados={relatorio} titulo={`Mensal - ${ano}`} />
      )}
    </div>
  );
}

export default RelatorioAnual;