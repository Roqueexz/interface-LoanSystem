import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Phone, MapPin } from "lucide-react";

import ClienteRequests from "../../../fetch/ClienteRequests";
import ResumoRequests from "../../../fetch/ResumoRequests";
import type ClienteDTO from "../../../interface/ClienteDTO";
import type ResumoClienteDTO from "../../../interface/ResumoClienteDTO";
import ParcelasDoCliente from "../ParcelasDoCliente/ParcelasDoCliente";
import { useToast } from "../../../hooks/useToast";
import ModalConfirmacao from "../../../ui/Modal/ModalConfirmacao";

interface Props {
  id_cliente: number;
}

function DetalhesCliente({ id_cliente }: Props) {
  const navigate = useNavigate();
  const toast = useToast();

  const [cliente, setCliente] = useState<ClienteDTO | undefined>();
  const [resumo, setResumo] = useState<ResumoClienteDTO | undefined>();
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  async function carregarDados() {
    setLoading(true);
    setErro("");

    try {
      const [dadosCliente, dadosResumo] = await Promise.all([
        ClienteRequests.obterClientePorId(id_cliente),
        ResumoRequests.obterResumoCliente(id_cliente),
      ]);

      if (dadosCliente) {
        setCliente(dadosCliente);
      } else {
        setErro("Erro ao carregar cliente.");
      }

      if (dadosResumo) {
        setResumo(dadosResumo);
      }
    } catch (err) {
      console.error(err);
      setErro("Erro inesperado ao carregar dados.");
    }

    setLoading(false);
  }

  useEffect(() => {
    if (id_cliente) {
      carregarDados();
    }
  }, [id_cliente, refreshKey]);

  function handleExcluir() {
    setModalConfirmOpen(true);
  }

  async function confirmarExclusao() {
    const sucesso = await toast.promise(
      ClienteRequests.excluirCliente(id_cliente),
      {
        loading: 'Excluindo cliente...',
        success: '✅ Cliente removido com sucesso!',
        error: '❌ Erro ao remover cliente.',
      }
    );

    if (sucesso) {
      navigate("/clientes");
    }

    setModalConfirmOpen(false);
  }

  const formatarMoeda = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64 text-muted-foreground">
        Carregando...
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex items-center justify-center min-h-64 text-red-500 dark:text-red-400">
        {erro}
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="flex items-center justify-center min-h-64 text-muted-foreground">
        Cliente não encontrado.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Detalhes do Cliente
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gerencie as informações e empréstimos do cliente
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/editar-cliente/${id_cliente}`)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-semibold transition-all"
          >
            <Pencil size={16} />
            Editar
          </button>

          <button
            onClick={handleExcluir}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition-all"
          >
            <Trash2 size={16} />
            Excluir
          </button>
        </div>
      </div>

      {/* Dados do Cliente */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {cliente.nome_cliente?.[0]}{cliente.sobrenome_cliente?.[0]}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">
              {cliente.nome_cliente} {cliente.sobrenome_cliente}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone size={16} />
                <span>{cliente.telefone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={16} />
                <span>{cliente.cidade}, {cliente.estado}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo Financeiro */}
      {resumo && (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Resumo Financeiro</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Emprestado</p>
              <p className="text-xl font-bold text-primary mt-1">
                {formatarMoeda(resumo.totais.total_emprestado)}
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Recebido</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {formatarMoeda(resumo.totais.total_recebido)}
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total em Aberto</p>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {formatarMoeda(resumo.totais.total_em_aberto)}
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Atrasado</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">
                {formatarMoeda(resumo.totais.total_atrasado)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Parcelas do Cliente */}
      <ParcelasDoCliente 
        id_cliente={id_cliente} 
        onRefresh={handleRefresh}
      />

      {/* Modal de Confirmacao */}
      <ModalConfirmacao
        isOpen={modalConfirmOpen}
        onClose={() => setModalConfirmOpen(false)}
        onConfirm={confirmarExclusao}
        title="Excluir Cliente"
        message="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}

export default DetalhesCliente;