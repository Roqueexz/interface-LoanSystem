import type { JSX } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../../components/Layout/Layout";

import DetalhesCliente from "../../../components/Cliente/DetalhesCliente/DetalhesCliente";
import ResumoClienteFinanceiro from "../../../components/Cliente/ResumoClienteFinanceiro/ResumoClienteFinanceiro";
import EmprestimosDoCliente from "../../../components/Cliente/EmprestimosDoCliente/EmprestimosDoCliente";

function PDetalhesCliente(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const idCliente = Number(id);

  return (
    <Layout>
      <div className="w-full min-h-full bg-slate-50 p-6 space-y-6">

        {/* INFO DO CLIENTE */}
        <DetalhesCliente id_cliente={idCliente} />

        {/* RESUMO FINANCEIRO */}
        <ResumoClienteFinanceiro id_cliente={idCliente} />

        {/* EMPRÉSTIMOS */}
        <EmprestimosDoCliente id_cliente={idCliente} />

      </div>
    </Layout>
  );
}

export default PDetalhesCliente;