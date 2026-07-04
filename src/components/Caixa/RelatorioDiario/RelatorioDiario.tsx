import { useState, useEffect } from "react";
import { Calendar, TrendingUp, TrendingDown, Clock, AlertCircle, Loader2 } from "lucide-react";
import CaixaRequests from "../../../fetch/CaixaRequests";

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

  const formatarMoeda = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const dataFormatada = relatorio?.data
    ? new Date(relatorio.data).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      {/* Cabeçalho com seletor de data */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Relatório Diário</h2>
          <p className="text-sm text-slate-400">
            {carregando ? "Carregando..." : dataFormatada}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-slate-400" />
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
          />
        </div>
      </div>

      {/* Estados de carregamento/erro */}
      {carregando && (
        <div className="flex items-center justify-center py-8 text-slate-400">
          <Loader2 className="animate-spin mr-2" size={20} />
          Carregando...
        </div>
      )}

      {erro && (
        <div className="flex items-center justify-center py-8 text-red-500">
          <AlertCircle size={20} className="mr-2" />
          {erro}
        </div>
      )}

      {/* Cards do relatório */}
      {!carregando && !erro && relatorio && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-emerald-50 rounded-xl p-4 text-center">
            <p className="text-xs text-emerald-600 font-medium mb-1">Recebido</p>
            <p className="text-xl font-bold text-emerald-700">
              {formatarMoeda(relatorio.recebido)}
            </p>
          </div>

          <div className="bg-indigo-50 rounded-xl p-4 text-center">
            <p className="text-xs text-indigo-600 font-medium mb-1">Emprestado</p>
            <p className="text-xl font-bold text-indigo-700">
              {formatarMoeda(relatorio.emprestado)}
            </p>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 text-center">
            <p className="text-xs text-amber-600 font-medium mb-1">Vencem Hoje</p>
            <p className="text-xl font-bold text-amber-700">
              {relatorio.parcelasVencendo}
            </p>
          </div>

          <div className="bg-red-50 rounded-xl p-4 text-center">
            <p className="text-xs text-red-600 font-medium mb-1">Em Atraso</p>
            <p className="text-xl font-bold text-red-700">
              {relatorio.parcelasAtrasadas}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RelatorioDiario;