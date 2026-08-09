import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import ResumoCaixa from "../ResumoCaixa/ResumoCaixa";
import CaixaPessoal from "../CaixaPessoal/CaixaPessoal";

type AbaType = "resumo" | "pessoal";

function DashboardCaixa() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [abaAtiva, setAbaAtiva] = useState<AbaType>(() => (tabParam === "pessoal" ? "pessoal" : "resumo"));

  useEffect(() => {
    if (tabParam === "pessoal") {
      setAbaAtiva("pessoal");
    }
  }, [tabParam]);

  const abas: { id: AbaType; label: string }[] = [
    { id: "resumo", label: "Resumo & Fluxo" },
    { id: "pessoal", label: "Caixa Pessoal & Caixinhas" },
  ];

  return (
    <div className="w-full min-h-full bg-background py-6 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              Dashboard Financeiro
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Gestão de caixa, fluxo de empréstimos e reservas pessoais.
            </p>
          </div>

          {/* Navegação por abas principais (Resumo e Pessoal) */}
          <div className="flex bg-muted/60 p-1 rounded-2xl border border-border self-start sm:self-auto">
            {abas.map((aba) => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  abaAtiva === aba.id
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {aba.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="space-y-6">
          {abaAtiva === "resumo" && <ResumoCaixa />}
          {abaAtiva === "pessoal" && <CaixaPessoal />}
        </div>
      </div>
    </div>
  );
}

export default DashboardCaixa;