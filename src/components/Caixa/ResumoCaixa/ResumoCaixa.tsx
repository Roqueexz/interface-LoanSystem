import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  Landmark,
  CircleDollarSign,
  Loader2,
  XCircle,
} from "lucide-react";

import CaixaRequests from "../../../fetch/CaixaRequests";
import type CaixaDTO from "../../../interface/CaixaDTO";

function ResumoCaixa() {
  const navigate = useNavigate();

  const [resumo, setResumo] = useState<CaixaDTO | undefined>(undefined);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // ── Carrega dados do financeiro ──
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

  const formatarMoeda = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // ── Estados de carregamento / erro ──
  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-64 text-slate-400">
        <Loader2 className="animate-spin mr-2" size={20} />
        Carregando balanço financeiro...
      </div>
    );
  }

  if (erro || !resumo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-3 text-red-500">
        <XCircle size={32} />
        <p className="font-semibold">{erro}</p>
        <button
          onClick={() => navigate("/")}
          className="text-sm text-indigo-600 hover:underline"
        >
          Voltar para o Início
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho da página */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Balanço do Caixa</h1>
            <p className="text-slate-400 text-sm">Resumo geral das operações</p>
          </div>
        </div>

        {/* ── Cards de Métricas ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Total Emprestado */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-50 text-slate-600 rounded-xl">
                <Landmark size={24} />
              </div>
              <h2 className="text-sm font-semibold text-slate-600">Total Emprestado</h2>
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {formatarMoeda(resumo.totalEmprestado)}
            </p>
          </div>

          {/* Total Recebido */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <TrendingUp size={24} />
              </div>
              <h2 className="text-sm font-semibold text-slate-600">Total Recebido</h2>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              {formatarMoeda(resumo.totalRecebido)}
            </p>
          </div>

          {/* Entrada Pendente */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Wallet size={24} />
              </div>
              <h2 className="text-sm font-semibold text-slate-600">A Receber</h2>
            </div>
            <p className="text-2xl font-bold text-amber-500">
              {formatarMoeda(resumo.entradaPendente)}
            </p>
          </div>

          {/* Lucro Previsto */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <CircleDollarSign size={24} />
              </div>
              <h2 className="text-sm font-semibold text-slate-600">Lucro Previsto</h2>
            </div>
            <p className="text-2xl font-bold text-indigo-600">
              {formatarMoeda(resumo.lucroPrevisto)}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ResumoCaixa;