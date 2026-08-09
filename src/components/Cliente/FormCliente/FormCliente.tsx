import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Loader2,
  User,
  Phone,
  MapPin,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import ClienteRequests from "../../../fetch/ClienteRequests";
import type ClienteDTO from "../../../interface/ClienteDTO";
import { useToast } from "../../../hooks/useToast";
import Avatar from "../../shared/Avatar/Avatar";

const ESTADOS_POPULARES = ["SP", "RJ", "MG", "PR", "RS", "SC", "BA", "PE", "CE", "GO", "DF", "ES"];

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
  const [redirecionando, setRedirecionando] = useState(false);

  // Formatação dinâmica do telefone (XX) XXXXX-XXXX
  function formatarTelefone(valor: string) {
    const digitos = valor.replace(/\D/g, "").slice(0, 11);
    if (digitos.length <= 2) return digitos ? `(${digitos}` : "";
    if (digitos.length <= 7) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    if (name === "telefone") {
      setFormData((prev) => ({
        ...prev,
        telefone: formatarTelefone(value),
      }));
      return;
    }

    if (name === "estado") {
      setFormData((prev) => ({
        ...prev,
        estado: value.toUpperCase().slice(0, 2),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const resposta = await ClienteRequests.enviarFormularioCliente(formData);

      if (!resposta.sucesso) {
        toast.error(`❌ ${resposta.erro || "Não foi possível cadastrar o cliente. Verifique os dados."}`);
        return;
      }

      toast.success("✅ Cliente cadastrado com sucesso!");
      setRedirecionando(true);

      setTimeout(() => {
        if (resposta.id_cliente) {
          navigate(`/clientes/${resposta.id_cliente}`);
        } else {
          navigate("/clientes");
        }
      }, 750);
    } catch (err: any) {
      toast.error(`❌ ${err?.message || "Erro inesperado ao cadastrar o cliente."}`);
    } finally {
      setLoading(false);
    }
  }

  const nomeCompleto = `${formData.nome_cliente} ${formData.sobrenome_cliente}`.trim();
  const iniciais = (
    `${formData.nome_cliente?.[0] || ""}${formData.sobrenome_cliente?.[0] || ""}` || "NC"
  ).toUpperCase();

  if (redirecionando) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-card/90 backdrop-blur-md p-6 space-y-4 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-foreground">Abrindo perfil do cliente...</h3>
          <p className="text-xs text-muted-foreground">
            Redirecionando para os detalhes de {nomeCompleto || "novo cliente"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/clientes")}
          className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Novo Cliente</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Cadastre um novo contato para sua carteira de empréstimos
          </p>
        </div>
      </div>

      {/* LIVE CARD PREVIEW */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-primary/5 to-purple-500/10 border border-primary/20 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-primary uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Sparkles size={14} /> Pré-visualização do Cartão
          </span>
          <span className="text-[10px] bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
            Tempo Real
          </span>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar initials={iniciais} size="md" />
            <div className="min-w-0">
              <h3 className="font-bold text-foreground text-base truncate">
                {nomeCompleto || "Nome do Cliente"}
              </h3>
              <p className="text-xs text-muted-foreground truncate mt-0.5 flex items-center gap-2">
                <span>{formData.telefone || "(00) 00000-0000"}</span>
                {(formData.cidade || formData.estado) && (
                  <>
                    <span>•</span>
                    <span>
                      {formData.cidade || "Cidade"}
                      {formData.estado ? ` - ${formData.estado}` : ""}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
          <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
        </div>
      </div>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: DADOS PESSOAIS */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-5 sm:p-6 space-y-5">
          <h2 className="text-base font-bold text-foreground pb-3 border-b border-border flex items-center gap-2">
            <User size={18} className="text-primary" /> 1. Dados Pessoais
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                Nome *
              </label>
              <input
                type="text"
                required
                name="nome_cliente"
                value={formData.nome_cliente}
                onChange={handleChange}
                className="w-full px-4 py-3 text-base bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                placeholder="Ex: João"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                Sobrenome *
              </label>
              <input
                type="text"
                required
                name="sobrenome_cliente"
                value={formData.sobrenome_cliente}
                onChange={handleChange}
                className="w-full px-4 py-3 text-base bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                placeholder="Ex: Silva"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: CONTATO */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-5 sm:p-6 space-y-5">
          <h2 className="text-base font-bold text-foreground pb-3 border-b border-border flex items-center gap-2">
            <Phone size={18} className="text-primary" /> 2. Contato & WhatsApp
          </h2>

          <div>
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
              Telefone / Celular (WhatsApp) *
            </label>
            <input
              type="text"
              inputMode="tel"
              required
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full px-4 py-3 text-base bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
              placeholder="(11) 99999-9999"
              maxLength={15}
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Utilizado para geração de links automáticos de cobrança via WhatsApp.
            </p>
          </div>
        </div>

        {/* SECTION 3: LOCALIZACAO */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-5 sm:p-6 space-y-5">
          <h2 className="text-base font-bold text-foreground pb-3 border-b border-border flex items-center gap-2">
            <MapPin size={18} className="text-primary" /> 3. Localização
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                Cidade *
              </label>
              <input
                type="text"
                required
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                className="w-full px-4 py-3 text-base bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                placeholder="Ex: São Paulo"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                Estado (UF) *
              </label>
              <input
                type="text"
                required
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-4 py-3 text-base bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all uppercase font-bold tracking-wider"
                maxLength={2}
                placeholder="SP"
              />

              {/* QUICK UF SELECTION CHIPS */}
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {ESTADOS_POPULARES.map((uf) => (
                  <button
                    key={uf}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, estado: uf }))}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                      formData.estado === uf
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {uf}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/clientes")}
            className="flex-1 py-3.5 px-4 border border-border bg-card text-foreground font-bold rounded-xl hover:bg-muted transition-all text-sm"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3.5 px-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Cadastrando...
              </>
            ) : (
              <>
                <Save size={18} /> Cadastrar Cliente
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormCliente;