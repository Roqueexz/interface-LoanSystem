import type { JSX } from "react";

import Layout from "../../../components/Layout/Layout";
import FormEditarCliente from "../../../components/Cliente/FormEditarCliente/FormEditarCliente";

function PEditarCliente(): JSX.Element {
  return (
    <Layout>
        <FormEditarCliente />
    </Layout>
  );
}

export default PEditarCliente;