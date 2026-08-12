import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const Erro404: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-12 transition-colors duration-300">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Número 404 Estilizado com Gradiente */}
        <div className="relative flex justify-center items-center">
          <span className="text-8xl sm:text-9xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent select-none animate-pulse">
            404
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-pink-500/10 blur-3xl -z-10 rounded-full" />
        </div>

        {/* Mensagens */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Página não encontrada
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto leading-relaxed">
            O endereço que você tentou acessar não existe, foi alterado ou está temporariamente indisponível.
          </p>
        </div>

        {/* Ações */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-input bg-background hover:bg-muted text-foreground text-sm font-semibold transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold transition-all shadow-md active:scale-95"
          >
            <Home size={18} />
            Ir para o Início
          </button>
        </div>
      </div>
    </div>
  );
};

export default Erro404;
