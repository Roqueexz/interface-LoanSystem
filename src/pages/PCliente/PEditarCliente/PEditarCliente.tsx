import type { JSX } from "react";

import Layout from "../../../components/Layout/Layout";
import FormEditarCliente from "../../../components/Formularios/FormEditarCliente/FormEditarCliente";

function PEditarCliente(): JSX.Element {
  return (
    <Layout>
      <div className="w-full min-h-full bg-slate-50">
        <FormEditarCliente />
      </div>
    </Layout>
  );
}

export default PEditarCliente;