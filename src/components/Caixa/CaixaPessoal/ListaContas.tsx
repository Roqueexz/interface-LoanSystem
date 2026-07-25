import { Plus } from 'lucide-react';
import EmptyState from '../../../ui/EmptyState';
import ItemConta from './ItemConta';
import NovaContaModal from './NovaContaModal';
import { useState } from 'react';
import { useContas } from '../../../hooks/useContas';

function ListaContas() {
  const { contas, carregando, pagarConta, removerConta } = useContas();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Contas & Reservas</h3>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg"
        >
          <Plus size={14} /> Nova conta
        </button>
      </div>

      <div className="px-6 py-4">
        {carregando ? (
          <div>Carregando...</div>
        ) : contas.length === 0 ? (
          <EmptyState
            mensagem="Nenhuma conta cadastrada."
            descricao="Adicione contas a pagar ou a receber para acompanhar seus compromissos."
            icone={<Plus size={26} className="text-muted-foreground/50" />}
          />
        ) : (
          <div className="space-y-3">
            {contas.map((c) => (
              <ItemConta
                key={c.id}
                conta={c}
                onPagar={async (id) => await pagarConta(id)}
                onRemover={async (id) => await removerConta(id)}
              />
            ))}
          </div>
        )}
      </div>

      <NovaContaModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default ListaContas;
