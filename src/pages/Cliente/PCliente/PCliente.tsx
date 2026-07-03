import type { JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Layout from "../../../components/Layout/Layout";

import DetalhesCliente from "../../../components/Cliente/DetalhesCliente/DetalhesCliente";
import ResumoClienteFinanceiro from "../../../components/Cliente/ResumoClienteFinanceiro/ResumoClienteFinanceiro";
import EmprestimosDoCliente from "../../../components/Cliente/EmprestimosDoCliente/EmprestimosDoCliente";

function PCliente(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const idCliente = Number(id);

  const navigate = useNavigate();

  return (
    <Layout>
      <div className="w-full min-h-full bg-slate-50 p-6 space-y-6">

        {/* HEADER ACTIONS */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">
            Painel do Cliente
          </h1>

          <button
            onClick={() =>
              navigate(`/clientes/editar/${idCliente}`)
            }
            className="bg-yellow-500 text-white px-4 py-2 rounded-xl font-bold"
          >
            Editar Cliente
          </button>
        </div>

        {/* RESUMO PRINCIPAL */}
        <ResumoClienteFinanceiro id_cliente={idCliente} />

        {/* INFO DO CLIENTE */}
        <DetalhesCliente id_cliente={idCliente} />

        {/* EMPRÉSTIMOS */}
        <EmprestimosDoCliente id_cliente={idCliente} />

      </div>
    </Layout>
  );
}

export default PCliente;