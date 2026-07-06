import { useState, useEffect } from "react";
import { Calendar, AlertCircle } from "lucide-react";
import CaixaRequests from "../../../fetch/CaixaRequests";
import { formatarMoeda } from "../../../services/Utilitario";
import { SkeletonCaixaCards } from "../../../ui/Skeleton";

function RelatorioDiario() {
  const [data, setData] = useState(() => {
    const hoje = new Date();
    return hoje.toISOString().split("T")[0];
  });

  const [relatorio, setRelatorio] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    carregarRelatorio();
  }, [data]);

  async function carregarRelatorio() {
    setCarregando(true);
    setErro(null);

    try {
      const dados = await CaixaRequests.obterRelatorioDiario(data);
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

  const dataFormatada = relatorio?.data
    ? new Date(relatorio.data).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  if (carregando) {
    return <SkeletonCaixaCards />;
  }

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
      {/* Cabeçalho com seletor de data */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">Relatório Diário</h2>
          <p className="text-sm text-muted-foreground">
            {dataFormatada || "Selecione uma data"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-muted-foreground" />
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Estado de erro */}
      {erro && (
        <div className="flex items-center justify-center py-8 text-red-500 dark:text-red-400">
          <AlertCircle size={20} className="mr-2" />
          {erro}
        </div>
      )}

      {/* Cards do relatório */}
      {!erro && relatorio && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">Vencem Hoje</p>
            <p className="text-xl font-bold text-amber-700 dark:text-amber-400">
              {relatorio.parcelasVencendo}
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-500/10 rounded-xl p-4 text-center border border-red-200 dark:border-red-500/20">
            <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">Em Atraso</p>
            <p className="text-xl font-bold text-red-700 dark:text-red-400">
              {relatorio.parcelasAtrasadas}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RelatorioDiario;