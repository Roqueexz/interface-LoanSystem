import type { JSX } from "react";
import Layout from "../../../components/Layout/Layout";
import FormEditarEmprestimo from "../../../components/Emprestimo/FormEditarEmprestimo/FormEditarEmprestimo";

function PEditarEmprestimo(): JSX.Element {
  return (
    <Layout>
      <div className="w-full min-h-full bg-slate-50">
        <FormEditarEmprestimo />
      </div>
    </Layout>
  );
}

export default PEditarEmprestimo;
