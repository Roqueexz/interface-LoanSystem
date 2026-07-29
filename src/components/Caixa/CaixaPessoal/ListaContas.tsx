import { Plus, Search } from 'lucide-react';
import EmptyState from '../../../ui/EmptyState';
import ItemConta from './ItemConta';
import NovaContaModal from './NovaContaModal';
import { useEffect, useMemo, useState } from 'react';
import { useContas } from '../../../hooks/useContas';

function ListaContas() {
  const { contas, proximasContas, contasAtrasadas, contasProgramadas, buscarContas, carregando, pagarConta, removerConta, recarregar } = useContas();
  const [modalOpen, setModalOpen] = useState(false);
  const [pesquisa, setPesquisa] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [recorrenciaFiltro, setRecorrenciaFiltro] = useState('');
  const [prioridadeFiltro, setPrioridadeFiltro] = useState('');

  const filtrosAtivos = Boolean(statusFiltro || categoriaFiltro || recorrenciaFiltro || prioridadeFiltro);

  useEffect(() => {
    if (!filtrosAtivos) return;

    void recarregar({
      status: statusFiltro || undefined,
      categoria: categoriaFiltro || undefined,
      recorrencia: recorrenciaFiltro || undefined,
      prioridade: prioridadeFiltro || undefined,
    });
  }, [statusFiltro, categoriaFiltro, recorrenciaFiltro, prioridadeFiltro, recarregar, filtrosAtivos]);

  const resultadosPesquisa = pesquisa ? buscarContas(pesquisa) : [];

  const totalReservado = useMemo(() => {
    return contas
      .filter((conta) => conta.tipo === 'pagar' && !conta.pago && conta.status !== 'cancelada')
      .reduce((sum, conta) => sum + conta.valor, 0);
  }, [contas]);

  const limparFiltros = () => {
    setStatusFiltro('');
    setCategoriaFiltro('');
    setRecorrenciaFiltro('');
    setPrioridadeFiltro('');
    void recarregar();
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm">
      <div className="flex flex-col gap-4 px-6 py-4 border-b border-border md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-foreground">Contas & Reservas</h3>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>{proximasContas.length} próximas</span>
            <span>{contasAtrasadas.length} atrasadas</span>
            <span>{contasProgramadas.length} programadas</span>
            <span>Reservado: R$ {totalReservado.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              placeholder="Pesquisar conta..."
              className="w-full sm:w-72 pl-10 pr-3 py-2 rounded-lg border border-border bg-input text-sm"
            />
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg"
          >
            <Plus size={14} /> Nova conta
          </button>
        </div>
      </div>

      <div className="grid gap-3 px-6 py-4 border-b border-border sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Status</label>
          <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)} className="w-full rounded-lg border border-border bg-input p-2 text-sm">
            <option value="">Todas</option>
            <option value="programada">Programada</option>
            <option value="pendente">Pendente</option>
            <option value="atrasada">Atrasada</option>
            <option value="paga">Paga</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1">Categoria</label>
          <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)} className="w-full rounded-lg border border-border bg-input p-2 text-sm">
            <option value="">Todas</option>
            <option value="Aluguel">Aluguel</option>
            <option value="Energia">Energia</option>
            <option value="Internet">Internet</option>
            <option value="Funcionários">Funcionários</option>
            <option value="Impostos">Impostos</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1">Recorrência</label>
          <select value={recorrenciaFiltro} onChange={(e) => setRecorrenciaFiltro(e.target.value)} className="w-full rounded-lg border border-border bg-input p-2 text-sm">
            <option value="">Todas</option>
            <option value="unica">Única</option>
            <option value="diaria">Diária</option>
            <option value="semanal">Semanal</option>
            <option value="quinzenal">Quinzenal</option>
            <option value="mensal">Mensal</option>
            <option value="bimestral">Bimestral</option>
            <option value="trimestral">Trimestral</option>
            <option value="semestral">Semestral</option>
            <option value="anual">Anual</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1">Prioridade</label>
          <select value={prioridadeFiltro} onChange={(e) => setPrioridadeFiltro(e.target.value)} className="w-full rounded-lg border border-border bg-input p-2 text-sm">
            <option value="">Todas</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>
        </div>
      </div>

      {filtrosAtivos ? (
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 text-xs text-muted-foreground">
          <span>Filtros aplicados</span>
          <button type="button" onClick={limparFiltros} className="text-primary hover:underline">
            Limpar filtros
          </button>
        </div>
      ) : null}

      <div className="px-6 py-4 space-y-6">
        {carregando ? (
          <div>Carregando...</div>
        ) : pesquisa ? (
          resultadosPesquisa.length === 0 ? (
            <EmptyState
              mensagem="Nenhum resultado encontrado."
              descricao="Tente outro termo de pesquisa ou remova filtros."
              icone={<Search size={26} className="text-muted-foreground/50" />}
            />
          ) : (
            <div className="space-y-3">
              {resultadosPesquisa.map((c) => (
                <ItemConta
                  key={c.id}
                  conta={c}
                  onPagar={async (id) => await pagarConta(id)}
                  onRemover={async (id) => await removerConta(id)}
                />
              ))}
            </div>
          )
        ) : (
          <div className="space-y-6">
            <section>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Próximas contas</h4>
                  <p className="text-xs text-muted-foreground">O que precisa ser pago nos próximos dias.</p>
                </div>
                <span className="text-xs text-muted-foreground">{proximasContas.length} item(s)</span>
              </div>
              {proximasContas.length === 0 ? (
                <EmptyState
                  mensagem="Nenhuma conta próxima."
                  descricao="Você está com o próximo período em dia."
                  icone={<Plus size={26} className="text-muted-foreground/50" />}
                />
              ) : (
                <div className="space-y-3">
                  {proximasContas.map((c) => (
                    <ItemConta
                      key={c.id}
                      conta={c}
                      onPagar={async (id) => await pagarConta(id)}
                      onRemover={async (id) => await removerConta(id)}
                    />
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Contas atrasadas</h4>
                  <p className="text-xs text-muted-foreground">O que exige atenção imediata.</p>
                </div>
                <span className="text-xs text-muted-foreground">{contasAtrasadas.length} item(s)</span>
              </div>
              {contasAtrasadas.length === 0 ? (
                <EmptyState
                  mensagem="Nenhuma conta atrasada."
                  descricao="Ótimo! As suas contas estão em dia."
                  icone={<Plus size={26} className="text-muted-foreground/50" />}
                />
              ) : (
                <div className="space-y-3">
                  {contasAtrasadas.map((c) => (
                    <ItemConta
                      key={c.id}
                      conta={c}
                      onPagar={async (id) => await pagarConta(id)}
                      onRemover={async (id) => await removerConta(id)}
                    />
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Contas programadas</h4>
                  <p className="text-xs text-muted-foreground">Compromissos agendados que ainda não venceram.</p>
                </div>
                <span className="text-xs text-muted-foreground">{contasProgramadas.length} item(s)</span>
              </div>
              {contasProgramadas.length === 0 ? (
                <EmptyState
                  mensagem="Nenhuma conta programada."
                  descricao="Você pode registrar contas futuras e acompanhar quando elas serão pagas."
                  icone={<Plus size={26} className="text-muted-foreground/50" />}
                />
              ) : (
                <div className="space-y-3">
                  {contasProgramadas.map((c) => (
                    <ItemConta
                      key={c.id}
                      conta={c}
                      onPagar={async (id) => await pagarConta(id)}
                      onRemover={async (id) => await removerConta(id)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      <NovaContaModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default ListaContas;
