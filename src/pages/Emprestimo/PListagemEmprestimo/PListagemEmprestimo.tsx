import type { JSX } from "react";
import Layout from "../../../components/Layout/Layout";
import ListagemEmprestimo from "../../../components/Emprestimo/ListagemEmprestimo/ListagemEmprestimo";

function PListagemEmprestimo(): JSX.Element {
  return (
    <Layout>
        <ListagemEmprestimo />
    </Layout>
  );
}

export default PListagemEmprestimo;