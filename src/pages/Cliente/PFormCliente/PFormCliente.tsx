import type { JSX } from "react";
import Layout from "../../../components/Layout/Layout";
import FormCliente from "../../../components/Cliente/FormCliente/FormCliente";

function PFormCliente(): JSX.Element {
  return (
    <Layout>
      <div className="w-full min-h-full bg-slate-50">
        <FormCliente />
      </div>
    </Layout>
  );
}

export default PFormCliente;