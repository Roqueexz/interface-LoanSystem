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
  Users,
  Briefcase,
  Clock,
} from "lucide-react";

import CaixaRequests from "../../../fetch/CaixaRequests";
import type CaixaDTO from "../../../interface/CaixaDTO";
import ModalParcelasAtrasadas from "../ModalParcelasAtrasadas/ModalParcelasAtrasadas";
import { SkeletonCaixaCards } from "../../Skeleton";

function ResumoCaixa() {
  const navigate = useNavigate();

  const [resumo, setResumo] = useState<CaixaDTO | undefined>(undefined);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Estado para o modal
  const [modalAtrasadasOpen, setModalAtrasadasOpen] = useState(false);

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

  if (carregando) {
    return <SkeletonCaixaCards />;
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
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
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

        {/* Cards Financeiros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
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

          {/* A Receber */}
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

          {/* Em Atraso - INTERATIVO */}
          <button
            onClick={() => setModalAtrasadasOpen(true)}
            className="bg-white rounded-2xl shadow-sm border-2 border-red-100 p-6 flex flex-col gap-4 hover:shadow-md hover:border-red-300 transition-all cursor-pointer text-left w-full"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                <Clock size={24} />
              </div>
              <h2 className="text-sm font-semibold text-slate-600">Em Atraso</h2>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {formatarMoeda(resumo.totalAtrasado)}
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              Clique para ver detalhes →
            </p>
          </button>

        </div>

        {/* Cards de Metricas (clientes e emprestimos) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Clientes Ativos</p>
              <p className="text-2xl font-bold text-slate-800">{resumo.totalClientes}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Empréstimos Ativos</p>
              <p className="text-2xl font-bold text-slate-800">{resumo.totalEmprestimos}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ModalParcelasAtrasadas
        isOpen={modalAtrasadasOpen}
        onClose={() => setModalAtrasadasOpen(false)}
      />
    </div>
  );
}

export default ResumoCaixa;