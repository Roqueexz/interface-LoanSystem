import { TrendingUp, TrendingDown, Lock, Banknote } from "lucide-react";
import CardResumo from "./CardResumo";
import type { ResumoCaixaPessoalDTO } from "../../../interface/CaixaPessoalDTO";

interface GridResumoProps {
  resumo: ResumoCaixaPessoalDTO;
}

// ============================================================
// GridResumo — organiza os 4 cards de resumo
// Isolado para manter o CaixaPessoal.tsx limpo.
// Sprint 4: novos cards poderão ser adicionados aqui
// sem modificar o orquestrador principal.
// ============================================================

function GridResumo({ resumo }: GridResumoProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <CardResumo
        titulo="Entradas"
        valor={resumo.entradas}
        icone={<TrendingUp size={18} />}
        corIcone="emerald"
      />
      <CardResumo
        titulo="Saídas"
        valor={resumo.saidas}
        icone={<TrendingDown size={18} />}
        corIcone="red"
      />
      <CardResumo
        titulo="Reservado"
        valor={resumo.reservado}
        icone={<Lock size={18} />}
        corIcone="amber"
      />
      <CardResumo
        titulo="Disponível"
        valor={resumo.disponivel}
        icone={<Banknote size={18} />}
        corIcone="indigo"
      />
    </div>
  );
}

export default GridResumo;