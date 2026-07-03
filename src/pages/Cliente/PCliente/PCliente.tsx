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

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Painel do Cliente
            </h1>
            <p className="text-slate-500 text-sm">
              Visão completa financeira e operacional
            </p>
          </div>

          <button
            onClick={() => navigate(`/editar-cliente/${idCliente}`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200"
          >
            Editar Cliente
          </button>
        </div>

        {/* KPIs CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-200">
            <p className="text-slate-500 text-sm">Total Emprestado</p>
            <p className="text-xl font-bold text-slate-800">
              R$ 0,00
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-200">
            <p className="text-slate-500 text-sm">Em Aberto</p>
            <p className="text-xl font-bold text-yellow-600">
              R$ 0,00
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-200">
            <p className="text-slate-500 text-sm">Recebido</p>
            <p className="text-xl font-bold text-green-600">
              R$ 0,00
            </p>
          </div>

        </div>

        {/* DETALHES DO CLIENTE */}
        <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200">
          <DetalhesCliente id_cliente={idCliente} />
        </div>

        {/* RESUMO FINANCEIRO */}
        <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200">
          <ResumoClienteFinanceiro id_cliente={idCliente} />
        </div>

        {/* EMPRÉSTIMOS */}
        <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200">
          <EmprestimosDoCliente id_cliente={idCliente} />
        </div>

        {/* PLACEHOLDER PARCELAS (PRÓXIMO PASSO) */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-dashed border-slate-300">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-700">
                Parcelas
              </h2>
              <p className="text-sm text-slate-500">
                Controle de pagamentos por parcela (em breve)
              </p>
            </div>

            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              Próxima etapa
            </span>
          </div>
        </div>

      </div>
    </Layout>
  );
}

export default PCliente;