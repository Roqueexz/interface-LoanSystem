import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ClienteRequests from "../../../fetch/ClienteRequests";
import ResumoRequests from "../../../fetch/ResumoRequests";
import type ClienteDTO from "../../../interface/ClienteDTO";
import type ResumoClienteDTO from "../../../interface/ResumoClienteDTO";
import ParcelasDoCliente from "../ParcelasDoCliente/ParcelasDoCliente";

interface Props {
  id_cliente: number;
}

function DetalhesCliente({ id_cliente }: Props) {
  const navigate = useNavigate();

  const [cliente, setCliente] = useState<ClienteDTO | undefined>();
  const [resumo, setResumo] = useState<ResumoClienteDTO | undefined>();
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarDados() {
    setLoading(true);
    setErro("");

    try {
      const [dadosCliente, dadosResumo] = await Promise.all([
        ClienteRequests.obterClientePorId(id_cliente),
        ResumoRequests.obterResumoCliente(id_cliente),
      ]);

      if (dadosCliente) {
        setCliente(dadosCliente);
      } else {
        setErro("Erro ao carregar cliente.");
      }

      if (dadosResumo) {
        setResumo(dadosResumo);
      }
    } catch (err) {
      console.error(err);
      setErro("Erro inesperado ao carregar dados.");
    }

    setLoading(false);
  }

  useEffect(() => {
    if (id_cliente) {
      carregarDados();
    }
  }, [id_cliente]);

  async function handleExcluir() {
    const confirmacao = confirm(
      "Tem certeza que deseja excluir este cliente?"
    );

    if (!confirmacao) return;

    const sucesso = await ClienteRequests.excluirCliente(id_cliente);

    if (sucesso) {
      alert("Cliente removido com sucesso!");
      navigate("/clientes");
    } else {
      alert("Erro ao remover cliente.");
    }
  }

  const formatarMoeda = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          Detalhes do Cliente
        </h1>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/editar-cliente/${id_cliente}`)}
            className="bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-600 transition-all"
          >
            Editar
          </button>

          <button
            onClick={handleExcluir}
            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-all"
          >
            Excluir
          </button>
        </div>
      </div>

      {loading && (
        <p className="text-slate-500">Carregando...</p>
      )}

      {erro && (
        <p className="text-red-500">{erro}</p>
      )}

      {!loading && cliente && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold">
              {cliente.nome_cliente} {cliente.sobrenome_cliente}
            </h2>
            <p>Telefone: {cliente.telefone}</p>
            <p>Cidade: {cliente.cidade}</p>
            <p>Estado: {cliente.estado}</p>
          </div>

          {resumo && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-bold mb-4">Resumo Financeiro</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Total Emprestado</p>
                  <p className="text-xl font-bold text-indigo-600">
                    {formatarMoeda(resumo.totais.total_emprestado)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Recebido</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatarMoeda(resumo.totais.total_recebido)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total em Aberto</p>
                  <p className="text-xl font-bold text-yellow-600">
                    {formatarMoeda(resumo.totais.total_em_aberto)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Atrasado</p>
                  <p className="text-xl font-bold text-red-600">
                    {formatarMoeda(resumo.totais.total_atrasado)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <ParcelasDoCliente id_cliente={id_cliente} />
        </div>
      )}
    </div>
  );
}

export default DetalhesCliente;