import { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";

import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import { Skeleton } from "primereact/skeleton";
import { Tag } from "primereact/tag";

import ClienteRequests from "../../../fetch/ClienteRequests";
import type ClienteDTO from "../../../interface/ClienteDTO";

interface DetalhesClienteProps {
  id_cliente: number;
}

function DetalhesCliente({ id_cliente }: DetalhesClienteProps): JSX.Element {
  const [cliente, setCliente] = useState<ClienteDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function buscarCliente() {
      try {
        setLoading(true);
        setError(null);

        const dados = await ClienteRequests.obterClientePorId(id_cliente);

        if (dados) {
          setCliente(dados);
        } else {
          setError("Cliente não encontrado.");
        }
      } catch (err) {
        console.error(err);
        setError("Ocorreu um erro ao buscar os dados.");
      } finally {
        setLoading(false);
      }
    }

    buscarCliente();
  }, [id_cliente]);

  if (loading) {
    return (
      <div className="py-8 px-4 max-w-4xl mx-auto">
        <Card className="shadow-xl rounded-2xl">
          <div className="flex flex-col gap-4">
            <Skeleton width="60%" height="2rem" />
            <Divider />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item}>
                  <Skeleton width="40%" className="mb-2" />
                  <Skeleton height="1.5rem" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="flex justify-center p-8">
        <Message severity="error" text={error || "Erro desconhecido"} />
      </div>
    );
  }

  return (
    <div className="py-8 px-4"> {/* Trocado main por div simples para herdar o Layout */}
      <Card
        title={`${cliente.nome_cliente} ${cliente.sobrenome_cliente}`}
        className="shadow-xl max-w-4xl mx-auto rounded-2xl"
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">ID do Cliente</span>
            <Tag value={`#${cliente.id_cliente}`} severity="info" />
          </div>

          <Divider />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dados pessoais */}
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-lg text-slate-800">Informações Pessoais</h3>

              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-0.5">
                  Nome Completo
                </span>
                <p className="text-slate-700 font-medium">
                  {cliente.nome_cliente} {cliente.sobrenome_cliente}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-0.5">
                  Telefone
                </span>
                <p className="text-slate-700 font-medium">{cliente.telefone}</p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">
                  Status
                </span>
                <div>
                  <Tag
                    value={cliente.status_cliente ? "Ativo" : "Inativo"}
                    severity={cliente.status_cliente ? "success" : "danger"}
                  />
                </div>
              </div>
            </div>

            {/* Localização */}
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-lg text-slate-800">Localização</h3>

              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-0.5">
                  Cidade
                </span>
                <p className="text-slate-700 font-medium">{cliente.cidade}</p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-0.5">
                  Estado
                </span>
                <p className="text-slate-700 font-medium uppercase">{cliente.estado}</p>
              </div>

              {cliente.criado_em && (
                <div>
                  <span className="text-xs font-semibold uppercase text-slate-400 block mb-0.5">
                    Data de Cadastro
                  </span>
                  <p className="text-slate-700 font-medium">
                    {new Date(cliente.criado_em).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="max-w-4xl mx-auto mt-6 flex gap-4">
        <button
          onClick={() => navigate(`/editar-cliente/${cliente.id_cliente}`)}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-md transition-all"
        >
          Editar Cliente
        </button>

        <button
          onClick={() => navigate("/clientes")}
          className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-bold transition-all"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

export default DetalhesCliente;