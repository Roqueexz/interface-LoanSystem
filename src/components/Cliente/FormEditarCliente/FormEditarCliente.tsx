import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

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
      <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
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
                className="w-full px-4 py-2.5 text-sm bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
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
                className="w-full px-4 py-2.5 text-sm bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
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
              className="w-full px-4 py-2.5 text-sm bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
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
                className="w-full px-4 py-2.5 text-sm bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
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
                className="w-full px-4 py-2.5 text-sm bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
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
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-all"
            >
              <Save size={18} />
              SALVAR
            </button>

            <button
              type="button"
              onClick={() => navigate("/clientes")}
              className="flex-1 flex items-center justify-center gap-2 border border-border bg-card text-foreground py-3 rounded-xl font-bold hover:bg-muted transition-all"
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