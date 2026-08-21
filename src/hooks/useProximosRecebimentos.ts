import { useState, useEffect, useCallback, useMemo } from 'react';
import ParcelaRequests from '../fetch/ParcelaRequests';
import CaixaPessoalRequests from '../fetch/CaixaPessoalRequests';
import type ParcelaDTO from '../interface/ParcelaDTO';
import type { ContaCaixaPessoalDTO } from '../interface/CaixaPessoalDTO';

export interface UseProximosRecebimentos {
  totalRecebimentos: number;
  totalParcelas: number;
  totalContasReceber: number;
  parcelas: ParcelaDTO[];
  contasReceber: ContaCaixaPessoalDTO[];
  carregando: boolean;
  erro: string | null;
  recarregar: () => Promise<void>;
}

export function useProximosRecebimentos(): UseProximosRecebimentos {
  const [parcelas, setParcelas] = useState<ParcelaDTO[]>([]);
  const [contasReceber, setContasReceber] = useState<ContaCaixaPessoalDTO[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);

    try {
      const agora = new Date();
      const mes = agora.getMonth() + 1;
      const ano = agora.getFullYear();

      const [resParcelas, resContas] = await Promise.all([
        ParcelaRequests.listarParcelasVencendoNoMes(mes, ano),
        CaixaPessoalRequests.listarContas({ status: 'pendente' }),
      ]);

      if (resParcelas) {
        setParcelas(resParcelas);
      }

      if (resContas) {
        // Filtra contas do tipo 'receber' que não estejam pagas nem canceladas
        const contasDoMes = resContas.filter((c) => {
          if (c.tipo !== 'receber' || c.pago || c.status === 'cancelada') {
            return false;
          }
          if (!c.vencimento) return true;
          const venc = new Date(c.vencimento);
          return (
            venc.getFullYear() === ano &&
            venc.getMonth() + 1 === mes
          );
        });
        setContasReceber(contasDoMes);
      }
    } catch (e: any) {
      console.error('[useProximosRecebimentos] Erro ao carregar próximos recebimentos:', e);
      setErro('Erro ao carregar previsão de recebimentos.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const totalParcelas = useMemo(() => {
    return parcelas.reduce((acc, p) => acc + Number(p.valor_parcela || 0), 0);
  }, [parcelas]);

  const totalContasReceber = useMemo(() => {
    return contasReceber.reduce((acc, c) => acc + Number(c.valor || 0), 0);
  }, [contasReceber]);

  const totalRecebimentos = useMemo(() => {
    return totalParcelas + totalContasReceber;
  }, [totalParcelas, totalContasReceber]);

  return {
    totalRecebimentos,
    totalParcelas,
    totalContasReceber,
    parcelas,
    contasReceber,
    carregando,
    erro,
    recarregar: carregar,
  };
}

export default useProximosRecebimentos;
