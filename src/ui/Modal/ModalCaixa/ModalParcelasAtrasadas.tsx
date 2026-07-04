import { useState, useEffect } from "react";
import { AlertCircle, User, Phone } from "lucide-react";
import ModalBase from "../ModalBase";
import { formatarMoeda, formatarDataBR } from "../../../services/Utilitario";
import ParcelaRequests from "../../../fetch/ParcelaRequests";
import EmprestimoRequests from "../../../fetch/EmprestimoRequests";

interface ParcelaAtrasada {
  id_parcela: number;
  id_emprestimo: number;
  numero_parcela: number;
  valor_parcela: number;
  data_vencimento: string;
  cliente_nome: string;
  cliente_telefone: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function ModalParcelasAtrasadas({ isOpen, onClose }: Props) {
  const [parcelas, setParcelas] = useState<ParcelaAtrasada[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      carregarParcelasAtrasadas();
    }
  }, [isOpen]);

  async function carregarParcelasAtrasadas() {
    setCarregando(true);
    setErro(null);

    try {
      // Busca todos os empréstimos para ter os clientes
      const emprestimos = await EmprestimoRequests.obterListaDeEmprestimos();
      if (!emprestimos) {
        setErro("Erro ao carregar dados.");
        setCarregando(false);
        return;
      }

      // Busca as parcelas atrasadas via endpoint de status
      const dados = await ParcelaRequests.listarPorStatus('atrasadas');
      if (dados && dados.length > 0) {
        // Mapeia para incluir dados do cliente
        const parcelasComCliente = dados.map((p: any) => {
          const emprestimo = emprestimos.find(e => e.id_emprestimo === p.id_emprestimo);
          return {
            id_parcela: p.id_parcela,
            id_emprestimo: p.id_emprestimo,
            numero_parcela: p.numero_parcela,
            valor_parcela: p.valor_parcela,
            data_vencimento: p.data_vencimento,
            cliente_nome: emprestimo ? `Cliente #${emprestimo.id_cliente}` : "N/A",
            cliente_telefone: "N/A",
          };
        });
        setParcelas(parcelasComCliente);
      } else {
        setParcelas([]);
      }
    } catch (error) {
      console.error("Erro ao carregar parcelas atrasadas:", error);
      setErro("Erro ao carregar parcelas atrasadas.");
    } finally {
      setCarregando(false);
    }
  }

  const totalAtrasado = parcelas.reduce((acc, p) => acc + p.valor_parcela, 0);

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Parcelas em Atraso" maxWidth="2xl">
      {carregando && (
        <div className="text-center py-8 text-muted-foreground">Carregando parcelas atrasadas...</div>
      )}

      {erro && (
        <div className="text-center py-8 text-red-500 dark:text-red-400">{erro}</div>
      )}

      {!carregando && !erro && (
        <>
          {parcelas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
              <p>Nenhuma parcela em atraso encontrada.</p>
            </div>
          ) : (
            <>
              <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-4 mb-4 flex justify-between items-center border border-red-200 dark:border-red-800">
                <span className="text-sm font-medium text-red-700 dark:text-red-400">Total em Atraso</span>
                <span className="text-xl font-bold text-red-700 dark:text-red-400">{formatarMoeda(totalAtrasado)}</span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {parcelas.map((p) => (
                  <div
                    key={p.id_parcela}
                    className="bg-muted rounded-xl p-4 border border-border hover:border-red-300 dark:hover:border-red-700 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-muted-foreground" />
                          <span className="font-medium text-foreground">{p.cliente_nome}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone size={14} className="text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{p.cliente_telefone}</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-red-600 dark:text-red-400">
                        {formatarMoeda(p.valor_parcela)}
                      </span>
                    </div>

                    <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                      <span>Empréstimo #{p.id_emprestimo}</span>
                      <span>•</span>
                      <span>Parcela {p.numero_parcela}</span>
                      <span>•</span>
                      <span>Vencimento: {formatarDataBR(p.data_vencimento)}</span>
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

export default ModalParcelasAtrasadas;