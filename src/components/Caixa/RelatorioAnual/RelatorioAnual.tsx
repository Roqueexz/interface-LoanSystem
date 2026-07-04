import { useState, useEffect } from "react";
import { Calendar, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import CaixaRequests from "../../../fetch/CaixaRequests";
import GraficoMensal from "../GraficoMensal/GraficoMensal";

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

  const formatarMoeda = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // Totais do ano
  const totalRecebido = relatorio.reduce((acc, r) => acc + r.recebido, 0);
  const totalEmprestado = relatorio.reduce((acc, r) => acc + r.emprestado, 0);
  const totalLucro = relatorio.reduce((acc, r) => acc + r.lucro, 0);

  return (
    <div className="space-y-6">
      {/* Card do relatório anual */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Relatório Anual</h2>
            <p className="text-sm text-slate-400">
              {carregando ? "Carregando..." : `Ano ${ano}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-slate-400" />
            <select
              value={ano}
              onChange={(e) => setAno(Number(e.target.value))}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
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

        {/* Estados */}
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

        {/* Totais do ano */}
        {!carregando && !erro && relatorio.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <p className="text-xs text-emerald-600 font-medium mb-1">
                Total Recebido
              </p>
              <p className="text-xl font-bold text-emerald-700">
                {formatarMoeda(totalRecebido)}
              </p>
            </div>

            <div className="bg-indigo-50 rounded-xl p-4 text-center">
              <p className="text-xs text-indigo-600 font-medium mb-1">
                Total Emprestado
              </p>
              <p className="text-xl font-bold text-indigo-700">
                {formatarMoeda(totalEmprestado)}
              </p>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 text-center">
              <p className="text-xs text-amber-600 font-medium mb-1">Lucro</p>
              <p className="text-xl font-bold text-amber-700">
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