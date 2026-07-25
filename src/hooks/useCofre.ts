import { useState, useEffect, useCallback } from 'react';
import CaixaPessoalRequests from '../fetch/CaixaPessoalRequests';
import type { CedulaCofreDTO } from '../interface/CaixaPessoalDTO';

// ============================================================
// useCofre — gerencia o estado do cofre físico
// Responsabilidades:
//   - carregar cédulas da API ao montar
//   - incrementar / decrementar quantidade localmente (otimista)
//   - persistir a alteração na API via PATCH
//   - calcular o total automaticamente
//   - expor estado de carregamento e erro
//
// Sprint 3+: este hook se manterá estável.
// Novos hooks (useMovimentacoes, useContas) seguirão o mesmo padrão.
// ============================================================

// Cédulas exibidas da maior para menor — ordem fixa
export const CEDULAS = [200, 100, 50, 20, 10, 5, 2] as const;

export interface EstadoCedula extends CedulaCofreDTO {
  salvando: boolean; // feedback visual por cédula
}

interface UseCofre {
  cedulas: EstadoCedula[];
  total: number;
  carregando: boolean;
  erro: string | null;
  incrementar: (valor_cedula: number) => Promise<void>;
  decrementar: (valor_cedula: number) => Promise<void>;
}

export function useCofre(): UseCofre {
  const [cedulas, setCedulas] = useState<EstadoCedula[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Total calculado a partir do estado local — sem chamada extra à API
  const total = cedulas.reduce(
    (acc, c) => acc + c.valor_cedula * c.quantidade,
    0
  );

  // ─── CARREGAR COFRE ──────────────────────────────────────────────
  useEffect(() => {
    const carregar = async () => {
      setCarregando(true);
      setErro(null);

      try {
        const dados = await CaixaPessoalRequests.obterCofre();

        if (!dados) {
          setErro('Não foi possível carregar o cofre.');
          return;
        }

        const estado: EstadoCedula[] = dados.cedulas.map((c) => ({
          ...c,
          salvando: false,
        }));

        setCedulas(estado);
      } catch {
        setErro('Erro ao conectar com o servidor.');
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, []);

  // ─── ATUALIZAR CÉDULA ─────────────────────────────────────────────
  // Atualização otimista: altera o estado local imediatamente,
  // depois persiste na API. Se falhar, reverte.
  const atualizarCedula = useCallback(
    async (valor_cedula: number, novaQuantidade: number) => {
      if (novaQuantidade < 0) return;

      // Guarda estado anterior para rollback
      const estadoAnterior = [...cedulas];

      // Atualização otimista + ativa spinner da cédula
      setCedulas((prev) =>
        prev.map((c) =>
          c.valor_cedula === valor_cedula
            ? { ...c, quantidade: novaQuantidade, salvando: true }
            : c
        )
      );

      try {
        const resultado = await CaixaPessoalRequests.atualizarCedula(
          valor_cedula,
          novaQuantidade
        );

        if (!resultado) {
          // Rollback se a API falhar
          setCedulas(estadoAnterior);
          return;
        }

        // Confirma com o valor retornado pela API
        setCedulas((prev) =>
          prev.map((c) =>
            c.valor_cedula === valor_cedula
              ? { ...c, quantidade: resultado.quantidade, salvando: false }
              : c
          )
        );
      } catch {
        // Rollback em caso de erro
        setCedulas(estadoAnterior);
      }
    },
    [cedulas]
  );

  const incrementar = useCallback(
    async (valor_cedula: number) => {
      const cedula = cedulas.find((c) => c.valor_cedula === valor_cedula);
      if (!cedula || cedula.salvando) return;
      await atualizarCedula(valor_cedula, cedula.quantidade + 1);
    },
    [cedulas, atualizarCedula]
  );

  const decrementar = useCallback(
    async (valor_cedula: number) => {
      const cedula = cedulas.find((c) => c.valor_cedula === valor_cedula);
      if (!cedula || cedula.salvando || cedula.quantidade === 0) return;
      await atualizarCedula(valor_cedula, cedula.quantidade - 1);
    },
    [cedulas, atualizarCedula]
  );

  return { cedulas, total, carregando, erro, incrementar, decrementar };
}