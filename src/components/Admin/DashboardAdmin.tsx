import { useState } from 'react';
import { Users, UserCheck, Wallet, DollarSign, Plus, Ban, CheckCircle2, Trash2, Search, Shield, Loader2 } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import { formatarMoeda } from '../../services/Utilitario';
import type { CredorDTO } from '../../fetch/AdminRequests';
import ModalCriarCredor from './ModalCriarCredor';
import ModalConfirmacao from '../../ui/Modal/ModalConfirmacao';

function DashboardAdmin() {
  const { credores, resumoGlobal, carregando, criarCredor, suspenderCredor, reativarCredor, removerCredor } = useAdmin();

  const [termoBusca, setTermoBusca] = useState('');
  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [credorAcao, setCredorAcao] = useState<{ credor: CredorDTO; tipo: 'suspender' | 'reativar' | 'remover' } | null>(null);

  const credoresFiltrados = credores.filter(
    (c) =>
      c.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      c.email.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const handleConfirmarAcao = async () => {
    if (!credorAcao) return;
    const { credor, tipo } = credorAcao;

    if (tipo === 'suspender') {
      await suspenderCredor(credor.id_usuario);
    } else if (tipo === 'reativar') {
      await reativarCredor(credor.id_usuario);
    } else if (tipo === 'remover') {
      await removerCredor(credor.id_usuario);
    }

    setCredorAcao(null);
  };

  return (
    <div className="space-y-6">
      {/* Header do Painel Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-background p-6 rounded-3xl border border-indigo-500/20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">
              ⚡ Painel Admin — Gestão SaaS
            </h2>
            <p className="text-xs text-muted-foreground">
              Administração global de credores, métricas e controle de acessos
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setModalCriarAberto(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 transition-all"
        >
          <Plus size={16} /> Cadastrar Novo Credor
        </button>
      </div>

      {/* Cards de Métricas Globais */}
      {carregando ? (
        <div className="flex items-center justify-center p-8 bg-card rounded-3xl border border-border">
          <Loader2 size={24} className="animate-spin text-indigo-500 mr-2" />
          <span className="text-xs text-muted-foreground font-medium">Carregando métricas globais...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-card border border-border p-4 sm:p-5 rounded-3xl shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Credores Totais
              </span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                <Users size={18} />
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-foreground block">
              {resumoGlobal?.totalCredores || 0}
            </span>
          </div>

          <div className="bg-card border border-border p-4 sm:p-5 rounded-3xl shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Credores Ativos
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <UserCheck size={18} />
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 block">
              {resumoGlobal?.credoresAtivos || 0}
            </span>
          </div>

          <div className="bg-card border border-border p-4 sm:p-5 rounded-3xl shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Clientes no Sistema
              </span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                <Wallet size={18} />
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-foreground block">
              {resumoGlobal?.totalClientes || 0}
            </span>
          </div>

          <div className="bg-card border border-border p-4 sm:p-5 rounded-3xl shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Volume Emprestado
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <DollarSign size={18} />
              </div>
            </div>
            <span className="text-xl sm:text-2xl font-black text-foreground block truncate">
              {formatarMoeda(resumoGlobal?.volumeTotal || 0)}
            </span>
          </div>
        </div>
      )}

      {/* Lista de Credores */}
      <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
            <span>👥 Credores Cadastrados</span>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
              {credoresFiltrados.length}
            </span>
          </h3>

          {/* Campo de Busca */}
          <div className="relative max-w-xs w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-muted/40 border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Tabela Desktop / Cards Mobile */}
        <div className="space-y-3">
          {credoresFiltrados.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-xs font-medium">
              Nenhum credor encontrado.
            </div>
          ) : (
            credoresFiltrados.map((credor) => {
              const iniciais = credor.nome
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={credor.id_usuario}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/60 hover:border-indigo-500/30 transition-all gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 font-extrabold flex items-center justify-center text-sm shrink-0 border border-indigo-500/30">
                      {iniciais}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground">{credor.nome}</h4>
                        {credor.role === 'admin' ? (
                          <span className="text-[10px] font-extrabold uppercase bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                            ADMIN
                          </span>
                        ) : credor.ativo ? (
                          <span className="text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            ● Ativo
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold uppercase bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            ● Suspenso
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{credor.email}</p>
                    </div>
                  </div>

                  {/* Métricas do Credor */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground border-t sm:border-t-0 border-border pt-2 sm:pt-0">
                    <div>
                      <span className="block font-bold text-foreground">{credor.total_clientes}</span>
                      <span className="text-[10px]">Clientes</span>
                    </div>
                    <div>
                      <span className="block font-bold text-foreground">{credor.total_emprestimos}</span>
                      <span className="text-[10px]">Empréstimos</span>
                    </div>
                    <div>
                      <span className="block font-bold text-foreground">{formatarMoeda(credor.volume_emprestimos)}</span>
                      <span className="text-[10px]">Volume</span>
                    </div>

                    {/* Ações */}
                    {credor.role !== 'admin' && (
                      <div className="flex items-center gap-1.5 ml-auto sm:ml-2">
                        {credor.ativo ? (
                          <button
                            type="button"
                            onClick={() => setCredorAcao({ credor, tipo: 'suspender' })}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-all active:scale-95"
                            title="Suspender acesso"
                          >
                            <Ban size={14} />
                            <span>Suspender</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setCredorAcao({ credor, tipo: 'reativar' })}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all active:scale-95"
                            title="Reativar acesso"
                          >
                            <CheckCircle2 size={14} />
                            <span>Reativar</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setCredorAcao({ credor, tipo: 'remover' })}
                          className="p-1.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Remover credor"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal Novo Credor */}
      <ModalCriarCredor
        isOpen={modalCriarAberto}
        onClose={() => setModalCriarAberto(false)}
        onConfirm={criarCredor}
      />

      {/* Modal Confirmação de Ação */}
      <ModalConfirmacao
        isOpen={!!credorAcao}
        onClose={() => setCredorAcao(null)}
        onConfirm={handleConfirmarAcao}
        title={
          credorAcao?.tipo === 'suspender'
            ? 'Suspender Credor'
            : credorAcao?.tipo === 'reativar'
            ? 'Reativar Credor'
            : 'Remover Credor'
        }
        message={
          credorAcao?.tipo === 'suspender'
            ? `Tem certeza que deseja suspender o credor "${credorAcao?.credor.nome}"? Ele ficará temporariamente impedido de acessar o sistema.`
            : credorAcao?.tipo === 'reativar'
            ? `Deseja reativar o acesso do credor "${credorAcao?.credor.nome}"?`
            : `Tem certeza que deseja remover o credor "${credorAcao?.credor.nome}"? Todos os seus dados serão apagados permanentemente.`
        }
        confirmText={
          credorAcao?.tipo === 'suspender'
            ? 'Suspender Acesso'
            : credorAcao?.tipo === 'reativar'
            ? 'Reativar Acesso'
            : 'Excluir Credor'
        }
        cancelText="Cancelar"
        variant={credorAcao?.tipo === 'reativar' ? 'info' : 'danger'}
      />
    </div>
  );
}

export default DashboardAdmin;
