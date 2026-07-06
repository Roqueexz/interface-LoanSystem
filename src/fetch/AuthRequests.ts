import { BaseRequests } from './BaseRequests';

class AuthRequests extends BaseRequests {
  private endpointLogin = '/api/login';

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

  /**
   * Remove o token e redireciona para o login
   * Mantido para compatibilidade com Layout.tsx
   */
  removeToken() {
    this.logout();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('nome');
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('isAuth');
    window.location.href = '/';
  }

  checkTokenExpiry(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      const now = Math.floor(Date.now() / 1000);

      if (expiry < now) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }
}

export default new AuthRequests();