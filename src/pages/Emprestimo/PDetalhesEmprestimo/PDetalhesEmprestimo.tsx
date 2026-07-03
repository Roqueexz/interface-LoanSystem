import type { JSX } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../../components/Layout/Layout";
import DetalhesEmprestimo from "../../../components/Emprestimo/DetalhesEmprestimo/DetalhesEmprestimo";

function PDetalhesEmprestimo(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const idEmprestimo = Number(id);

  return (
    <Layout>
      <div className="w-full min-h-full bg-slate-50">
        <DetalhesEmprestimo id_emprestimo={idEmprestimo} />
      </div>
    </Layout>
  );
}

export default PDetalhesEmprestimo;