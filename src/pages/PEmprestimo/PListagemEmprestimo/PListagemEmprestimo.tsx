import type { JSX } from "react";
import Layout from "../../../components/Layout/Layout";
import ListagemEmprestimo from "../../../components/Emprestimo/ListagemEmprestimo/ListagemEmprestimo";

function PListagemEmprestimo(): JSX.Element {
  return (
    <Layout>
      <div className="w-full min-h-full bg-slate-50">
        <ListagemEmprestimo />
      </div>
    </Layout>
  );
}

export default PListagemEmprestimo;