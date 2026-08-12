import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, ServerOff } from 'lucide-react';
import { useApiStatus } from '../../context/ApiStatusContext';

interface ErroAPIProps {
  fullPage?: boolean;
}

const ErroAPI: React.FC<ErroAPIProps> = ({ fullPage = true }) => {
  const { verificarConexao } = useApiStatus();
  const [tempoRestante, setTempoRestante] = useState<number>(30);
  const [verificando, setVerificando] = useState<boolean>(false);

  const handleRetry = async () => {
    setVerificando(true);
    const online = await verificarConexao();
    setVerificando(false);
    if (!online) {
      setTempoRestante(30);
    }
  };

  useEffect(() => {
    if (tempoRestante <= 0) {
      handleRetry();
      return;
    }

    const timer = setInterval(() => {
      setTempoRestante((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [tempoRestante]);

  const containerClasses = fullPage
    ? 'min-h-screen w-full flex items-center justify-center bg-background px-4 py-12 transition-colors duration-300'
    : 'w-full p-6 bg-card border border-destructive/20 rounded-2xl shadow-sm text-center';

  return (
    <div className={containerClasses}>
      <div className="max-w-md w-full text-center space-y-6">
        {/* Ícone de Servidor com Animação Pulse */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center animate-pulse">
            <ServerOff size={40} />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
            <WifiOff size={16} />
          </div>
        </div>

        {/* Informações */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Sistema temporariamente indisponível
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
            Não foi possível estabelecer conexão com o servidor. Estamos tentando reconectar automaticamente.
          </p>
        </div>

        {/* Contador e Botão */}
        <div className="space-y-4 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
            <span>Nova tentativa em:</span>
            <span className="font-bold text-foreground w-5 text-center">{tempoRestante}s</span>
          </div>

          <div>
            <button
              onClick={handleRetry}
              disabled={verificando}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-sm font-semibold transition-all shadow-md active:scale-95"
            >
              <RefreshCw size={16} className={verificando ? 'animate-spin' : ''} />
              {verificando ? 'Tentando reconectar...' : 'Tentar Novamente Agora'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErroAPI;
