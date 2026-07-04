import type { JSX } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../../components/Layout/Layout";
import PainelCliente from "../../../components/Cliente/PainelCliente/PainelCliente";

function PCliente(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const id_cliente = Number(id);

  return (
    <Layout>
      <div className="w-full min-h-full bg-slate-50 p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">
            Dashboard do Cliente
          </h1>
          <PainelCliente id_cliente={id_cliente} />
        </div>
      </div>
    </Layout>
  );
}

export default PCliente;