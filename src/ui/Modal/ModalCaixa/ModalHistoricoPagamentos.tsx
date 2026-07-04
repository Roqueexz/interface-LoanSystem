import { useState, useEffect } from "react";
import { User, Calendar, CheckCircle } from "lucide-react";
import ModalBase from "../ModalBase"; // ← CORRIGIDO
import { formatarMoeda, formatarDataBR } from "../../../services/Utilitario";


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
      carregarPagamentos();
    }
  }, [isOpen]);

  async function carregarPagamentos() {
    setCarregando(true);
    setErro(null);

    try {
      // Placeholder - idealmente teria um endpoint especifico
      const pagamentosMock: Pagamento[] = [
        {
          id_parcela: 1,
          id_emprestimo: 5,
          numero_parcela: 1,
          valor_pago: 458.33,
          data_pagamento: '2026-02-14',
          cliente_nome: 'Carlos Eduardo Silva',
          cliente_telefone: '(11) 98765-4321',
        },
        {
          id_parcela: 2,
          id_emprestimo: 5,
          numero_parcela: 2,
          valor_pago: 458.33,
          data_pagamento: '2026-03-15',
          cliente_nome: 'Carlos Eduardo Silva',
          cliente_telefone: '(11) 98765-4321',
        },
        {
          id_parcela: 1,
          id_emprestimo: 2,
          numero_parcela: 1,
          valor_pago: 520.83,
          data_pagamento: '2026-04-10',
          cliente_nome: 'Ana Beatriz Rodrigues',
          cliente_telefone: '(21) 99888-7766',
        },
      ];
      setPagamentos(pagamentosMock);
    } catch {
      setErro('Erro ao carregar historico de pagamentos.');
    } finally {
      setCarregando(false);
    }
  }

  const totalRecebido = pagamentos.reduce((acc, p) => acc + p.valor_pago, 0);

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Histórico de Pagamentos" maxWidth="2xl">
      {carregando && (
        <div className="text-center py-8 text-slate-400">Carregando historico...</div>
      )}

      {erro && (
        <div className="text-center py-8 text-red-500">{erro}</div>
      )}

      {!carregando && !erro && (
        <>
          {pagamentos.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <CheckCircle size={32} className="mx-auto mb-2 opacity-50" />
              <p>Nenhum pagamento registrado.</p>
            </div>
          ) : (
            <>
              <div className="bg-emerald-50 rounded-xl p-4 mb-4 flex justify-between items-center">
                <span className="text-sm font-medium text-emerald-700">Total Recebido</span>
                <span className="text-xl font-bold text-emerald-700">{formatarMoeda(totalRecebido)}</span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {pagamentos.map((p) => (
                  <div
                    key={p.id_parcela}
                    className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-emerald-200 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-slate-400" />
                          <span className="font-medium text-slate-800">{p.cliente_nome}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar size={14} className="text-slate-400" />
                          <span className="text-sm text-slate-600">
                            Pago em {formatarDataBR(p.data_pagamento)}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">
                        {formatarMoeda(p.valor_pago)}
                      </span>
                    </div>

                    <div className="flex gap-4 mt-3 text-xs text-slate-500">
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