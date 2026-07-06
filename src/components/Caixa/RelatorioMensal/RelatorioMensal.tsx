import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import CaixaRequests from "../../../fetch/CaixaRequests";
import GraficoMensal from "../GraficoMensal/GraficoMensal";
import { formatarMoeda } from "../../../services/Utilitario";
import { SkeletonCaixaCards } from "../../../ui/Skeleton";

function RelatorioMensal() {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth() + 1);

  const [relatorio, setRelatorio] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [dadosGrafico, setDadosGrafico] = useState<any[]>([]);

  useEffect(() => {
    carregarRelatorio();
  }, [ano, mes]);

  useEffect(() => {
    async function carregarGrafico() {
      const dados = await CaixaRequests.obterRelatorioAnual(ano);
      if (dados) {
        setDadosGrafico(dados);
      }
    }
    carregarGrafico();
  }, [ano]);

  async function carregarRelatorio() {
    setCarregando(true);
    setErro(null);

    try {
      const dados = await CaixaRequests.obterRelatorioMensal(ano, mes);
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

  const nomeMes = new Date(ano, mes - 1).toLocaleDateString("pt-BR", {
    month: "long",
  });

  if (carregando) {
    return <SkeletonCaixaCards />;
  }

  return (
    <div className="space-y-6">
      {/* Card do relatório mensal */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        {/* Cabeçalho com seletores */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">Relatório Mensal</h2>
            <p className="text-sm text-muted-foreground">{`${nomeMes} ${ano}`}</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={mes}
              onChange={(e) => setMes(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(ano, m - 1).toLocaleDateString("pt-BR", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>

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

        {/* Cards do relatório mensal */}
        {!erro && relatorio && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4 text-center border border-emerald-200 dark:border-emerald-500/20">
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">Recebido</p>
              <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                {formatarMoeda(relatorio.recebido)}
              </p>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-xl p-4 text-center border border-indigo-200 dark:border-indigo-500/20">
              <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">Emprestado</p>
              <p className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
                {formatarMoeda(relatorio.emprestado)}
              </p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-4 text-center border border-amber-200 dark:border-amber-500/20">
              <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">Crescimento</p>
              <div className="flex items-center justify-center gap-1">
                {relatorio.crescimento >= 0 ? (
                  <TrendingUp size={18} className="text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <TrendingDown size={18} className="text-red-600 dark:text-red-400" />
                )}
                <p
                  className={`text-xl font-bold ${
                    relatorio.crescimento >= 0
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-red-700 dark:text-red-400"
                  }`}
                >
                  {relatorio.crescimento.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gráfico anual */}
      {dadosGrafico.length > 0 && (
        <GraficoMensal
          dados={dadosGrafico}
          titulo={`Evolução Anual - ${ano}`}
        />
      )}
    </div>
  );
}

export default RelatorioMensal;