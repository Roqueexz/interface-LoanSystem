import type { JSX } from "react";
import Layout from "../../../components/Layout/Layout";
import ListagemCliente from "../../../components/Listagens/ListagemCliente/ListagemCliente";

function PListagemCliente(): JSX.Element {
  return (
    <Layout>
      <div className="w-full min-h-full bg-slate-50">
        <ListagemCliente />
      </div>
    </Layout>
  );
}

export default PListagemCliente;