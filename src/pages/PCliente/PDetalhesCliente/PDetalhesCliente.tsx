import type { JSX } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../../components/Layout/Layout";
import DetalhesCliente from "../../../components/Detalhes/DetalhesCliente/DetalhesCliente";

function PDetalhesCliente(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const idCliente = Number(id);

  return (
    <Layout>
      <div className="w-full min-h-full bg-slate-50">
        <DetalhesCliente id_cliente={idCliente} />
      </div>
    </Layout>
  );
}

export default PDetalhesCliente;