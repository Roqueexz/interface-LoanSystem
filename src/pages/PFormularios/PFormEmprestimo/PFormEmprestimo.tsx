import type { JSX } from "react";
import Layout from "../../../components/Layout/Layout";
import FormEmprestimo from "../../../components/Formularios/FormEmprestimo/FormEmprestimo";

function PFormEmprestimo(): JSX.Element {
  return (
    <Layout>
      <div className="w-full min-h-full bg-slate-50">
        <FormEmprestimo />
      </div>
    </Layout>
  );
}

export default PFormEmprestimo;