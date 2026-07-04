import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ClienteRequests from "../../../fetch/ClienteRequests";
import type ClienteDTO from "../../../interface/ClienteDTO";

interface Props {
  id_cliente: number;
}

function DetalhesCliente({ id_cliente }: Props) {
  const navigate = useNavigate();

  const [cliente, setCliente] = useState<ClienteDTO | undefined>();
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // -----------------------------
  // CARREGAR CLIENTE
  // -----------------------------
  async function carregarCliente() {
    setLoading(true);
    setErro("");

    const dados = await ClienteRequests.obterClientePorId(id_cliente);

    if (dados) {
      setCliente(dados);
    } else {
      setErro("Erro ao carregar cliente.");
    }

    setLoading(false);
  }

  useEffect(() => {
    if (id_cliente) {
      carregarCliente();
    }
  }, [id_cliente]);

  // -----------------------------
  // EXCLUIR CLIENTE
  // -----------------------------
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

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          Detalhes do Cliente
        </h1>

        <div className="flex gap-2">
          <button
            onClick={() =>
              navigate(`/editar-cliente/${id_cliente}`)
            }
            className="bg-yellow-500 text-white px-4 py-2 rounded-xl"
          >
            Editar
          </button>

          <button
            onClick={handleExcluir}
            className="bg-red-500 text-white px-4 py-2 rounded-xl"
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
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-bold">
            {cliente.nome_cliente} {cliente.sobrenome_cliente}
          </h2>

          <p>Telefone: {cliente.telefone}</p>
          <p>Cidade: {cliente.cidade}</p>
          <p>Estado: {cliente.estado}</p>

        </div>
      )}

    </div>
  );
}

export default DetalhesCliente;