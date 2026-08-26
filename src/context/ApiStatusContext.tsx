import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SERVER_CFG } from '../appConfig';

interface ApiStatusContextData {
  apiOffline: boolean;
  marcarOffline: () => void;
  marcarOnline: () => void;
  verificarConexao: () => Promise<boolean>;
}

const ApiStatusContext = createContext<ApiStatusContextData>({} as ApiStatusContextData);

export const ApiStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiOffline, setApiOffline] = useState(false);

  const marcarOffline = useCallback(() => {
    setApiOffline(true);
  }, []);

  const marcarOnline = useCallback(() => {
    setApiOffline(false);
  }, []);

  const verificarConexao = useCallback(async (): Promise<boolean> => {
    try {
      const serverURL = SERVER_CFG.SERVER_URL;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${serverURL}/api/health`, {
        method: 'GET',
        signal: controller.signal,
      }).catch(async () => {
        // Se endpoint health não existir, tentar raiz ou status 200/404 da própria API
        return await fetch(serverURL, { method: 'GET', signal: controller.signal });
      });

      clearTimeout(timeoutId);

      // Qualquer resposta HTTP válida (mesmo 404/401) indica que o servidor backend está online
      if (res && res.status) {
        marcarOnline();
        return true;
      }
    } catch {
      marcarOffline();
      return false;
    }
    marcarOffline();
    return false;
  }, [marcarOnline, marcarOffline]);

  useEffect(() => {
    const handleOffline = () => setApiOffline(true);
    const handleOnline = () => setApiOffline(false);

    window.addEventListener('api:offline', handleOffline);
    window.addEventListener('api:online', handleOnline);

    return () => {
      window.removeEventListener('api:offline', handleOffline);
      window.removeEventListener('api:online', handleOnline);
    };
  }, []);

  return (
    <ApiStatusContext.Provider value={{ apiOffline, marcarOffline, marcarOnline, verificarConexao }}>
      {children}
    </ApiStatusContext.Provider>
  );
};

export const useApiStatus = (): ApiStatusContextData => {
  const context = useContext(ApiStatusContext);
  if (!context) {
    throw new Error('useApiStatus deve ser utilizado dentro de um ApiStatusProvider');
  }
  return context;
};
