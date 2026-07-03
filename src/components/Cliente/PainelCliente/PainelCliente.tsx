import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import DetalhesCliente from "../DetalhesCliente/DetalhesCliente";
import ResumoClienteFinanceiro from "../ResumoClienteFinanceiro/ResumoClienteFinanceiro";
import EmprestimosDoCliente from "../EmprestimosDoCliente/EmprestimosDoCliente";
import ParcelasDoCliente from "../ParcelasDoCliente/ParcelasDoCliente";

import ResumoRequests from "../../../fetch/ResumoRequests";
import ParcelaRequests from "../../../fetch/ParcelaRequests";
import type ResumoClienteDTO from "../../../interface/ResumoClienteDTO";

interface Props {
  id_cliente: number;
}

function PainelCliente({ id_cliente }: Props) {
  const navigate = useNavigate();

  const [resumo, setResumo] = useState<ResumoClienteDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const carregarResumo = useCallback(async () => {
    setLoading(true);
    setErro("");

    const dados = await ResumoRequests.obterResumoDoCliente(id_cliente);

    if (dados) {
      setResumo(dados);
    } else {
      setErro("Não foi possível carregar os dados do cliente.");
    }

    setLoading(false);
  }, [id_cliente]);

  useEffect(() => {
    if (id_cliente) {
      carregarResumo();
    }
  }, [id_cliente, carregarResumo]);

  async function handlePagarParcela(id_parcela: number) {
    const sucesso = await ParcelaRequests.marcarComoPaga(id_parcela);
    if (sucesso) carregarResumo();
  }

  async function handleDesfazerParcela(id_parcela: number) {
    const sucesso = await ParcelaRequests.desfazerPagamento(id_parcela);
    if (sucesso) carregarResumo();
  }

  return (
    <div className="p-6 space-y-6">

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Painel do Cliente</h1>
          <p className="text-slate-500 text-sm">Visão completa financeira e operacional</p>
        </div>

        <button
          onClick={() => navigate(`/editar-cliente/${id_cliente}`)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200"
        >
          Editar Cliente
        </button>
      </div>

      {erro && <p className="text-red-500">{erro}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-200">
          <p className="text-slate-500 text-sm">Total Emprestado</p>
          <p className="text-xl font-bold text-slate-800">
            R$ {(resumo?.totais.total_emprestado ?? 0).toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-200">
          <p className="text-slate-500 text-sm">Em Aberto</p>
          <p className="text-xl font-bold text-yellow-600">
            R$ {(resumo?.totais.total_em_aberto ?? 0).toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-200">
          <p className="text-slate-500 text-sm">Recebido</p>
          <p className="text-xl font-bold text-green-600">
            R$ {(resumo?.totais.total_recebido ?? 0).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200">
        <DetalhesCliente id_cliente={id_cliente} />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200">
        <ResumoClienteFinanceiro loading={loading} totais={resumo?.totais} />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200">
        <EmprestimosDoCliente loading={loading} emprestimos={resumo?.emprestimos ?? []} />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200">
        <ParcelasDoCliente
          loading={loading}
          emprestimos={resumo?.emprestimos ?? []}
          onPagar={handlePagarParcela}
          onDesfazer={handleDesfazerParcela}
        />
      </div>

    </div>
  );
}

export default PainelCliente;