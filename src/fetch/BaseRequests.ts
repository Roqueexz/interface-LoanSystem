/**
 * Padrao para todas as requests do sistema
 * 
 * Regras:
 * 1. Todas as requests retornam um objeto { sucesso: boolean, dados?: T, erro?: string }
 * 2. Nunca retornam boolean diretamente
 * 3. O tratamento de erro e padronizado
 * 4. O Toast so e mostrado com base no sucesso da API
 */

interface RespostaBase<T = any> {
  sucesso: boolean;
  dados?: T;
  erro?: string;
}

export class BaseRequests {
  protected serverURL: string;

  constructor() {
    this.serverURL = import.meta.env.VITE_API_URL || 'http://localhost:3333';
  }

protected async request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<RespostaBase<T>> {
  try {
    const token = localStorage.getItem('token');
    
    console.log('[BaseRequests] Enviando requisicao para:', `${this.serverURL}${endpoint}`);
    console.log('[BaseRequests] Token:', token ? 'Presente' : 'Ausente');

    const response = await fetch(`${this.serverURL}${endpoint}`, {
      cache: 'no-store',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'x-access-token': token } : {}),
        ...options.headers,
      },
    });

    console.log('[BaseRequests] Status:', response.status);
    console.log('[BaseRequests] OK:', response.ok);

    if (response.status === 503 || response.status === 504) {
      window.dispatchEvent(new CustomEvent('api:offline'));
    } else {
      window.dispatchEvent(new CustomEvent('api:online'));
    }

    if (!response.ok) {
        let mensagemErro = `Erro ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          if (errorData.mensagem) {
            mensagemErro = errorData.mensagem;
          }
        } catch (e) {
          // Se nao for JSON, usa a mensagem padrao
        }

        // Caso especial: token expirado
        if (response.status === 401) {
          // Redireciona para login
          localStorage.removeItem('token');
          localStorage.removeItem('nome');
          localStorage.removeItem('idUsuario');
          localStorage.removeItem('email');
          localStorage.removeItem('role');
          localStorage.removeItem('isAuth');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }

        return {
          sucesso: false,
          erro: mensagemErro,
        };
      }

      // Resposta vazia (204)
      if (response.status === 204) {
        return {
          sucesso: true,
          dados: undefined,
        };
      }

      const data = await response.json();
      
      return {
        sucesso: true,
        dados: data,
      };
    } catch (error: any) {
      console.error(`[Request] Erro em ${endpoint}:`, error);
      window.dispatchEvent(new CustomEvent('api:offline'));
      return {
        sucesso: false,
        erro: error.message || 'Erro ao conectar com o servidor.',
      };
    }
  }
}