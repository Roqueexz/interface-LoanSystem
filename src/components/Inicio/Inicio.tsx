import { useNavigate } from "react-router-dom";
import {
  Users,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart3,
} from "lucide-react";

function Inicio() {
  const navigate = useNavigate();

  const funcionalidades = [
    {
      icon: <Users size={28} className="text-indigo-600" />,
      titulo: "Gestão de Clientes",
      descricao:
        "Cadastre e gerencie clientes de forma simples e organizada.",
    },
    {
      icon: <CreditCard size={28} className="text-blue-600" />,
      titulo: "Controle de Empréstimos",
      descricao:
        "Registre empréstimos e acompanhe todas as operações.",
    },
    {
      icon: <BarChart3 size={28} className="text-emerald-600" />,
      titulo: "Relatórios",
      descricao:
        "Visualize informações importantes para tomada de decisão.",
    },
    {
      icon: <ShieldCheck size={28} className="text-purple-600" />,
      titulo: "Segurança",
      descricao:
        "Armazenamento seguro das informações cadastradas.",
    },
    {
      icon: <Zap size={28} className="text-amber-600" />,
      titulo: "Produtividade",
      descricao:
        "Interface rápida e intuitiva para o dia a dia.",
    },
    {
      icon: <TrendingUp size={28} className="text-rose-600" />,
      titulo: "Cálculo de Juros",
      descricao:
        "Juros simples e compostos calculados automaticamente.",
    },
  ];

  return (
    <div className="bg-slate-50">

      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h1 className="text-5xl font-bold mb-6">
            LoanSystem
          </h1>

          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Sistema de gerenciamento de clientes e empréstimos.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

            <button
              onClick={() => navigate("/novo-cliente")}
              className="bg-white text-indigo-700 px-8 py-3 rounded-xl font-semibold"
            >
              Novo Cliente
            </button>

            <button
              onClick={() => navigate("/novo-emprestimo")}
              className="bg-indigo-500 px-8 py-3 rounded-xl font-semibold border border-white"
            >
              Novo Empréstimo
            </button>

          </div>
        </div>
      </section>

      {/* Ações rápidas */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-6">

          <button
            onClick={() => navigate("/clientes")}
            className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition text-left"
          >
            <Users className="mb-4 text-indigo-600" size={32} />
            <h3 className="text-xl font-bold">
              Clientes
            </h3>
            <p className="text-slate-500">
              Visualizar clientes cadastrados.
            </p>
          </button>

          <button
            onClick={() => navigate("/emprestimos")}
            className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition text-left"
          >
            <CreditCard className="mb-4 text-blue-600" size={32} />
            <h3 className="text-xl font-bold">
              Empréstimos
            </h3>
            <p className="text-slate-500">
              Visualizar empréstimos registrados.
            </p>
          </button>

        </div>
      </section>

      {/* Funcionalidades */}
      <section className="max-w-6xl mx-auto px-6 pb-16">

        <h2 className="text-3xl font-bold text-center mb-10">
          Funcionalidades
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {funcionalidades.map((item) => (
            <div
              key={item.titulo}
              className="bg-white p-6 rounded-2xl shadow"
            >
              {item.icon}

              <h3 className="font-bold mt-4 mb-2">
                {item.titulo}
              </h3>

              <p className="text-slate-500 text-sm">
                {item.descricao}
              </p>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
}

export default Inicio;