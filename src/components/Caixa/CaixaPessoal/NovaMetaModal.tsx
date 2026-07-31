import { useEffect, useState } from 'react';
import ModalBase from '../../../ui/Modal/ModalBase';
import type { MetaFinanceiraDTO } from '../../../interface/CaixaPessoalDTO';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: {
    nome: string;
    descricao?: string;
    valorAlvo: number;
    valorAtual?: number;
    prazo?: string;
  }, id?: string) => Promise<void>;
  meta?: MetaFinanceiraDTO;
}

function NovaMetaModal({ isOpen, onClose, onSave, meta }: Props) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valorAlvo, setValorAlvo] = useState('');
  const [valorAtual, setValorAtual] = useState('');
  const [prazo, setPrazo] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!meta) {
      setNome('');
      setDescricao('');
      setValorAlvo('');
      setValorAtual('');
      setPrazo('');
      return;
    }

    setNome(meta.nome);
    setDescricao(meta.descricao ?? '');
    setValorAlvo(String(meta.valorAlvo));
    setValorAtual(String(meta.valorAtual));
    setPrazo(meta.prazo ?? '');
  }, [meta]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim() || !valorAlvo || Number(valorAlvo) <= 0) return;

    setSalvando(true);

    await onSave(
      {
        nome: nome.trim(),
        descricao: descricao.trim() || undefined,
        valorAlvo: Number(valorAlvo),
        valorAtual: valorAtual ? Number(valorAtual) : undefined,
        prazo: prazo || undefined,
      },
      meta?.id
    );

    setSalvando(false);
    onClose();
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={meta ? 'Editar Meta' : 'Nova Meta'} maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Nome da meta</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-lg border border-border bg-input p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1">Descrição</label>
          <input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full rounded-lg border border-border bg-input p-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Valor alvo</label>
            <input
              value={valorAlvo}
              onChange={(e) => setValorAlvo(e.target.value)}
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-lg border border-border bg-input p-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Valor atual</label>
            <input
              value={valorAtual}
              onChange={(e) => setValorAtual(e.target.value)}
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-lg border border-border bg-input p-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1">Prazo</label>
          <input
            value={prazo}
            onChange={(e) => setPrazo(e.target.value)}
            type="date"
            className="w-full rounded-lg border border-border bg-input p-2 text-sm"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2">
            Cancelar
          </button>
          <button type="submit" disabled={salvando} className="rounded-lg bg-primary px-4 py-2 text-white">
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}

export default NovaMetaModal;
