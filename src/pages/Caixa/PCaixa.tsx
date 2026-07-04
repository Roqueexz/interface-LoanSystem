import { useState, type JSX } from "react";
import Layout from "../../components/Layout/Layout";
import ResumoCaixa from "../../components/Caixa/ResumoCaixa/ResumoCaixa";
import RelatorioDiario from "../../components/Caixa/RelatorioDiario/RelatorioDiario";
import RelatorioMensal from "../../components/Caixa/RelatorioMensal/RelatorioMensal";
import RelatorioAnual from "../../components/Caixa/RelatorioAnual/RelatorioAnual";
import CaixaPessoal from "../../components/Caixa/CaixaPessoal/CaixaPessoal";

type AbaType = "resumo" | "diario" | "mensal" | "anual" | "pessoal";

function PCaixa(): JSX.Element {
  const [abaAtiva, setAbaAtiva] = useState<AbaType>("resumo");

  const abas: { id: AbaType; label: string }[] = [
    { id: "resumo", label: "Resumo" },
    { id: "diario", label: "Diário" },
    { id: "mensal", label: "Mensal" },
    { id: "anual", label: "Anual" },
    { id: "pessoal", label: "Pessoal" },
  ];

  return (
    <Layout>
      <div className="w-full min-h-full bg-slate-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Financeiro</h1>

          {/* Navegação por abas */}
          <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-xl p-1 border border-slate-100">
            {abas.map((aba) => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  abaAtiva === aba.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {aba.label}
              </button>
            ))}
          </div>

          {/* Conteúdo das abas */}
          <div className="space-y-6">
            {abaAtiva === "resumo" && <ResumoCaixa />}
            {abaAtiva === "diario" && <RelatorioDiario />}
            {abaAtiva === "mensal" && <RelatorioMensal />}
            {abaAtiva === "anual" && <RelatorioAnual />}
            {abaAtiva === "pessoal" && <CaixaPessoal />}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default PCaixa;