import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Banknote,
  Smartphone,
  FileText,
  CreditCard,
  ArrowLeft,
  Save,
  Loader2,
  User,
  Users,
  CheckCircle2,
} from "lucide-react";

import ClienteRequests from "../../../fetch/ClienteRequests";
import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import { useToast } from "../../../hooks/useToast";

import type ClienteDTO from "../../../interface/ClienteDTO";
import type EmprestimoDTO from "../../../interface/EmprestimoDTO";
import Avatar from "../../shared/Avatar/Avatar";
import ModalSeletor, { type ModalSeletorItem } from "../../../ui/Modal/ModalSeletor";

const FORMAS_PAGAMENTO = [
  { value: "dinheiro", label: "Dinheiro", Icon: Banknote },
  { value: "pix", label: "Pix", Icon: Smartphone },
  { value: "boleto", label: "Boleto", Icon: FileText },
  { value: "cartao", label: "Cartão", Icon: CreditCard },
] as const;

const PARCELAS_PRESETS = [1, 2, 3, 6, 10, 12];
const JUROS_PRESETS = [0, 5, 10, 15];

function FormEmprestimo() {
  const navigate = useNavigate();
  const toast = useToast();

  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [modalClienteOpen, setModalClienteOpen] = useState(false);

  const [formData, setFormData] = useState({
    id_cliente: 0,
    valor_emprestimo: 0,
    num_parcelas: 1,
    tipo_juros: "simples",
    juros: 0,
    data_emprestimo: (() => {
      const hoje = new Date();
      hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
      return hoje.toISOString().split("T")[0];
    })(),
    data_devolucao: "",
    forma_pagamento: "",
  });

  const [valorParcela, setValorParcela] = useState(0);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    const lista = await ClienteRequests.obterListaDeClientes();
    if (lista) {
      setClientes(lista);
    }
  }

  useEffect(() => {
    if (formData.valor_emprestimo <= 0 || formData.num_parcelas <= 0) return;

    let total = formData.valor_emprestimo;

    if (formData.tipo_juros === "simples") {
      total = formData.valor_emprestimo * (1 + (formData.juros / 100) * formData.num_parcelas);
    } else {
      total = formData.valor_emprestimo * Math.pow(1 + formData.juros / 100, formData.num_parcelas);
    }

    const valorCalculado = Number((total / formData.num_parcelas).toFixed(2));
    setValorParcela(valorCalculado);
  }, [
    formData.valor_emprestimo,
    formData.num_parcelas,
    formData.juros,
    formData.tipo_juros,
  ]);

  useEffect(() => {
    if (!formData.data_emprestimo) return;

    const data = new Date(formData.data_emprestimo);
    data.setMonth(data.getMonth() + Number(formData.num_parcelas));

    const novaData = data.toISOString().split("T")[0];

    if (novaData !== formData.data_devolucao) {
      setFormData((prev) => ({
        ...prev,
        data_devolucao: novaData,
      }));
    }
  }, [formData.data_emprestimo, formData.num_parcelas]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    const camposNumericos = [
      "id_cliente",
      "valor_emprestimo",
      "num_parcelas",
      "juros",
    ];

    setFormData((prev) => ({
      ...prev,
      [name]: camposNumericos.includes(name)
        ? Number(value)
        : value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSalvando(true);

    const payload: EmprestimoDTO = {
      id_cliente: formData.id_cliente,
      valor_emprestimo: formData.valor_emprestimo,
      num_parcelas: formData.num_parcelas,
      tipo_juros: formData.tipo_juros,
      juros: formData.juros,
      data_emprestimo: new Date(formData.data_emprestimo),
      data_devolucao: formData.data_devolucao
        ? new Date(formData.data_devolucao)
        : undefined,
      forma_pagamento: formData.forma_pagamento || undefined,
    };

    const sucesso = await toast.promise(
      EmprestimoRequests.enviarFormularioEmprestimo(payload),
      {
        loading: "Cadastrando empréstimo...",
        success: "✅ Empréstimo cadastrado com sucesso!",
        error: (err) => err?.message ? `❌ ${err.message}` : "❌ Erro ao cadastrar empréstimo.",
      }
    );

    setSalvando(false);

    if (sucesso) {
      navigate("/emprestimos");
    }
  }

  const clienteSelecionado = clientes.find((c) => c.id_cliente === formData.id_cliente);

  const clienteItemsModal: ModalSeletorItem[] = clientes.map((c) => {
    const nomeComp = `${c.nome_cliente} ${c.sobrenome_cliente}`;
    const iniciais = nomeComp
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2);

    return {
      id: c.id_cliente!,
      title: nomeComp,
      subtitle: c.telefone ? `Tel: ${c.telefone}` : "Sem telefone registrado",
      details: c.cidade && c.estado ? `${c.cidade} - ${c.estado}` : undefined,
      avatarInitials: iniciais,
      originalObj: c,
    };
  });

  const formatarMoeda = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/emprestimos")}
          className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Novo Empréstimo</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Preencha os dados para registrar um novo contrato
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SELEÇÃO DE CLIENTE (UI/UX VISUAL PREMIUM) */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Users size={18} className="text-primary" /> 1. Cliente
            </h2>
            {clienteSelecionado && (
              <button
                type="button"
                onClick={() => setModalClienteOpen(true)}
                className="text-xs font-bold text-primary hover:underline"
              >
                Trocar Cliente
              </button>
            )}
          </div>

          {!clienteSelecionado ? (
            <button
              type="button"
              onClick={() => setModalClienteOpen(true)}
              className="w-full p-6 border-2 border-dashed border-border rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all text-center space-y-2 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <User size={24} />
              </div>
              <p className="font-bold text-foreground text-sm">Selecionar Cliente</p>
              <p className="text-xs text-muted-foreground">
                Clique para buscar e escolher o tomador do empréstimo
              </p>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar
                  initials={`${clienteSelecionado.nome_cliente[0]}${clienteSelecionado.sobrenome_cliente[0]}`}
                  size="md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground text-base">
                      {clienteSelecionado.nome_cliente} {clienteSelecionado.sobrenome_cliente}
                    </h3>
                    <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-500/20" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {clienteSelecionado.telefone || "Sem telefone"} • {clienteSelecionado.cidade} - {clienteSelecionado.estado}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalClienteOpen(true)}
                className="py-2 px-3 text-xs font-bold rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-all shrink-0"
              >
                Alterar
              </button>
            </div>
          )}
        </div>

        {/* VALORES E CONDICOES */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-5 sm:p-6 space-y-5">
          <h2 className="text-base font-bold text-foreground pb-3 border-b border-border">
            2. Valores & Condições
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Valor Empréstimo */}
              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                  Valor do Empréstimo (R$) *
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  required
                  min="0.01"
                  step="0.01"
                  name="valor_emprestimo"
                  value={formData.valor_emprestimo || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-base bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  placeholder="0,00"
                />
              </div>

              {/* Número de Parcelas com presets */}
              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                  Número de Parcelas *
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  required
                  min={1}
                  name="num_parcelas"
                  value={formData.num_parcelas}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-base bg-input-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
                {/* Presets chips */}
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {PARCELAS_PRESETS.map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, num_parcelas: num }))}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                        formData.num_parcelas === num
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {num}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* JUROS E CONDIÇÕES */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-5 sm:p-6 space-y-5">
          <h2 className="text-base font-bold text-foreground pb-3 border-b border-border">
            3. Taxas & Juros
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                  Tipo de Juros
                </label>
                <select
                  name="tipo_juros"
                  value={formData.tipo_juros}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-base bg-input-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                >
                  <option value="simples">Juros Simples</option>
                  <option value="compostos">Juros Compostos</option>
                </select>
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                  Taxa de Juros (% ao mês) *
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  required
                  name="juros"
                  value={formData.juros ?? ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-base bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  placeholder="Ex: 5"
                />
                {/* Presets chips */}
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {JUROS_PRESETS.map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, juros: rate }))}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                        formData.juros === rate
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* LIVE CALCULATION BOX */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold">Valor Estimado por Parcela</p>
                <p className="text-xl sm:text-2xl font-extrabold text-foreground mt-0.5">
                  {valorParcela > 0 ? formatarMoeda(valorParcela) : "R$ 0,00"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground font-semibold">Total com Juros</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {valorParcela > 0 ? formatarMoeda(valorParcela * formData.num_parcelas) : "R$ 0,00"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DATAS E FORMA DE PAGAMENTO */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-5 sm:p-6 space-y-5">
          <h2 className="text-base font-bold text-foreground pb-3 border-b border-border">
            4. Datas & Recebimento
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                  Data do Empréstimo
                </label>
                <input
                  type="date"
                  required
                  name="data_emprestimo"
                  value={formData.data_emprestimo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-base bg-input-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                  Devolução Estimada
                </label>
                <input
                  type="text"
                  readOnly
                  value={
                    formData.data_devolucao
                      ? new Date(formData.data_devolucao).toLocaleDateString("pt-BR")
                      : "..."
                  }
                  className="w-full px-4 py-3 text-base bg-muted border border-border rounded-xl text-foreground cursor-default font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-foreground">
                Forma de Recebimento Preferencial
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {FORMAS_PAGAMENTO.map(({ value, label, Icon }) => {
                  const selecionado = formData.forma_pagamento === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          forma_pagamento: prev.forma_pagamento === value ? "" : value,
                        }))
                      }
                      className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                        selecionado
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                          : "border-border bg-muted/40 text-muted-foreground hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      <Icon size={22} />
                      <span className="text-xs font-semibold">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* STICKY BOTTOM ACTIONS */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/emprestimos")}
            className="flex-1 py-3.5 px-4 border border-border bg-card text-foreground font-bold rounded-xl hover:bg-muted transition-all text-sm"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={salvando || formData.id_cliente === 0}
            className="flex-1 py-3.5 px-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {salvando ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Cadastrando...
              </>
            ) : (
              <>
                <Save size={18} /> Cadastrar Empréstimo
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modal Seletor de Cliente Reutilizável */}
      <ModalSeletor
        isOpen={modalClienteOpen}
        onClose={() => setModalClienteOpen(false)}
        title="Selecionar Cliente"
        subtitle="Escolha o cliente para o novo empréstimo"
        searchPlaceholder="Buscar cliente por nome ou telefone..."
        items={clienteItemsModal}
        selectedId={formData.id_cliente}
        onSelect={(item) => {
          setFormData((prev) => ({ ...prev, id_cliente: Number(item.id) }));
        }}
        icon={<Users size={20} />}
      />
    </div>
  );
}

export default FormEmprestimo;