import type { JSX } from "react";
import { useParams } from "react-router-dom";

import Layout from "../../../components/Layout/Layout";
import PainelCliente from "../../../components/Cliente/PainelCliente/PainelCliente";

function PCliente(): JSX.Element {
  const { id } = useParams<{ id: string }>();

  return (
    <Layout>
      <div className="w-full min-h-full bg-slate-50">
        <PainelCliente id_cliente={Number(id)} />
      </div>
    </Layout>
  );
}

export default PCliente;