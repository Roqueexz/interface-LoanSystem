import type { JSX } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../../components/Layout/Layout";
import DetalhesEmprestimo from "../../../components/Emprestimo/DetalhesEmprestimo/DetalhesEmprestimo";
import ListaParcelas from "../../../components/Parcela/ListaParcelas/ListaParcelas";

function PDetalhesEmprestimo(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const id_emprestimo = Number(id);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleAtualizarDetalhes() {
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <Layout>
      <DetalhesEmprestimo id_emprestimo={id_emprestimo} refreshTrigger={refreshKey} />
      <ListaParcelas id_emprestimo={id_emprestimo} onAtualizar={handleAtualizarDetalhes} />
    </Layout>
  );
}

export default PDetalhesEmprestimo;