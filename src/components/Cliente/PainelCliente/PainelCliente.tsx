import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ResumoRequests from "../../../fetch/ResumoRequests";
import type ResumoClienteDTO from "../../../interface/ResumoClienteDTO";
import EmprestimosDoCliente from "../EmprestimosDoCliente/EmprestimosDoCliente";
import ParcelasDoCliente from "../ParcelasDoCliente/ParcelasDoCliente";

interface Props {
  id_cliente: number;
}

function PainelCliente({ id_cliente }: Props) {
  const navigate = useNavigate();

  const [resumo, setResumo] = useState<ResumoClienteDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarResumo() {
    setLoading(true);
    setErro("");

    try {
      const dados = await ResumoRequests.obterResumoCliente(id_cliente);
      if (dados) {
        setResumo(dados);
      } else {
        setErro("Erro ao carregar resumo do cliente.");
      }
    } catch (err) {
      console.error(err);
      setErro("Erro inesperado ao carregar dados.");
    }

    setLoading(false);
  }

  useEffect(() => {
    if (id_cliente) {
      carregarResumo();
    }
  }, [id_cliente]);

  const formatarMoeda = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Resumo Financeiro</h2>
        <button
          onClick={() => navigate(`/editar-cliente/${id_cliente}`)}
          className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all"
        >
          Editar Cliente
        </button>
      </div>

      {loading && (
        <p className="text-slate-500">Carregando resumo...</p>
      )}

      {erro && (
        <p className="text-red-500">{erro}</p>
      )}

      {!loading && resumo && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">Total Emprestado</p>
              <p className="text-xl font-bold text-indigo-600">
                {formatarMoeda(resumo.totais.total_emprestado)}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">Total Recebido</p>
              <p className="text-xl font-bold text-green-600">
                {formatarMoeda(resumo.totais.total_recebido)}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">Total em Aberto</p>
              <p className="text-xl font-bold text-yellow-600">
                {formatarMoeda(resumo.totais.total_em_aberto)}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">Total Atrasado</p>
              <p className="text-xl font-bold text-red-600">
                {formatarMoeda(resumo.totais.total_atrasado)}
              </p>
            </div>
          </div>

          <EmprestimosDoCliente id_cliente={id_cliente} />
          <ParcelasDoCliente id_cliente={id_cliente} />
        </>
      )}
    </div>
  );
}

export default PainelCliente;