import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

import authRequests from '../../../fetch/AuthRequests';

interface FormLoginProps {
  /*
   * Callback fornecido pelo App.tsx (via PLogin).
   * Invocado apos um login bem-sucedido para sinalizar ao App que
   * o estado de autenticacao mudou, acionando uma re-renderizacao
   * reativa das rotas sem necessidade de recarregar a pagina.
   */
  onSuccess: () => void;
}

export default function FormLogin({ onSuccess }: FormLoginProps) {
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  /*
   * O useEffect que chamava checkTokenExpiry e forcava um reload foi removido.
   * Essa verificacao inicial ja e feita no App.tsx ao inicializar o estado
   * isAuth a partir do localStorage. Se o token for valido, o App nunca
   * chegara a renderizar o formulario de login.
   */

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!email || !senha) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      const sucesso = await authRequests.login({ email, senha });

      if (sucesso) {
        /*
         * O authRequests.login ja persistiu o token e o isAuth no localStorage.
         * Basta notificar o App via callback para que o estado React seja
         * atualizado e as rotas sejam re-renderizadas de forma limpa.
         * Nenhum reload de pagina e necessario.
         */
        onSuccess();
      }
    } catch {
      setErro('Usuario ou senha incorretos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-soft border border-slate-100 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl text-white text-2xl font-bold mb-3 shadow-md">
          L$
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          LoanSystem
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Insira suas credenciais para acessar o painel
        </p>
      </div>

      {erro && (
        <div className="mb-5 animate-slide-in">
          <Message
            severity="error"
            text={erro}
            className="w-full justify-start p-3"
          />
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-semibold text-slate-700">
            E-mail corporativo
          </label>
          <div className="p-input-icon-left w-full">
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@gmail.com"
              className="w-full p-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="senha" className="text-sm font-semibold text-slate-700">
            Sua senha
          </label>
          <Password
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
            toggleMask
            feedback={false}
            className="w-full"
            inputClassName="w-full p-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          label={loading ? 'Autenticando...' : 'Entrar no Sistema'}
          icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'}
          className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-xl transition-all shadow-md hover:shadow-lg flex justify-center gap-2 border-none"
          disabled={loading}
        />
      </form>
    </div>
  );
}