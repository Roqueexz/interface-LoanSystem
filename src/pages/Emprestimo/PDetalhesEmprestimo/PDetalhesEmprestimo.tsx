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
      <DetalhesEmprestimo id_emprestimo={id_emprestimo} />
      <ListaParcelas id_emprestimo={id_emprestimo} />
    </Layout>
  );
}

export default PDetalhesEmprestimo;