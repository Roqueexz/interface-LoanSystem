import type { JSX } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../../components/Layout/Layout";
import DetalhesEmprestimo from "../../../components/Emprestimo/DetalhesEmprestimo/DetalhesEmprestimo";
import ListaParcelas from "../../../components/Parcela/ListaParcelas/ListaParcelas";

function PDetalhesEmprestimo(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const id_emprestimo = Number(id);

  return (
    <Layout>
      <div className="w-full min-h-full bg-slate-50">
        <DetalhesEmprestimo id_emprestimo={id_emprestimo} />
        
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Parcelas do Empréstimo</h2>
          <ListaParcelas id_emprestimo={id_emprestimo} />
        </div>
      </div>
    </Layout>
  );
}

export default PDetalhesEmprestimo;