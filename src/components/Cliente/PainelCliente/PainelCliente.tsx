import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

import ResumoRequests from "../../../fetch/ResumoRequests";
import type ResumoClienteDTO from "../../../interface/ResumoClienteDTO";
import EmprestimosDoCliente from "../EmprestimosDoCliente/EmprestimosDoCliente";
import ParcelasDoCliente from "../ParcelasDoCliente/ParcelasDoCliente";

interface Props {
  id_cliente: number;
}

function PainelCliente({ id_cliente }: Props) {
  const navigate = useNavigate();

  const [resumo, setResumo] = useState<ResumoClienteDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  async function carregarResumo() {
    setLoading(true);
    setErro("");

    try {
      const dados = await ResumoRequests.obterResumoCliente(id_cliente);
      if (dados) {
        setResumo(dados);
      } else {
        setErro("Erro ao carregar resumo do cliente.");
      }
    } catch (err) {
      console.error(err);
      setErro("Erro inesperado ao carregar dados.");
    }

    setLoading(false);
  }

  useEffect(() => {
    if (id_cliente) {
      carregarResumo();
    }
  }, [id_cliente, refreshKey]);

  const formatarMoeda = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-32 text-muted-foreground">
        Carregando resumo...
      </div>
    );
  }

  if (erro) {
    return (
      <div className="text-red-500 dark:text-red-400">{erro}</div>
    );
  }

  if (!resumo) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-foreground">Resumo Financeiro</h2>
        <button
          onClick={() => navigate(`/editar-cliente/${id_cliente}`)}
          className="inline-flex items-center gap-2 text-sm bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded-xl font-medium transition-all"
        >
          <Pencil size={16} />
          Editar Cliente
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Emprestado</p>
          <p className="text-xl font-bold text-primary mt-1">
            {formatarMoeda(resumo.totais.total_emprestado)}
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Recebido</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatarMoeda(resumo.totais.total_recebido)}
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total em Aberto</p>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {formatarMoeda(resumo.totais.total_em_aberto)}
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Atrasado</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">
            {formatarMoeda(resumo.totais.total_atrasado)}
          </p>
        </div>
      </div>

      <EmprestimosDoCliente 
        id_cliente={id_cliente} 
        onRefresh={handleRefresh}
      />
      
      <ParcelasDoCliente 
        id_cliente={id_cliente} 
        onRefresh={handleRefresh}
      />
    </div>
  );
}

export default PainelCliente;