import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Save,
  User,
  MapPin,
  Phone,
  XCircle,
} from "lucide-react";

import ClienteRequests from "../../../fetch/ClienteRequests";
import type ClienteDTO from "../../../interface/ClienteDTO";

function FormEditarCliente() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<ClienteDTO>({
    nome_cliente: "",
    sobrenome_cliente: "",
    telefone: "",
    cidade: "",
    estado: "",
    status_cliente: true,
  });

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const carregarCliente = async () => {
      if (!id) return;

      setCarregando(true);

      try {
        const cliente = await ClienteRequests.obterClientePorId(Number(id));

        if (!cliente) {
          setErro("Cliente não encontrado.");
          return;
        }

        setFormData({
          nome_cliente: cliente.nome_cliente,
          sobrenome_cliente: cliente.sobrenome_cliente,
          telefone: cliente.telefone,
          cidade: cliente.cidade,
          estado: cliente.estado,
          status_cliente: cliente.status_cliente ?? true,
        });
      } catch {
        setErro("Erro ao carregar cliente.");
      } finally {
        setCarregando(false);
      }
    };

    carregarCliente();
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!id) return;

const payload: ClienteDTO = {
  nome_cliente: formData.nome_cliente,
  sobrenome_cliente: formData.sobrenome_cliente,
  telefone: formData.telefone,
  cidade: formData.cidade,
  estado: formData.estado,
  status_cliente: formData.status_cliente,
};

const sucesso = await ClienteRequests.atualizarCliente(
  Number(id),
  payload
);

    setSalvando(false);

    if (sucesso) {
      alert("Cliente atualizado com sucesso!");
      navigate("/clientes");
    } else {
      alert("Erro ao atualizar cliente.");
    }
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-64 text-slate-400">
        <Loader2 className="animate-spin mr-2" size={20} />
        Carregando cliente...
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-3 text-red-500">
        <XCircle size={32} />

        <p className="font-semibold">
          {erro}
        </p>

        <button
          onClick={() => navigate("/clientes")}
          className="text-sm text-indigo-600 hover:underline"
        >
          Voltar para lista
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Cabeçalho */}

        <div className="flex items-center gap-3 mb-8">

          <button
            onClick={() => navigate("/clientes")}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Editar Cliente
            </h1>

            <p className="text-slate-400 text-sm">
              ID #{id}
            </p>
          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
                      {/* Card: Dados Pessoais */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-700 mb-5 pb-3 border-b border-slate-100">
              <User size={18} />
              Dados Pessoais
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">
                  Nome
                </label>

                <input
                  type="text"
                  name="nome_cliente"
                  required
                  minLength={3}
                  value={formData.nome_cliente}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">
                  Sobrenome
                </label>

                <input
                  type="text"
                  name="sobrenome_cliente"
                  required
                  minLength={3}
                  value={formData.sobrenome_cliente}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 mb-1.5 text-sm font-medium text-slate-600">
                  <Phone size={15} />
                  Telefone
                </label>

                <input
                  type="tel"
                  name="telefone"
                  required
                  value={formData.telefone}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* Card: Localização */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-700 mb-5 pb-3 border-b border-slate-100">
              <MapPin size={18} />
              Localização
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">
                  Cidade
                </label>

                <input
                  type="text"
                  name="cidade"
                  required
                  value={formData.cidade}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">
                  Estado
                </label>

                <input
                  type="text"
                  name="estado"
                  required
                  maxLength={2}
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pb-8">

            <button
              type="submit"
              disabled={salvando}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {salvando ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  SALVAR ALTERAÇÕES
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/clientes")}
              className="flex-1 flex items-center justify-center gap-2 border border-slate-300 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <ArrowLeft size={18} />
              CANCELAR
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default FormEditarCliente;