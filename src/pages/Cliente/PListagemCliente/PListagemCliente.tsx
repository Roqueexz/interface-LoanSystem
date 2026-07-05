import type { JSX } from "react";
import Layout from "../../../components/Layout/Layout";
import ListagemCliente from "../../../components/Cliente/ListagemCliente/ListagemCliente";

function PListagemCliente(): JSX.Element {
  return (
    <Layout>
        <ListagemCliente />
    </Layout>
  );
}

export default PListagemCliente;