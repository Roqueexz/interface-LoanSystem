import { useState, useEffect } from "react";
import { User, Calendar, CheckCircle } from "lucide-react";
import ModalBase from "../ModalBase";
import { formatarMoeda, formatarDataBR } from "../../../services/Utilitario";
import ParcelaRequests from "../../../fetch/ParcelaRequests";
import EmprestimoRequests from "../../../fetch/EmprestimoRequests";
import ClienteRequests from "../../../fetch/ClienteRequests";

interface Pagamento {
  id_parcela: number;
  id_emprestimo: number;
  numero_parcela: number;
  valor_pago: number;
  data_pagamento: string;
  cliente_nome: string;
  cliente_telefone: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function ModalHistoricoPagamentos({ isOpen, onClose }: Props) {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      carregarHistoricoPagamentos();
    }
  }, [isOpen]);

  async function carregarHistoricoPagamentos() {
    setCarregando(true);
    setErro(null);

    try {
      // Busca todos os empréstimos e clientes
      const [emprestimos, clientes] = await Promise.all([
        EmprestimoRequests.obterListaDeEmprestimos(),
        ClienteRequests.obterListaDeClientes(),
      ]);

      if (!emprestimos || !clientes) {
        setErro("Erro ao carregar dados.");
        setCarregando(false);
        return;
      }

      // Busca as parcelas pagas via endpoint de status
      const dados = await ParcelaRequests.listarPorStatus('pagas');
      if (dados && dados.length > 0) {
        // Mapeia para incluir dados do cliente
        const pagamentosComCliente: Pagamento[] = dados.map((p: any) => {
          const emprestimo = emprestimos.find(e => e.id_emprestimo === p.id_emprestimo);
          const cliente = emprestimo ? clientes.find(c => c.id_cliente === emprestimo.id_cliente) : null;
          
          return {
            id_parcela: p.id_parcela,
            id_emprestimo: p.id_emprestimo,
            numero_parcela: p.numero_parcela,
            valor_pago: p.valor_parcela,
            data_pagamento: p.data_pagamento || new Date().toISOString(),
            cliente_nome: cliente 
              ? `${cliente.nome_cliente} ${cliente.sobrenome_cliente}` 
              : `Cliente #${emprestimo?.id_cliente || 'N/A'}`,
            cliente_telefone: cliente?.telefone || "N/A",
          };
        });
        setPagamentos(pagamentosComCliente);
      } else {
        setPagamentos([]);
      }
    } catch (error) {
      console.error("Erro ao carregar historico de pagamentos:", error);
      setErro("Erro ao carregar historico de pagamentos.");
    } finally {
      setCarregando(false);
    }
  }

  const totalRecebido = pagamentos.reduce((acc, p) => acc + p.valor_pago, 0);

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Histórico de Pagamentos" maxWidth="2xl">
      {carregando && (
        <div className="text-center py-8 text-muted-foreground">Carregando historico...</div>
      )}

      {erro && (
        <div className="text-center py-8 text-red-500 dark:text-red-400">{erro}</div>
      )}

      {!carregando && !erro && (
        <>
          {pagamentos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle size={32} className="mx-auto mb-2 opacity-50" />
              <p>Nenhum pagamento registrado.</p>
            </div>
          ) : (
            <>
              <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-4 mb-4 flex justify-between items-center border border-emerald-200 dark:border-emerald-800">
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Total Recebido</span>
                <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{formatarMoeda(totalRecebido)}</span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {pagamentos.map((p) => (
                  <div
                    key={p.id_parcela}
                    className="bg-muted rounded-xl p-4 border border-border hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-muted-foreground" />
                          <span className="font-medium text-foreground">{p.cliente_nome}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar size={14} className="text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Pago em {formatarDataBR(p.data_pagamento)}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {formatarMoeda(p.valor_pago)}
                      </span>
                    </div>

                    <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                      <span>Empréstimo #{p.id_emprestimo}</span>
                      <span>•</span>
                      <span>Parcela {p.numero_parcela}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </ModalBase>
  );
}

export default ModalHistoricoPagamentos;