import { formatarMoeda } from "../../../services/Utilitario";

interface DadoGrafico {
  mes: string;
  recebido: number;
  emprestado: number;
}

interface Props {
  dados: DadoGrafico[];
  titulo?: string;
}

function GraficoMensal({ dados, titulo = "Evolução Mensal" }: Props) {
  if (!dados || dados.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        Nenhum dado disponível para exibir no gráfico.
      </div>
    );
  }

  const maxValor = Math.max(
    ...dados.flatMap((d) => [d.recebido, d.emprestado]),
    1
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h3 className="text-base font-semibold text-slate-700 mb-4">{titulo}</h3>

      <div className="flex items-end h-64 gap-3">
        {dados.map((item, index) => {
          const alturaRecebido = (item.recebido / maxValor) * 100;
          const alturaEmprestado = (item.emprestado / maxValor) * 100;

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <div className="flex items-end gap-1 w-full h-52">
                {/* Barra de Emprestado */}
                <div className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-indigo-200 rounded-t-lg transition-all duration-500 hover:opacity-80"
                    style={{ height: `${Math.max(alturaEmprestado, 4)}%` }}
                  />
                  <span className="text-[8px] text-slate-400 mt-1 font-medium">
                    {item.emprestado > 0 ? formatarMoeda(item.emprestado) : ""}
                  </span>
                </div>

                {/* Barra de Recebido */}
                <div className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-emerald-400 rounded-t-lg transition-all duration-500 hover:opacity-80"
                    style={{ height: `${Math.max(alturaRecebido, 4)}%` }}
                  />
                  <span className="text-[8px] text-slate-400 mt-1 font-medium">
                    {item.recebido > 0 ? formatarMoeda(item.recebido) : ""}
                  </span>
                </div>
              </div>

              <span className="text-xs font-medium text-slate-500 mt-2">
                {item.mes}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-400 rounded" />
          <span className="text-xs text-slate-600">Recebido</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-indigo-200 rounded" />
          <span className="text-xs text-slate-600">Emprestado</span>
        </div>
      </div>
    </div>
  );
}

export default GraficoMensal;