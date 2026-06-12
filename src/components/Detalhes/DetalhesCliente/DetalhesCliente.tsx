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

function DetalhesCliente({
  id_cliente,
}: DetalhesClienteProps): JSX.Element {
  const [cliente, setCliente] = useState<ClienteDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function buscarCliente() {
      try {
        setLoading(true);
        setError(null);

        const dados =
          await ClienteRequests.obterClientePorId(
            id_cliente
          );

        if (dados) {
          setCliente(dados);
        } else {
          setError("Cliente não encontrado.");
        }
      } catch (err) {
        console.error(err);
        setError(
          "Ocorreu um erro ao buscar os dados."
        );
      } finally {
        setLoading(false);
      }
    }

    buscarCliente();
  }, [id_cliente]);

  if (loading) {
    return (
      <Card className="shadow-4">
        <div className="flex flex-col gap-4">
          <Skeleton width="60%" height="2rem" />
          <Divider />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item}>
                <Skeleton
                  width="40%"
                  className="mb-2"
                />
                <Skeleton height="1.5rem" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error || !cliente) {
    return (
      <div className="flex justify-center p-6">
        <Message
          severity="error"
          text={error || "Erro desconhecido"}
        />
      </div>
    );
  }

  return (
    <main className="bg-gray-100 flex-1 py-8 px-4">
      <Card
        title={`${cliente.nome_cliente} ${cliente.sobrenome_cliente}`}
        className="shadow-lg max-w-4xl mx-auto"
      >
        <div className="flex flex-col gap-2">

          <div className="flex justify-between items-center">
            <span className="text-gray-500">
              ID do Cliente
            </span>

            <Tag
              value={`#${cliente.id_cliente}`}
              severity="info"
            />
          </div>

          <Divider />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Dados pessoais */}
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-lg">
                Informações Pessoais
              </h3>

              <div>
                <span className="text-xs uppercase text-gray-400">
                  Nome Completo
                </span>

                <p>
                  {cliente.nome_cliente}{" "}
                  {cliente.sobrenome_cliente}
                </p>
              </div>

              <div>
                <span className="text-xs uppercase text-gray-400">
                  Telefone
                </span>

                <p>{cliente.telefone}</p>
              </div>

              <div>
                <span className="text-xs uppercase text-gray-400">
                  Status
                </span>

                <div className="mt-1">
                  <Tag
                    value={
                      cliente.status_cliente
                        ? "Ativo"
                        : "Inativo"
                    }
                    severity={
                      cliente.status_cliente
                        ? "success"
                        : "danger"
                    }
                  />
                </div>
              </div>
            </div>

            {/* Localização */}
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-lg">
                Localização
              </h3>

              <div>
                <span className="text-xs uppercase text-gray-400">
                  Cidade
                </span>

                <p>{cliente.cidade}</p>
              </div>

              <div>
                <span className="text-xs uppercase text-gray-400">
                  Estado
                </span>

                <p>{cliente.estado}</p>
              </div>

              {cliente.criado_em && (
                <div>
                  <span className="text-xs uppercase text-gray-400">
                    Data de Cadastro
                  </span>

                  <p>
                    {new Date(
                      cliente.criado_em
                    ).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </Card>

      <div className="max-w-4xl mx-auto mt-6 flex flex-col gap-3">

        <button
          onClick={() =>
            navigate(
              `/editar-cliente/${cliente.id_cliente}`
            )
          }
          className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-md font-bold"
        >
          Editar Cliente
        </button>

        <button
          onClick={() => navigate("/clientes")}
          className="w-full bg-white border py-3 rounded-md font-bold"
        >
          Voltar
        </button>

      </div>
    </main>
  );
}

export default DetalhesCliente;