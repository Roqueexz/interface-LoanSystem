import { useState, useEffect } from 'react';
import { AlertCircle, User, Phone, Calendar, DollarSign } from 'lucide-react';
import ModalBase from '../Modal/ModalBase';
import CaixaRequests from '../../../fetch/CaixaRequests';
import { formatarMoeda, formatarDataBR } from '../../../services/Utilitario';

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
      carregarParcelas();
    }
  }, [isOpen]);

  async function carregarParcelas() {
    setCarregando(true);
    setErro(null);

    try {
      const dados = await CaixaRequests.obterRelatorioDiario();
      if (dados) {
        // Buscar detalhes dos clientes para cada parcela atrasada
        // Isso e um placeholder - idealmente teria um endpoint especifico
        const parcelasMock: ParcelaAtrasada[] = [
          {
            id_parcela: 1,
            id_emprestimo: 5,
            numero_parcela: 3,
            valor_parcela: 458.33,
            data_vencimento: '2026-04-15',
            cliente_nome: 'Carlos Eduardo Silva',
            cliente_telefone: '(11) 98765-4321',
          },
          {
            id_parcela: 2,
            id_emprestimo: 5,
            numero_parcela: 4,
            valor_parcela: 458.33,
            data_vencimento: '2026-05-15',
            cliente_nome: 'Carlos Eduardo Silva',
            cliente_telefone: '(11) 98765-4321',
          },
        ];
        setParcelas(parcelasMock);
      } else {
        setErro('Nao foi possivel carregar as parcelas atrasadas.');
      }
    } catch {
      setErro('Erro ao carregar parcelas atrasadas.');
    } finally {
      setCarregando(false);
    }
  }

  const totalAtrasado = parcelas.reduce((acc, p) => acc + p.valor_parcela, 0);

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Parcelas em Atraso" maxWidth="2xl">
      {carregando && (
        <div className="text-center py-8 text-slate-400">Carregando parcelas atrasadas...</div>
      )}

      {erro && (
        <div className="text-center py-8 text-red-500">{erro}</div>
      )}

      {!carregando && !erro && (
        <>
          {parcelas.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
              <p>Nenhuma parcela em atraso encontrada.</p>
            </div>
          ) : (
            <>
              <div className="bg-red-50 rounded-xl p-4 mb-4 flex justify-between items-center">
                <span className="text-sm font-medium text-red-700">Total em Atraso</span>
                <span className="text-xl font-bold text-red-700">{formatarMoeda(totalAtrasado)}</span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {parcelas.map((p) => (
                  <div
                    key={p.id_parcela}
                    className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-red-200 transition-all"
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
                      <span className="text-sm font-bold text-red-600">
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

export default ModalParcelasAtrasadas;