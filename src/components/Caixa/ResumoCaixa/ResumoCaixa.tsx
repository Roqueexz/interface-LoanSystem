import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  Landmark,
  Clock,
  XCircle,
  Calendar,
} from "lucide-react";

import CaixaRequests from "../../../fetch/CaixaRequests";
import type CaixaDTO from "../../../interface/CaixaDTO";
import { SkeletonCaixaCards } from "../../../ui/Skeleton";
import { formatarMoeda } from "../../../services/Utilitario";

import RelatorioDiario from "../RelatorioDiario/RelatorioDiario";
import RelatorioMensal from "../RelatorioMensal/RelatorioMensal";
import RelatorioAnual from "../RelatorioAnual/RelatorioAnual";

type PeriodoFiltro = "diario" | "mensal" | "anual";

function ResumoCaixa() {
  const navigate = useNavigate();

  const [resumo, setResumo] = useState<CaixaDTO | undefined>(undefined);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<PeriodoFiltro>("diario");

  useEffect(() => {
    const carregar = async () => {
      setCarregando(true);
      try {
        const dados = await CaixaRequests.obterResumoFinanceiro();
        if (!dados) {
          setErro("Não foi possível carregar o resumo financeiro.");
          return;
        }
        setResumo(dados);
      } catch {
        setErro("Erro ao conectar com o servidor.");
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, []);

  if (carregando) {
    return <SkeletonCaixaCards />;
  }

  if (erro || !resumo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-3 text-red-500 dark:text-red-400">
        <XCircle size={32} />
        <p className="font-semibold">{erro}</p>
        <button
          onClick={() => navigate("/inicio")}
          className="text-sm text-primary hover:underline"
        >
          Voltar para o Início
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Landmark size={18} />
            </div>
          </div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">Total Emprestado</p>
          <p className="text-xl font-bold text-foreground">
            {formatarMoeda(resumo.totalEmprestado)}
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">Total Recebido</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatarMoeda(resumo.totalRecebido)}
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Wallet size={18} />
            </div>
          </div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">A Receber</p>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
            {formatarMoeda(resumo.entradaPendente)}
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">Em Atraso</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">
            {formatarMoeda(resumo.totalAtrasado || 0)}
          </p>
        </div>
      </div>

      {/* Relatórios Filtrados por Período */}
      <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            <h2 className="text-base font-extrabold text-foreground">Relatório de Movimentações</h2>
          </div>

          <div className="flex bg-muted/60 p-1 rounded-2xl border border-border self-start sm:self-auto">
            {(["diario", "mensal", "anual"] as PeriodoFiltro[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriodo(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  periodo === p
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p === "diario" && "Diário"}
                {p === "mensal" && "Mensal"}
                {p === "anual" && "Anual"}
              </button>
            ))}
          </div>
        </div>

        {/* Exibe o relatório correspondente ao período selecionado */}
        <div>
          {periodo === "diario" && <RelatorioDiario />}
          {periodo === "mensal" && <RelatorioMensal />}
          {periodo === "anual" && <RelatorioAnual />}
        </div>
      </div>
    </div>
  );
}

export default ResumoCaixa;