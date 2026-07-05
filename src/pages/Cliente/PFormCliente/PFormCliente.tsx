import type { JSX } from "react";
import Layout from "../../../components/Layout/Layout";
import FormCliente from "../../../components/Cliente/FormCliente/FormCliente";

function PFormCliente(): JSX.Element {
  return (
    <Layout>
        <FormCliente />
    </Layout>
  );
}

export default PFormCliente;