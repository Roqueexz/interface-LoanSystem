import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Zap,
  MessageCircle,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  CreditCard,
} from "lucide-react";

import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import ClienteRequests from "../../../fetch/ClienteRequests";
import ParcelaRequests from "../../../fetch/ParcelaRequests";

import type EmprestimoDTO from "../../../interface/EmprestimoDTO";
import type ClienteDTO from "../../../interface/ClienteDTO";
import type ParcelaDTO from "../../../interface/ParcelaDTO";

import { SkeletonDetalhes } from "../../../ui/Skeleton";
import ModalBaixaRapida from "../ListagemEmprestimo/ModalBaixaRapida";
import { gerarLinkCobrancaWhatsapp } from "../../../services/whatsapp";

interface DetalhesEmprestimoProps {
  id_emprestimo: number;
  refreshTrigger?: number;
}

function DetalhesEmprestimo({ id_emprestimo, refreshTrigger }: DetalhesEmprestimoProps) {
  const navigate = useNavigate();

  const [emprestimo, setEmprestimo] = useState<EmprestimoDTO | null>(null);
  const [cliente, setCliente] = useState<ClienteDTO | null>(null);
  const [parcelas, setParcelas] = useState<ParcelaDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [baixaModalOpen, setBaixaModalOpen] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        setError(null);

        const empResp = await EmprestimoRequests.obterEmprestimoPorId(id_emprestimo);

        if (empResp) {
          setEmprestimo(empResp);

          // Carrega cliente e parcelas em paralelo
          const [cliResp, parcResp] = await Promise.all([
            empResp.id_cliente ? ClienteRequests.obterClientePorId(empResp.id_cliente) : undefined,
            ParcelaRequests.listarPorEmprestimo(id_emprestimo),
          ]);

          if (cliResp) setCliente(cliResp);
          if (parcResp) setParcelas(parcResp);
        } else {
          setError("Empréstimo não encontrado.");
        }
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar os dados do empréstimo.");
      } finally {
        setLoading(false);
      }
    }

    if (id_emprestimo) {
      carregarDados();
    }
  }, [id_emprestimo, refreshTrigger]);

  const formatarData = (data: string | Date | undefined) => {
    if (!data) return "Não informada";
    try {
      return new Date(data).toLocaleDateString("pt-BR");
    } catch {
      return String(data);
    }
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <SkeletonDetalhes />
      </div>
    );
  }

  if (error || !emprestimo) {
    return (
      <div className="py-12 px-4 flex items-center justify-center min-h-[50vh]">
        <div className="bg-card p-8 rounded-2xl shadow-xl max-w-sm w-full text-center border border-border space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-red-600 dark:text-red-400 font-bold text-lg">{error || "Não encontrado"}</h2>
          <button
            onClick={() => navigate("/emprestimos")}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-bold hover:opacity-90 transition-all text-sm"
          >
            Voltar para Empréstimos
          </button>
        </div>
      </div>
    );
  }

  const nomeCliente = cliente
    ? `${cliente.nome_cliente} ${cliente.sobrenome_cliente}`
    : emprestimo.nome_cliente
      ? `${emprestimo.nome_cliente} ${emprestimo.sobrenome_cliente || ""}`
      : `Cliente #${emprestimo.id_cliente}`;

  const totalParcelas = parcelas.length || emprestimo.num_parcelas || 1;
  const parcelasPagas = parcelas.filter((p) => p.status_parcela === "PAGA");
  const numPagas = parcelasPagas.length;
  const totalPago = parcelasPagas.reduce((acc, p) => acc + (p.valor_parcela || 0), 0);
  const totalDevido = (emprestimo.valor_parcela || 0) * totalParcelas;
  const saldoDevedor = Math.max(0, totalDevido - totalPago);
  const pctProgresso = Math.min(Math.round((numPagas / totalParcelas) * 100), 100);

  const proximaParcela = parcelas.find((p) => p.status_parcela !== "PAGA");

  function handleAbrirWhatsapp() {
    const url = gerarLinkCobrancaWhatsapp({
      nomeCliente,
      telefone: cliente?.telefone,
      valorParcela: proximaParcela?.valor_parcela || emprestimo?.valor_parcela,
      dataVencimento: proximaParcela?.data_vencimento || emprestimo?.data_devolucao?.toString(),
      numeroParcela: proximaParcela?.numero_parcela,
      totalParcelas: emprestimo?.num_parcelas,
      idEmprestimo: emprestimo?.id_emprestimo,
    });
    window.open(url, "_blank");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* ACTION BAR MOBILE-FIRST */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <button
          onClick={() => navigate("/emprestimos")}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="flex items-center gap-2">
          {/* Baixa Rápida */}
          <button
            onClick={() => setBaixaModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold transition-all active:scale-95"
          >
            <Zap size={14} className="fill-emerald-500" />
            <span>Baixa Rápida</span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={handleAbrirWhatsapp}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <MessageCircle size={14} />
            <span>Cobrar</span>
          </button>

          {/* Editar */}
          <button
            onClick={() => navigate(`/editar-emprestimo/${emprestimo.id_emprestimo}`)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-bold transition-all"
          >
            <Edit2 size={14} />
            <span className="hidden sm:inline">Editar</span>
          </button>
        </div>
      </div>

      {/* HERO HERO SUMMARY CARD */}
      <div
        className="bg-card rounded-2xl p-6 border border-border shadow-md space-y-5"
        style={{
          background: "linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(99, 102, 241, 0.02) 100%)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground">
                Empréstimo #{emprestimo.id_emprestimo}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${emprestimo.status_emprestimo
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-muted text-muted-foreground"
                  }`}
              >
                {emprestimo.status_emprestimo ? "Ativo" : "Finalizado"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              <User size={14} /> {nomeCliente} {cliente?.telefone && `• ${cliente.telefone}`}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              Valor Total do Empréstimo
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {formatarMoeda(emprestimo.valor_emprestimo)}
            </span>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-card p-3.5 rounded-xl border border-border">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">Valor Parcela</span>
            <p className="text-base sm:text-lg font-bold text-foreground mt-0.5">
              {emprestimo.valor_parcela ? formatarMoeda(emprestimo.valor_parcela) : "N/A"}
            </p>
          </div>

          <div className="bg-card p-3.5 rounded-xl border border-border">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">Total Pago</span>
            <p className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {formatarMoeda(totalPago)}
            </p>
          </div>

          <div className="bg-card p-3.5 rounded-xl border border-border">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">Saldo Devedor</span>
            <p className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5">
              {formatarMoeda(saldoDevedor)}
            </p>
          </div>

          <div className="bg-card p-3.5 rounded-xl border border-border">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">Juros ({emprestimo.tipo_juros})</span>
            <p className="text-base sm:text-lg font-bold text-foreground mt-0.5">
              {emprestimo.juros}% ao mês
            </p>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-muted-foreground flex items-center gap-1">
              <CheckCircle2 size={14} className="text-emerald-500" /> Progresso de Quitação
            </span>
            <span className="text-foreground">
              {numPagas} de {totalParcelas} parcelas pagas ({pctProgresso}%)
            </span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden p-0.5 border border-border/50">
            <div
              className={`h-full rounded-full transition-all duration-500 ${pctProgresso === 100 ? "bg-emerald-500" : "bg-primary"
                }`}
              style={{ width: `${pctProgresso}%` }}
            />
          </div>
        </div>
      </div>

      {/* DADOS DETALHADOS */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        <div>
          <h3 className="font-bold text-foreground text-base mb-3 pb-2 border-b border-border flex items-center gap-2">
            <Calendar size={16} className="text-primary" /> Datas & Prazos
          </h3>
          <div className="space-y-2.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data do Empréstimo:</span>
              <span className="font-semibold text-foreground">{formatarData(emprestimo.data_emprestimo)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Devolução Estimada:</span>
              <span className="font-semibold text-foreground">{formatarData(emprestimo.data_devolucao)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Número de Parcelas:</span>
              <span className="font-semibold text-foreground">{emprestimo.num_parcelas}x</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-foreground text-base mb-3 pb-2 border-b border-border flex items-center gap-2">
            <CreditCard size={16} className="text-primary" /> Pagamento
          </h3>
          <div className="space-y-2.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Forma de Pagamento:</span>
              <span className="font-semibold text-foreground capitalize">
                {emprestimo.forma_pagamento || "Não informada"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tipo de Juros:</span>
              <span className="font-semibold text-foreground capitalize">{emprestimo.tipo_juros}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Taxa Mensal:</span>
              <span className="font-semibold text-foreground">{emprestimo.juros}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Baixa Rápida */}
      {emprestimo.id_emprestimo && (
        <ModalBaixaRapida
          isOpen={baixaModalOpen}
          onClose={() => setBaixaModalOpen(false)}
          onSuccess={() => navigate(0)}
          idEmprestimo={emprestimo.id_emprestimo}
          nomeCliente={nomeCliente}
        />
      )}
    </div>
  );
}

export default DetalhesEmprestimo;