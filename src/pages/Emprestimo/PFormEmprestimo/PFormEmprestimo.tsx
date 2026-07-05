import type { JSX } from "react";
import Layout from "../../../components/Layout/Layout";
import FormEmprestimo from "../../../components/Emprestimo/FormEmprestimo/FormEmprestimo";

function PFormEmprestimo(): JSX.Element {
  return (
    <Layout>
      <FormEmprestimo />
    </Layout>
  );
}

export default PFormEmprestimo;