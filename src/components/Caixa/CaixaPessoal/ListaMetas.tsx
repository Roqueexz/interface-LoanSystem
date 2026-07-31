import { Plus, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useMetas } from '../../../hooks/useMetas';
import ItemMeta from './ItemMeta';
import NovaMetaModal from './NovaMetaModal';
import EmptyState from '../../../ui/EmptyState';

function ListaMetas() {
  const { metas, carregando, totalAlvo, totalAtual, progressoMedio, criarMeta, atualizarMeta, removerMeta } = useMetas();
  const [modalOpen, setModalOpen] = useState(false);
  const [metaEditando, setMetaEditando] = useState<null | typeof metas[number]>(null);

  const abrirModalParaEdicao = (meta: typeof metas[number]) => {
    setMetaEditando(meta);
    setModalOpen(true);
  };

  const fecharModal = () => {
    setMetaEditando(null);
    setModalOpen(false);
  };

  const salvarMeta = async (payload: {
    nome: string;
    descricao?: string;
    valorAlvo: number;
    valorAtual?: number;
    prazo?: string;
  }, id?: string) => {
    if (id) {
      await atualizarMeta(id, payload);
      return;
    }

    await criarMeta(payload);
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm">
      <div className="flex flex-col gap-4 px-6 py-4 border-b border-border md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Metas financeiras</h3>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>{metas.length} meta(s)</span>
            <span>Progresso médio: {progressoMedio.toFixed(2)}%</span>
            <span>Meta total: R$ {totalAlvo.toFixed(2)}</span>
            <span>Contribuído: R$ {totalAtual.toFixed(2)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-white"
        >
          <Plus size={14} /> Nova meta
        </button>
      </div>

      <div className="px-6 py-4">
        {carregando ? (
          <div>Carregando metas...</div>
        ) : metas.length === 0 ? (
          <EmptyState
            mensagem="Nenhuma meta cadastrada"
            descricao="Crie metas financeiras para acompanhar seu progresso e prazos."
            icone={<TrendingUp size={26} className="text-muted-foreground/50" />}
          />
        ) : (
          <div className="space-y-3">
            {metas.map((meta) => (
              <ItemMeta key={meta.id} meta={meta} onEdit={abrirModalParaEdicao} onRemove={removerMeta} />
            ))}
          </div>
        )}
      </div>

      <NovaMetaModal
        isOpen={modalOpen}
        onClose={fecharModal}
        onSave={salvarMeta}
        meta={metaEditando ?? undefined}
      />
    </div>
  );
}

export default ListaMetas;
