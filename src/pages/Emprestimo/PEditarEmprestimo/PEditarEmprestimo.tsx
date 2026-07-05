import type { JSX } from "react";
import Layout from "../../../components/Layout/Layout";
import FormEditarEmprestimo from "../../../components/Emprestimo/FormEditarEmprestimo/FormEditarEmprestimo";

function PEditarEmprestimo(): JSX.Element {
  return (
    <Layout>
      <FormEditarEmprestimo />
    </Layout>
  );
}

export default PEditarEmprestimo;