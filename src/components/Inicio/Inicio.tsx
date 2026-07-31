import { useNavigate } from "react-router-dom";
import {
  Users,
  CreditCard,
  Wallet,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  BarChart2,
  Bell,
  Shield,
  Activity,
} from "lucide-react";
import { useEffect, useState } from "react";
import CaixaRequests from "../../fetch/CaixaRequests";
import { formatarMoeda } from "../../services/Utilitario";

function Inicio() {
  const navigate = useNavigate();

  const isAuthenticated = localStorage.getItem("isAuth") === "true";

  const [resumo, setResumo] = useState({
    totalEmprestado: 0,
    totalRecebido: 0,
    entradaPendente: 0,
    totalAtrasado: 0,
    totalClientes: 0,
    totalEmprestimos: 0,
  });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarResumo() {
      if (!isAuthenticated) {
        setCarregando(false);
        return;
      }

      try {
        const dados = await CaixaRequests.obterResumoFinanceiro();
        if (dados) {
          setResumo({
            totalEmprestado: dados.totalEmprestado,
            totalRecebido: dados.totalRecebido,
            entradaPendente: dados.entradaPendente,
            totalAtrasado: dados.totalAtrasado || 0,
            totalClientes: dados.totalClientes || 0,
            totalEmprestimos: dados.totalEmprestimos || 0,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar resumo:", error);
      } finally {
        setCarregando(false);
      }
    }
    carregarResumo();
  }, [isAuthenticated]);

  const summaryCards = [
    {
      label: "Total Emprestado",
      value: formatarMoeda(resumo.totalEmprestado),
      sub: `${resumo.totalEmprestimos} empréstimos ativos`,
      icon: TrendingUp,
      color: "from-indigo-500 to-indigo-700",
    },
    {
      label: "Total Recebido",
      value: formatarMoeda(resumo.totalRecebido),
      sub: "Pagamentos realizados",
      icon: CheckCircle,
      color: "from-emerald-500 to-emerald-700",
    },
    {
      label: "A Receber",
      value: formatarMoeda(resumo.entradaPendente),
      sub: `${resumo.totalEmprestimos} empréstimos ativos`,
      icon: Clock,
      color: "from-amber-500 to-amber-600",
    },
    {
      label: "Em Atraso",
      value: formatarMoeda(resumo.totalAtrasado),
      sub: `${resumo.totalClientes} clientes inadimplentes`,
      icon: AlertTriangle,
      color: "from-red-500 to-red-700",
    },
  ];

  const quickActions = [
    {
      path: "/dashboard",
      icon: BarChart2,
      title: "Dashboard Inteligente",
      desc: "Visualize todos os indicadores financeiros",
      iconBg:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      path: "/clientes",
      icon: Users,
      title: "Clientes",
      desc: `${resumo.totalClientes} clientes cadastrados`,
      iconBg:
        "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    },
    {
      path: "/emprestimos",
      icon: CreditCard,
      title: "Empréstimos",
      desc: `${resumo.totalEmprestimos} empréstimos ativos`,
      iconBg:
        "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400",
    },
    {
      path: "/caixa",
      icon: Wallet,
      title: "Caixa",
      desc: "Ver relatórios financeiros",
      iconBg:
        "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    },
  ];

  const features = [
    {
      icon: Users,
      title: "Gestão de Clientes",
      desc: "Cadastre e gerencie seus clientes com facilidade. Mantenha histórico completo de cada devedor.",
    },
    {
      icon: CreditCard,
      title: "Controle de Parcelas",
      desc: "Acompanhe parcelas, vencimentos e status de pagamento em tempo real com visualização clara.",
    },
    {
      icon: BarChart2,
      title: "Relatórios Detalhados",
      desc: "Visualize seu fluxo de caixa com relatórios diários, mensais e anuais em gráficos interativos.",
    },
    {
      icon: Bell,
      title: "Alertas de Atraso",
      desc: "Identifique rapidamente pagamentos atrasados e tome ações preventivas antes da inadimplência.",
    },
    {
      icon: Shield,
      title: "Dados Seguros",
      desc: "Suas informações financeiras protegidas com segurança de nível bancário e backups automáticos.",
    },
    {
      icon: Activity,
      title: "Histórico Completo",
      desc: "Acesse o histórico completo de cada empréstimo, pagamento e movimentação do seu negócio.",
    },
  ];

  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero */}
      <div
        className="relative rounded-2xl overflow-hidden p-8 md:p-12"
        style={{
          background:
            "linear-gradient(135deg, #4338ca 0%, #4f46e5 40%, #2563eb 100%)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-10 -right-10 w-80 h-80 rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, #ffffff 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 left-1/2 w-64 h-64 rounded-full opacity-[0.06]"
            style={{
              background:
                "radial-gradient(circle, #a5b4fc 0%, transparent 70%)",
            }}
          />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 text-xs font-semibold"
            style={{ background: "rgba(255,255,255,0.15)", color: "#e0e7ff" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Sistema Ativo — {dataAtual}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Bem-vindo ao LoanSystem
          </h1>
          <p className="text-indigo-200 text-lg mb-8 leading-relaxed">
            Gerencie seus empréstimos com segurança e eficiência. Controle
            clientes, parcelas e fluxo de caixa em um só lugar.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{ background: "#ffffff", color: "#4338ca" }}
            >
              📊 Dashboard Inteligente
            </button>
            <button
              onClick={() => navigate("/emprestimos/novo")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.12)",
                color: "#ffffff",
                borderColor: "rgba(255,255,255,0.3)",
              }}
            >
              + Novo Empréstimo
            </button>
            <button
              onClick={() => navigate("/clientes")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.12)",
                color: "#ffffff",
                borderColor: "rgba(255,255,255,0.3)",
              }}
            >
              Gerenciar Clientes
            </button>
          </div>
        </div>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-card rounded-2xl border border-border shadow-sm p-5 overflow-hidden relative group hover:shadow-md transition-shadow"
          >
            <div
              className="absolute top-0 right-0 w-24 h-24 opacity-[0.04] rounded-bl-full"
              style={{
                background: `linear-gradient(135deg, ${card.color.split("-")[1] === "indigo" ? "#4f46e5" : card.color.split("-")[1] === "emerald" ? "#10b981" : card.color.split("-")[1] === "amber" ? "#f59e0b" : "#ef4444"} 0%, transparent 100%)`,
              }}
            />
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-white bg-gradient-to-br ${card.color}`}
            >
              <card.icon size={18} />
            </div>
            <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
              {card.label}
            </p>
            <p className="text-xl font-bold text-foreground">
              {carregando ? "..." : card.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick access cards */}
      <div>
        <h2 className="text-base font-bold text-foreground mb-4">
          Acesso Rápido
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="bg-card rounded-2xl border border-border shadow-sm p-6 text-left hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all group"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${item.iconBg}`}
              >
                <item.icon size={22} />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="font-bold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <ChevronRight
                  size={18}
                  className="text-muted-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all"
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Features grid */}
      <div>
        <h2 className="text-base font-bold text-foreground mb-4">
          Funcionalidades do Sistema
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-card rounded-2xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <f.icon size={20} />
              </div>
              <h3 className="font-bold text-foreground text-sm mb-2">
                {f.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Inicio;
