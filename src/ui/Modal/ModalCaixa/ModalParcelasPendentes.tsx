import { useState, useEffect } from 'react';
import { Wallet, User, Phone, Calendar, DollarSign } from 'lucide-react';
import ModalBase from '../../ui/Modal/ModalBase';
import { formatarMoeda, formatarDataBR } from '../../services/Utilitario';

interface ParcelaPendente {
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

function ModalParcelasPendentes({ isOpen, onClose }: Props) {
  const [parcelas, setParcelas] = useState<ParcelaPendente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      carregarParcelas();
    }
  }, [isOpen]);

  async function carregarParcelas() {
    setCarregando(true);
    setErro(null);

    try {
      // Placeholder - idealmente teria um endpoint especifico
      const parcelasMock: ParcelaPendente[] = [
        {
          id_parcela: 3,
          id_emprestimo: 5,
          numero_parcela: 5,
          valor_parcela: 458.33,
          data_vencimento: '2026-06-15',
          cliente_nome: 'Carlos Eduardo Silva',
          cliente_telefone: '(11) 98765-4321',
        },
        {
          id_parcela: 4,
          id_emprestimo: 2,
          numero_parcela: 2,
          valor_parcela: 520.83,
          data_vencimento: '2026-05-10',
          cliente_nome: 'Ana Beatriz Rodrigues',
          cliente_telefone: '(21) 99888-7766',
        },
      ];
      setParcelas(parcelasMock);
    } catch {
      setErro('Erro ao carregar parcelas pendentes.');
    } finally {
      setCarregando(false);
    }
  }

  const totalPendente = parcelas.reduce((acc, p) => acc + p.valor_parcela, 0);

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Parcelas a Receber" maxWidth="2xl">
      {carregando && (
        <div className="text-center py-8 text-slate-400">Carregando parcelas pendentes...</div>
      )}

      {erro && (
        <div className="text-center py-8 text-red-500">{erro}</div>
      )}

      {!carregando && !erro && (
        <>
          {parcelas.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Wallet size={32} className="mx-auto mb-2 opacity-50" />
              <p>Nenhuma parcela pendente encontrada.</p>
            </div>
          ) : (
            <>
              <div className="bg-amber-50 rounded-xl p-4 mb-4 flex justify-between items-center">
                <span className="text-sm font-medium text-amber-700">Total a Receber</span>
                <span className="text-xl font-bold text-amber-700">{formatarMoeda(totalPendente)}</span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {parcelas.map((p) => (
                  <div
                    key={p.id_parcela}
                    className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-amber-200 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-slate-400" />
                          <span className="font-medium text-slate-800">{p.cliente_nome}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone size={14} className="text-slate-400" />
                          <span className="text-sm text-slate-600">{p.cliente_telefone}</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-amber-600">
                        {formatarMoeda(p.valor_parcela)}
                      </span>
                    </div>

                    <div className="flex gap-4 mt-3 text-xs text-slate-500">
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

export default ModalParcelasPendentes;