import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import AuthRequests from "../../../fetch/AuthRequests";
import { APP_ROUTES } from "../../../appConfig";

interface FormLoginProps {
  onLoginSuccess: () => void;
}

function FormLogin({ onLoginSuccess }: FormLoginProps) {
  const navigate = useNavigate();
  
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
      AuthRequests.limparSessao();
      const resultado = await AuthRequests.login({ email: email.trim(), senha });

      if (!resultado.sucesso) {
        setErro(
          resultado.erro ||
            "Credenciais inválidas. Por favor, confira os dados e tente novamente."
        );
        return;
      }

      onLoginSuccess();
      navigate(APP_ROUTES.ROUTE_INICIO);
    } catch (error) {
      setErro("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="w-full bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="hidden lg:block mb-6">
        <h1 className="text-xl font-bold tracking-tight">Bem-vindo de volta</h1>
        <p className="text-sm text-muted-foreground mt-1">Entre na sua conta para continuar.</p>
      </div>

      {erro && (
        <div className="flex items-start gap-3 bg-destructive/10 text-destructive p-3.5 rounded-xl mb-5 border border-destructive/20">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <p className="text-sm font-medium leading-snug">{erro}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1.5 text-sm font-medium">E-mail</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Mail size={18} />
            </div>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (erro) setErro(null);
              }}
              placeholder="seu@email.com"
              className="w-full h-12 border border-border rounded-xl pl-11 pr-4 text-sm bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1.5 text-sm font-medium">Senha</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Lock size={18} />
            </div>
            <input
              type={mostrarSenha ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                if (erro) setErro(null);
              }}
              placeholder="••••••••"
              className="w-full h-12 border border-border rounded-xl pl-11 pr-12 text-sm bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
            <button
              type="button"
              aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              onClick={() => setMostrarSenha(v => !v)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="w-full h-12 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed text-sm mt-2"
        >
          {carregando ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Entrando...
            </>
          ) : (
            <>
              <LogIn size={18} />
              Entrar
            </>
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground pt-2">
          Ao entrar, você concorda com o uso responsável dos dados dos seus clientes.
        </p>
      </form>

      <div className="mt-6 pt-6 border-t border-border text-center">
        <Link to={APP_ROUTES.ROUTE_LANDING} className="text-sm text-muted-foreground hover:text-foreground">
          ← Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}

export default FormLogin;
