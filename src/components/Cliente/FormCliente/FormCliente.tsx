import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

import ClienteRequests from "../../../fetch/ClienteRequests";
import type ClienteDTO from "../../../interface/ClienteDTO";
import { useToast } from "../../../hooks/useToast";

function FormCliente() {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState<ClienteDTO>({
    nome_cliente: "",
    sobrenome_cliente: "",
    telefone: "",
    cidade: "",
    estado: "",
    status_cliente: true,
  });

  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    const sucesso = await toast.promise(
      ClienteRequests.enviarFormularioCliente(formData),
      {
        loading: 'Cadastrando cliente...',
        success: '✅ Cliente cadastrado com sucesso!',
        error: (err) => {
          // Se o erro tiver uma mensagem especifica, usa ela
          if (err?.message) {
            return `❌ ${err.message}`;
          }
          return '❌ Erro ao cadastrar cliente. Tente novamente.';
        },
      }
    );

    setLoading(false);

    if (sucesso) {
      navigate("/clientes");
    }
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
            <h1 className="text-2xl font-bold text-foreground">Novo Cliente</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Preencha os dados para cadastrar um novo cliente
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
                required
                name="nome_cliente"
                value={formData.nome_cliente}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                placeholder="Ex: João"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-foreground">
                Sobrenome
              </label>
              <input
                type="text"
                required
                name="sobrenome_cliente"
                value={formData.sobrenome_cliente}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                placeholder="Ex: Silva"
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
              required
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              placeholder="(11) 99999-9999"
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
                required
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                placeholder="Ex: São Paulo"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-foreground">
                Estado
              </label>
              <input
                type="text"
                required
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                maxLength={2}
                placeholder="SP"
              />
            </div>
          </div>

          {/* BOTÕES */}
          <div className="flex gap-4 pt-4 border-t border-border">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  SALVANDO...
                </>
              ) : (
                <>
                  <Save size={18} />
                  CADASTRAR
                </>
              )}
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

export default FormCliente;