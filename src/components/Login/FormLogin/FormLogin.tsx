import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Loader2, AlertCircle, Eye } from "lucide-react";
import AuthRequests from "../../../fetch/AuthRequests";

interface FormLoginProps {
  onLoginSuccess: () => void;
}

function FormLogin({ onLoginSuccess }: FormLoginProps) {
  const navigate = useNavigate();
  
  // Estados restaurados!
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      const resultado = await AuthRequests.login({ email, senha });

      if (!resultado.sucesso) {
        setErro(resultado.erro ?? "E-mail ou senha inválidos. Tente novamente.");
        return;
      }

      // Só redireciona se o login foi bem-sucedido
      onLoginSuccess();
      navigate("/");
    } catch (error) {
      setErro("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
          <Lock size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Acesso Restrito</h1>
        <p className="text-sm text-slate-500 mt-1">Insira suas credenciais para continuar</p>
      </div>

      {erro && (
        <div className="flex items-start gap-3 bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{erro}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1.5 text-sm font-medium text-slate-700">
            E-mail
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sistema.com"
              className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1.5 text-sm font-medium text-slate-700">
            Senha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Lock size={18} />
            </div>
            <input
              type={mostrarSenha ? 'text' : 'password'}
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-xl pl-11 pr-16 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-all"
            />
            <button
              type="button"
              aria-label="Mostrar senha"
              onMouseDown={() => setMostrarSenha(true)}
              onMouseUp={() => setMostrarSenha(false)}
              onMouseLeave={() => setMostrarSenha(false)}
              onTouchStart={() => setMostrarSenha(true)}
              onTouchEnd={() => setMostrarSenha(false)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700"
            >
              <Eye size={18} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {carregando ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Entrando...
            </>
          ) : (
            <>
              <LogIn size={20} />
              ENTRAR NO SISTEMA
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default FormLogin;