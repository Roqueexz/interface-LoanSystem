import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  Landmark,
  Clock,
  XCircle,
  ArrowLeft,
} from "lucide-react";

import CaixaRequests from "../../../fetch/CaixaRequests";
import type CaixaDTO from "../../../interface/CaixaDTO";
import { SkeletonCaixaCards } from "../../../ui/Skeleton";
import { formatarMoeda } from "../../../services/Utilitario";

function ResumoCaixa() {
  const navigate = useNavigate();

  const [resumo, setResumo] = useState<CaixaDTO | undefined>(undefined);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

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
          onClick={() => navigate("/")}
          className="text-sm text-primary hover:underline"
        >
          Voltar para o Início
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Caixa</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Visão financeira completa do seu negócio
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
      </div>

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

      {/* Relatorio Diario - Placeholder para futura implementacao */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="flex items-center gap-1 p-4 border-b border-border bg-muted/30">
          <button className="px-4 py-2 rounded-xl text-sm font-semibold text-primary-foreground shadow-sm" style={{ background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)" }}>
            Relatório Diário
          </button>
          <button className="px-4 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            Relatório Mensal
          </button>
          <button className="px-4 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            Relatório Anual
          </button>
        </div>

        <div className="p-6 text-center py-12 text-muted-foreground">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={28} className="text-muted-foreground/50" />
          </div>
          <p className="font-semibold text-foreground mb-1">Movimentações do Dia</p>
          <p className="text-sm">Em breve você poderá ver todas as movimentações do dia aqui.</p>
        </div>
      </div>
    </div>
  );
}

export default ResumoCaixa;