import React, { useState } from 'react';
import { UserPlus, Loader2 } from 'lucide-react';
import type { CriarCredorInput } from '../../fetch/AdminRequests';

interface ModalCriarCredorProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dados: CriarCredorInput) => Promise<boolean>;
}

export function ModalCriarCredor({ isOpen, onClose, onConfirm }: ModalCriarCredorProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [submetendo, setSubmetendo] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !senha.trim()) return;

    setSubmetendo(true);
    const ok = await onConfirm({ nome: nome.trim(), email: email.trim(), senha: senha.trim() });
    setSubmetendo(false);

    if (ok) {
      setNome('');
      setEmail('');
      setSenha('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2">
            <UserPlus className="text-primary" size={20} /> Cadastrar Novo Credor
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-xs font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-foreground block mb-1">Nome Completo *</label>
            <input
              type="text"
              placeholder="Ex: João da Silva"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-2xl border border-border bg-muted/40 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">E-mail de Acesso *</label>
            <input
              type="email"
              placeholder="Ex: joao@credito.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-border bg-muted/40 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">Senha Provisória *</label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-2xl border border-border bg-muted/40 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              minLength={6}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-border bg-muted px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/80"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submetendo}
              className="rounded-2xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {submetendo && <Loader2 size={14} className="animate-spin" />}
              <span>{submetendo ? 'Cadastrando...' : 'Cadastrar Credor'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalCriarCredor;
