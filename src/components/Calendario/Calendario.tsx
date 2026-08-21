import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useCalendario } from "../../hooks/useCalendario";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Skeleton } from "../../ui/Skeleton";
import { Alert, AlertDescription, AlertTitle } from "../../ui/Alert";
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  DollarSign,
  Filter,
  Target,
} from "lucide-react";
import { Badge } from "../../ui/Badge";

type VisaoCalendario = "mes" | "semana" | "dia";
type TipoEventoCalendario = "parcela" | "conta" | "meta" | "recebimento";

interface EventoCalendario {
  tipo_evento: string;
  data_evento: string;
  valor: number;
  descricao: string;
  color: string;
  categoria?: string;
  prioridade?: string;
  metadata?: Record<string, unknown>;
}

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const diasDaSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function Calendario() {
  const [searchParams] = useSearchParams();
  const dataParam = searchParams.get("data");
  const filtroParam = searchParams.get("filtro");
  const visaoParam = searchParams.get("visao");

  const {
    eventos,
    previsualizacao,
    carregando,
    erro,
    mesAtual,
    navegarMes,
    formatarValor,
  } = useCalendario();

  const [visao, setVisao] = useState<VisaoCalendario>(() => {
    if (visaoParam === "mes" || visaoParam === "semana" || visaoParam === "dia") {
      return visaoParam;
    }
    return dataParam ? "dia" : "mes";
  });

  const [filtros, setFiltros] = useState<Record<TipoEventoCalendario, boolean>>(() => ({
    recebimento: true,
    parcela: true,
    conta: filtroParam === "recebimento" ? false : true,
    meta: filtroParam === "recebimento" ? false : true,
  }));

  const [dataSelecionada, setDataSelecionada] = useState(() => {
    if (dataParam === "hoje") return new Date().toISOString().slice(0, 10);
    if (dataParam && /^\d{4}-\d{2}-\d{2}$/.test(dataParam)) return dataParam;
    return new Date().toISOString().slice(0, 10);
  });

  useEffect(() => {
    if (visaoParam === "mes" || visaoParam === "semana" || visaoParam === "dia") {
      setVisao(visaoParam);
    } else if (dataParam === "hoje" || dataParam) {
      setVisao("dia");
    }

    if (filtroParam === "recebimento") {
      setFiltros({
        recebimento: true,
        parcela: true,
        conta: false,
        meta: false,
      });
    }
  }, [dataParam, visaoParam, filtroParam]);


  const eventosFiltrados = useMemo(() => {
    const lista = eventos as EventoCalendario[];
    return lista.filter((evento) => filtros[evento.tipo_evento as TipoEventoCalendario] ?? true);
  }, [eventos, filtros]);

  const eventosPorData = useMemo(() => {
    const agrupado: Record<string, EventoCalendario[]> = {};
    eventosFiltrados.forEach((evento) => {
      const chave = evento.data_evento;
      if (!agrupado[chave]) {
        agrupado[chave] = [];
      }
      agrupado[chave].push(evento);
    });
    return agrupado;
  }, [eventosFiltrados]);

  const dataSelecionadaLocal = useMemo(() => new Date(`${dataSelecionada}T00:00:00`), [dataSelecionada]);

  const diasDoMes = useMemo(() => {
    const primeiroDia = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1);
    const ultimoDia = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0);
    const offset = (primeiroDia.getDay() + 6) % 7;
    const dias = [] as Array<number | null>;

    for (let index = 0; index < offset; index += 1) {
      dias.push(null);
    }

    for (let index = 1; index <= ultimoDia.getDate(); index += 1) {
      dias.push(index);
    }

    return dias;
  }, [mesAtual]);

  const diasDaSemanaAtual = useMemo(() => {
    const inicioSemana = new Date(dataSelecionadaLocal);
    const dia = inicioSemana.getDay();
    const diferenca = dia === 0 ? -6 : 1 - dia;
    inicioSemana.setDate(inicioSemana.getDate() + diferenca);

    return Array.from({ length: 7 }, (_, index) => {
      const diaSemana = new Date(inicioSemana);
      diaSemana.setDate(inicioSemana.getDate() + index);
      return diaSemana;
    });
  }, [dataSelecionadaLocal]);

  const detalhesDoDia = useMemo(() => {
    return (eventosPorData[dataSelecionada] ?? []).sort((a, b) => a.valor - b.valor);
  }, [dataSelecionada, eventosPorData]);

  const proximoRecebimentoChave = useMemo(() => {
    const hoje = new Date().toISOString().slice(0, 10);
    const chaves = Object.keys(eventosPorData)
      .filter((chave) => {
        if (chave < hoje) return false;
        const eventos = eventosPorData[chave] || [];
        return eventos.some(
          (e) => e.tipo_evento === "recebimento" || e.tipo_evento === "parcela"
        );
      })
      .sort();
    return chaves.length > 0 ? chaves[0] : null;
  }, [eventosPorData]);

  const alterarFiltro = (tipo: TipoEventoCalendario) => {
    setFiltros((atual) => ({ ...atual, [tipo]: !atual[tipo] }));
  };

  const selecionarDia = (dia: number, irParaDia = true) => {
    const proximaData = `${mesAtual.getFullYear()}-${String(mesAtual.getMonth() + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    setDataSelecionada(proximaData);
    if (irParaDia) {
      setVisao("dia");
    }
  };

  const irParaDiaAnterior = () => {
    const proximo = new Date(dataSelecionadaLocal);
    proximo.setDate(proximo.getDate() - 1);
    setDataSelecionada(proximo.toISOString().slice(0, 10));
  };

  const irParaDiaProximo = () => {
    const proximo = new Date(dataSelecionadaLocal);
    proximo.setDate(proximo.getDate() + 1);
    setDataSelecionada(proximo.toISOString().slice(0, 10));
  };

  const getIconePorTipo = (tipo: string) => {
    switch (tipo) {
      case "recebimento":
        return <CircleDollarSign className="h-3 w-3" />;
      case "conta":
        return <AlertCircle className="h-3 w-3" />;
      case "meta":
        return <Target className="h-3 w-3" />;
      default:
        return <Calendar className="h-3 w-3" />;
    }
  };

  const getCorPorTipo = (tipo: string) => {
    switch (tipo) {
      case "recebimento":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "conta":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "meta":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const totalEventos = (previsualizacao || []).reduce((soma, item) => soma + Number(item.total_eventos ?? 0), 0);
  const totalValor = (previsualizacao || []).reduce((soma, item) => soma + Number(item.total_valor ?? 0), 0);

  if (erro) {
    return (
      <Alert variant="destructive" className="mx-auto mt-8 max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>{erro}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-full w-full bg-background px-4 py-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Calendário Financeiro</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Organize contas, recebimentos e metas em uma visão unificada.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["recebimento", "conta", "meta"] as TipoEventoCalendario[]).map((tipo) => (
              <button
                key={tipo}
                onClick={() => alterarFiltro(tipo)}
                className={`rounded-full border px-3 py-1 text-sm transition ${filtros[tipo] ? getCorPorTipo(tipo) : "border-border bg-muted text-muted-foreground"}`}
              >
                {getIconePorTipo(tipo)}
                <span className="ml-1 capitalize">{tipo === "recebimento" ? "Recebimentos" : tipo}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <button onClick={() => navegarMes("anterior")} className="rounded-full p-2 transition hover:bg-muted">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold">
              {meses[mesAtual.getMonth()]} {mesAtual.getFullYear()}
            </h2>
            <button onClick={() => navegarMes("proximo")} className="rounded-full p-2 transition hover:bg-muted">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-border p-1">
              {(["mes", "semana", "dia"] as VisaoCalendario[]).map((item) => (
                <button
                  key={item}
                  onClick={() => setVisao(item)}
                  className={`rounded-full px-3 py-1 text-sm capitalize transition ${visao === item ? "bg-foreground text-background" : "text-muted-foreground"}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              Filtros ativos
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eventos do mês</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {carregando ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{totalEventos}</div>}
              <p className="mt-2 text-xs text-muted-foreground">Compromissos financeiros</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor total</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              {carregando ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold text-blue-600">{formatarValor(totalValor)}</div>}
              <p className="mt-2 text-xs text-muted-foreground">Soma dos eventos do mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dia selecionado</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dataSelecionadaLocal.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</div>
              <p className="mt-2 text-xs text-muted-foreground">Visualize detalhes do dia em foco</p>
            </CardContent>
          </Card>
        </div>

        {visao === "mes" && (
          <div className="mb-6 grid grid-cols-7 gap-2">
            {diasDaSemana.map((dia) => (
              <div key={dia} className="rounded-lg border border-border p-2 text-center text-sm font-medium text-muted-foreground">
                {dia}
              </div>
            ))}
            {diasDoMes.map((dia, index) => {
              if (dia === null) {
                return <div key={`empty-${index}`} className="min-h-[110px] rounded-lg border border-dashed border-border bg-muted/50" />;
              }

              const chave = `${mesAtual.getFullYear()}-${String(mesAtual.getMonth() + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
              const eventosDia = eventosPorData[chave] ?? [];
              const hoje = dataSelecionada === chave;
              const ehProximoRecebimento = chave === proximoRecebimentoChave;

              return (
                <button
                  key={dia}
                  onClick={() => selecionarDia(dia)}
                  className={`min-h-[110px] rounded-lg border p-2 text-left transition relative ${
                    ehProximoRecebimento
                      ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/25 ring-1 ring-emerald-500/40 shadow-xs"
                      : hoje
                      ? "border-foreground bg-foreground/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span>{dia}</span>
                      {ehProximoRecebimento && (
                        <span className="inline-flex items-center rounded-full bg-emerald-600 px-1.5 py-0.5 text-[9px] font-extrabold text-white shadow-xs">
                          Próximo
                        </span>
                      )}
                    </div>
                    {eventosDia.length > 0 && <Badge variant="secondary">{eventosDia.length}</Badge>}
                  </div>
                  <div className="space-y-1">
                    {eventosDia.slice(0, 3).map((evento, eventoIndex) => (
                      <div key={`${chave}-${eventoIndex}`} className={`flex items-center gap-1 rounded px-2 py-1 text-[11px] ${getCorPorTipo(evento.tipo_evento)}`}>
                        {getIconePorTipo(evento.tipo_evento)}
                        <span>{formatarValor(evento.valor)}</span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {visao === "semana" && (
          <div className="mb-6 grid grid-cols-1 gap-2 md:grid-cols-7">
            {diasDaSemanaAtual.map((dia, index) => {
              const chave = `${dia.getFullYear()}-${String(dia.getMonth() + 1).padStart(2, "0")}-${String(dia.getDate()).padStart(2, "0")}`;
              const eventosDia = eventosPorData[chave] ?? [];
              const ehProximoRecebimento = chave === proximoRecebimentoChave;

              return (
                <button
                  key={chave}
                  onClick={() => setDataSelecionada(chave)}
                  className={`rounded-xl border p-3 text-left transition ${
                    ehProximoRecebimento
                      ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/25 ring-1 ring-emerald-500/40 shadow-xs"
                      : dataSelecionada === chave
                      ? "border-foreground bg-foreground/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span>{diasDaSemana[index]}</span>
                      {ehProximoRecebimento && (
                        <span className="inline-flex items-center rounded-full bg-emerald-600 px-1.5 py-0.5 text-[9px] font-extrabold text-white shadow-xs">
                          Próximo
                        </span>
                      )}
                    </div>
                    {eventosDia.length > 0 && <Badge variant="secondary">{eventosDia.length}</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {dia.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  </div>
                  <div className="mt-2 space-y-1">
                    {eventosDia.slice(0, 3).map((evento, eventoIndex) => (
                      <div key={`${chave}-${eventoIndex}`} className={`rounded px-2 py-1 text-[11px] ${getCorPorTipo(evento.tipo_evento)}`}>
                        {evento.descricao}
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {visao === "dia" && (
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Detalhes do dia</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {dataSelecionadaLocal.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={irParaDiaAnterior} className="rounded-full border border-border p-2">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={irParaDiaProximo} className="rounded-full border border-border p-2">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {detalhesDoDia.length > 0 ? (
                <div className="space-y-3">
                  {detalhesDoDia.map((evento, index) => (
                    <div key={`${evento.data_evento}-${index}`} className="flex flex-col gap-2 rounded-lg border border-border p-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2 py-1 text-xs ${getCorPorTipo(evento.tipo_evento)}`}>
                            {evento.tipo_evento === "recebimento" ? "Recebimento" : evento.tipo_evento}
                          </span>
                          <span className="text-sm font-semibold">{evento.descricao}</span>
                        </div>
                        {evento.categoria && <p className="mt-1 text-sm text-muted-foreground">Categoria: {evento.categoria}</p>}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatarValor(evento.valor)}</div>
                        {evento.prioridade && <p className="text-xs text-muted-foreground">Prioridade: {evento.prioridade}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Nenhum compromisso financeiro para este dia.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Resumo do mês</CardTitle>
          </CardHeader>
          <CardContent>
            {carregando ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <div className="space-y-3">
                {(previsualizacao || []).map((item, index) => {
                  const data = new Date(item.data_evento);
                  const tipos = item.tipos || [];
                  return (
                    <div key={`${item.data_evento}-${index}`} className="flex flex-col gap-2 border-b border-border pb-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="font-medium">{data.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}</div>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {tipos.map((tipo: string, tipoIndex: number) => (
                            <Badge key={`${tipo}-${tipoIndex}`} variant="secondary" className="flex items-center gap-1">
                              {getIconePorTipo(tipo)}
                              <span>{tipo}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.total_eventos} evento{item.total_eventos > 1 ? "s" : ""} • {formatarValor(item.total_valor)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
