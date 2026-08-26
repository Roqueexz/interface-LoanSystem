import { BaseRequests } from './BaseRequests';
import { SERVER_CFG } from '../appConfig';

class AuthRequests extends BaseRequests {
  private endpointLogin = SERVER_CFG.ENDPOINT_AUTH_LOGIN;

  async login(login: { email: string; senha: string }): Promise<{ sucesso: boolean; erro?: string }> {
    try {
      const response = await fetch(`${this.serverURL}${this.endpointLogin}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(login),
      });

      if (!response.ok) {
        let mensagemErro = 'Email ou senha inválidos.';
        try {
          const errorData = await response.json();
          if (errorData.message) {
            mensagemErro = errorData.message;
          } else if (errorData.mensagem) {
            mensagemErro = errorData.mensagem;
          }
        } catch (e) {
          // Usa mensagem padrao
        }
        return {
          sucesso: false,
          erro: mensagemErro,
        };
      }

      const data = await response.json();

      if (data.auth && data.token) {
        this.persistirToken(data.token, data.usuario, data.auth);
        return { sucesso: true };
      }

      return {
        sucesso: false,
        erro: 'Resposta inválida do servidor.',
      };
    } catch (error: any) {
      console.error('[AuthRequests] Erro no login:', error);
      return {
        sucesso: false,
        erro: error.message || 'Erro ao conectar com o servidor.',
      };
    }
  }

  private persistirToken(token: string, usuario: { id_usuario: number; nome: string; email: string; role: string }, isAuth: boolean) {
    localStorage.setItem('token', token);
    localStorage.setItem('nome', usuario.nome);
    localStorage.setItem('idUsuario', usuario.id_usuario.toString());
    localStorage.setItem('email', usuario.email);
    localStorage.setItem('role', usuario.role);
    localStorage.setItem('isAuth', isAuth.toString());
  }

  limparSessao() {
    localStorage.removeItem('token');
    localStorage.removeItem('nome');
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('isAuth');
  }

  /**
   * Remove o token e redireciona para o login
   * Mantido para compatibilidade com Layout.tsx
   */
  removeToken() {
    this.logout();
  }

  logout() {
    this.limparSessao();
    window.location.href = '/login';
  }

  checkTokenExpiry(): boolean {
    const token = localStorage.getItem('token');
    const isAuth = localStorage.getItem('isAuth') === 'true';
    if (!token || !isAuth) {
      this.limparSessao();
      return false;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        this.limparSessao();
        return false;
      }
      const payload = JSON.parse(atob(parts[1]));
      const expiry = payload.exp;
      const now = Math.floor(Date.now() / 1000);

      if (!expiry || expiry < now) {
        this.limparSessao();
        return false;
      }
      return true;
    } catch {
      this.limparSessao();
      return false;
    }
  }
}

export default new AuthRequests();