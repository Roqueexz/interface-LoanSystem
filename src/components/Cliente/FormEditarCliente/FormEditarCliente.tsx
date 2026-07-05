import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

import ClienteRequests from "../../../fetch/ClienteRequests";
import type ClienteDTO from "../../../interface/ClienteDTO";
import { useToast } from "../../../hooks/useToast";
import { SkeletonDetalhes } from "../../../ui/Skeleton";

function FormEditarCliente() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<ClienteDTO>({
    nome_cliente: "",
    sobrenome_cliente: "",
    telefone: "",
    cidade: "",
    estado: "",
    status_cliente: true,
  });

  async function carregarCliente() {
    if (!id) return;

    setLoading(true);

    const cliente = await ClienteRequests.obterClientePorId(Number(id));

    if (cliente) {
      setFormData(cliente);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarCliente();
  }, [id]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!id) return;

    const sucesso = await toast.promise(
      ClienteRequests.atualizarCliente(Number(id), formData),
      {
        loading: 'Atualizando cliente...',
        success: '✅ Cliente atualizado com sucesso!',
        error: '❌ Erro ao atualizar cliente.',
      }
    );

    if (sucesso) {
      navigate("/clientes");
    }
  }

  if (loading) {
    return <SkeletonDetalhes />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="card shadow-sm p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/clientes")}
            className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Editar Cliente</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Atualize as informações do cliente #{id}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NOME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-foreground">
                Nome
              </label>
              <input
                type="text"
                name="nome_cliente"
                value={formData.nome_cliente}
                onChange={handleChange}
                className="input"
                placeholder="Nome"
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-foreground">
                Sobrenome
              </label>
              <input
                type="text"
                name="sobrenome_cliente"
                value={formData.sobrenome_cliente}
                onChange={handleChange}
                className="input"
                placeholder="Sobrenome"
                required
              />
            </div>
          </div>

          {/* TELEFONE */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-foreground">
              Telefone
            </label>
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="input"
              placeholder="Telefone"
              required
            />
          </div>

          {/* CIDADE / ESTADO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-foreground">
                Cidade
              </label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                className="input"
                placeholder="Cidade"
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-foreground">
                Estado
              </label>
              <input
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="input"
                placeholder="Estado (ex: SP)"
                required
                maxLength={2}
              />
            </div>
          </div>

          {/* BOTÕES */}
          <div className="flex gap-4 pt-4 border-t border-border">
            <button
              type="submit"
              className="btn-primary flex-1 justify-center"
            >
              <Save size={18} />
              SALVAR
            </button>

            <button
              type="button"
              onClick={() => navigate("/clientes")}
              className="btn-outline flex-1 justify-center"
            >
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormEditarCliente;