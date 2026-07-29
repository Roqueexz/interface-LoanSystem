import { useState } from 'react';
import ModalBase from '../../../ui/Modal/ModalBase';
import { useContas } from '../../../hooks/useContas';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function NovaContaModal({ isOpen, onClose }: Props) {
  const { criarConta } = useContas();
  const [tipo, setTipo] = useState<'pagar' | 'receber'>('pagar');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [categoria, setCategoria] = useState('Aluguel');
  const [recorrencia, setRecorrencia] = useState<'nenhuma' | 'diaria' | 'semanal' | 'mensal' | 'anual'>('nenhuma');
  const [lembreteDias, setLembreteDias] = useState<string>('3');
  const [observacao, setObservacao] = useState('');
  const [salvando, setSalvando] = useState(false);

  const CATEGORIAS_INICIAIS = ['Aluguel', 'Energia', 'Internet', 'Funcionários', 'Impostos'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim() || !valor || isNaN(Number(valor)) || Number(valor) <= 0 || !vencimento) return;
    setSalvando(true);
    await criarConta({
      tipo,
      descricao: descricao.trim(),
      valor: Number(valor),
      vencimento,
      categoria,
      recorrencia,
      lembrete_dias_antes: Number(lembreteDias) || undefined,
      observacao: observacao.trim() || undefined,
    });
    setSalvando(false);
    onClose();
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Nova Conta" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Tipo</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value as any)} className="w-full p-2 rounded-lg border border-border bg-input">
            <option value="pagar">Pagar</option>
            <option value="receber">Receber</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1">Descrição</label>
          <input value={descricao} onChange={(e) => setDescricao(e.target.value)} className="w-full p-2 rounded-lg border border-border bg-input" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Valor</label>
            <input value={valor} onChange={(e) => setValor(e.target.value)} className="w-full p-2 rounded-lg border border-border bg-input" />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Vencimento</label>
            <input type="date" value={vencimento} onChange={(e) => setVencimento(e.target.value)} className="w-full p-2 rounded-lg border border-border bg-input" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Categoria</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full p-2 rounded-lg border border-border bg-input">
              {CATEGORIAS_INICIAIS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Recorrência</label>
            <select value={recorrencia} onChange={(e) => setRecorrencia(e.target.value as any)} className="w-full p-2 rounded-lg border border-border bg-input">
              <option value="nenhuma">Nenhuma</option>
              <option value="diaria">Diária</option>
              <option value="semanal">Semanal</option>
              <option value="mensal">Mensal</option>
              <option value="anual">Anual</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Lembrete (dias antes)</label>
            <input value={lembreteDias} onChange={(e) => setLembreteDias(e.target.value)} className="w-full p-2 rounded-lg border border-border bg-input" />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Observação</label>
            <input value={observacao} onChange={(e) => setObservacao(e.target.value)} className="w-full p-2 rounded-lg border border-border bg-input" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-border">Cancelar</button>
          <button type="submit" disabled={salvando} className="px-4 py-2 bg-primary text-white rounded-lg">{salvando ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </form>
    </ModalBase>
  );
}

export default NovaContaModal;
