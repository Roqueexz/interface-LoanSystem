import { useState } from "react";

import ResumoCaixa from "../ResumoCaixa/ResumoCaixa";
import RelatorioDiario from "../RelatorioDiario/RelatorioDiario";
import RelatorioMensal from "../RelatorioMensal/RelatorioMensal";
import RelatorioAnual from "../RelatorioAnual/RelatorioAnual";
import CaixaPessoal from "../CaixaPessoal/CaixaPessoal";

type AbaType =
  | "resumo"
  | "diario"
  | "mensal"
  | "anual"
  | "pessoal";

function DashboardCaixa() {
  const [abaAtiva, setAbaAtiva] = useState<AbaType>("resumo");

  const abas: { id: AbaType; label: string }[] = [
    { id: "resumo", label: "Resumo" },
    { id: "diario", label: "Diário" },
    { id: "mensal", label: "Mensal" },
    { id: "anual", label: "Anual" },
    { id: "pessoal", label: "Pessoal" },
  ];

  return (
    <div className="w-full min-h-full bg-background py-8 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">
          Dashboard Financeiro
        </h1>

        {/* Navegação por abas */}
        <div className="flex flex-wrap gap-2 mb-6 bg-card rounded-xl border border-border p-1 transition-colors">
          {abas.map((aba) => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                abaAtiva === aba.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {aba.label}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="space-y-6">
          {abaAtiva === "resumo" && <ResumoCaixa />}
          {abaAtiva === "diario" && <RelatorioDiario />}
          {abaAtiva === "mensal" && <RelatorioMensal />}
          {abaAtiva === "anual" && <RelatorioAnual />}
          {abaAtiva === "pessoal" && <CaixaPessoal />}
        </div>
      </div>
    </div>
  );
}

export default DashboardCaixa;