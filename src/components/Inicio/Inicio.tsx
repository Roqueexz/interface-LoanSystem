import { useNavigate } from "react-router-dom";
import {
  Users,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart3,
  ArrowRight,
  DollarSign,
  Wallet,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import CaixaRequests from "../../fetch/CaixaRequests";
import { formatarMoeda } from "../../services/Utilitario";

function Inicio() {
  const navigate = useNavigate();

  const [resumo, setResumo] = useState({
    totalEmprestado: 0,
    totalRecebido: 0,
    entradaPendente: 0,
  });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarResumo() {
      try {
        const dados = await CaixaRequests.obterResumoFinanceiro();
        if (dados) {
          setResumo({
            totalEmprestado: dados.totalEmprestado,
            totalRecebido: dados.totalRecebido,
            entradaPendente: dados.entradaPendente,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar resumo:", error);
      } finally {
        setCarregando(false);
      }
    }
    carregarResumo();
  }, []);

  const funcionalidades = [
    {
      icon: <Users size={28} className="text-indigo-600" />,
      titulo: "Gestão de Clientes",
      descricao: "Cadastre e gerencie clientes de forma simples e organizada.",
    },
    {
      icon: <CreditCard size={28} className="text-blue-600" />,
      titulo: "Controle de Empréstimos",
      descricao: "Registre empréstimos e acompanhe todas as operações.",
    },
    {
      icon: <BarChart3 size={28} className="text-emerald-600" />,
      titulo: "Relatórios",
      descricao: "Visualize informações importantes para tomada de decisão.",
    },
    {
      icon: <ShieldCheck size={28} className="text-purple-600" />,
      titulo: "Segurança",
      descricao: "Armazenamento seguro das informações cadastradas.",
    },
    {
      icon: <Zap size={28} className="text-amber-600" />,
      titulo: "Produtividade",
      descricao: "Interface rápida e intuitiva para o dia a dia.",
    },
    {
      icon: <TrendingUp size={28} className="text-rose-600" />,
      titulo: "Cálculo de Juros",
      descricao: "Juros simples e compostos calculados automaticamente.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
            <div className="lg:max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Sistema em funcionamento
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-4">
                Gerencie seus <br />
                <span className="text-indigo-200">Empréstimos</span> com Facilidade
              </h1>
              <p className="text-lg text-indigo-100 max-w-xl mb-8">
                Controle total de clientes, empréstimos e parcelas em um só lugar.
                Simples, rápido e seguro.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate("/clientes/novo")}
                  className="bg-white text-indigo-700 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                >
                  <Users size={20} />
                  Novo Cliente
                </button>
                <button
                  onClick={() => navigate("/emprestimos/novo")}
                  className="bg-indigo-500/30 backdrop-blur-sm text-white px-8 py-3.5 rounded-xl font-bold border border-white/30 hover:bg-indigo-500/40 transition-all flex items-center gap-2"
                >
                  <CreditCard size={20} />
                  Novo Empréstimo
                </button>
              </div>
            </div>

            {/* Cards de resumo rápido */}
            <div className="mt-10 lg:mt-0 grid grid-cols-1 gap-4 w-full lg:w-80">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-400/20 rounded-xl">
                    <DollarSign size={20} className="text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-200 font-medium">Total Emprestado</p>
                    <p className="text-xl font-bold">
                      {carregando ? "..." : formatarMoeda(resumo.totalEmprestado)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-400/20 rounded-xl">
                    <TrendingUp size={20} className="text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-200 font-medium">Total Recebido</p>
                    <p className="text-xl font-bold">
                      {carregando ? "..." : formatarMoeda(resumo.totalRecebido)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-400/20 rounded-xl">
                    <Clock size={20} className="text-amber-300" />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-200 font-medium">A Receber</p>
                    <p className="text-xl font-bold">
                      {carregando ? "..." : formatarMoeda(resumo.entradaPendente)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ações rápidas */}
      <section className="max-w-6xl mx-auto px-6 -mt-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate("/clientes")}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all text-left group border border-slate-100"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-all">
                <Users size={28} className="text-indigo-600" />
              </div>
              <ArrowRight size={20} className="text-slate-300 group-hover:text-indigo-600 transition-all" />
            </div>
            <h3 className="text-lg font-bold mt-4">Clientes</h3>
            <p className="text-slate-500 text-sm">Visualizar e gerenciar clientes cadastrados.</p>
          </button>

          <button
            onClick={() => navigate("/emprestimos")}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all text-left group border border-slate-100"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-all">
                <CreditCard size={28} className="text-blue-600" />
              </div>
              <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-all" />
            </div>
            <h3 className="text-lg font-bold mt-4">Empréstimos</h3>
            <p className="text-slate-500 text-sm">Visualizar e gerenciar empréstimos registrados.</p>
          </button>

          <button
            onClick={() => navigate("/caixa")}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all text-left group border border-slate-100"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-all">
                <Wallet size={28} className="text-emerald-600" />
              </div>
              <ArrowRight size={20} className="text-slate-300 group-hover:text-emerald-600 transition-all" />
            </div>
            <h3 className="text-lg font-bold mt-4">Caixa</h3>
            <p className="text-slate-500 text-sm">Dashboard financeiro com relatórios completos.</p>
          </button>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800">Funcionalidades</h2>
          <p className="text-slate-500 mt-2">Tudo que você precisa para gerenciar seus empréstimos</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {funcionalidades.map((item) => (
            <div
              key={item.titulo}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all hover:border-indigo-200 group"
            >
              <div className="p-3 bg-slate-50 rounded-xl w-fit group-hover:bg-indigo-50 transition-all">
                {item.icon}
              </div>
              <h3 className="font-bold mt-4 mb-2 text-slate-800">{item.titulo}</h3>
              <p className="text-slate-500 text-sm">{item.descricao}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Inicio;