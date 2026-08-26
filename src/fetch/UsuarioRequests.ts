import { BaseRequests } from './BaseRequests';
import { SERVER_CFG } from '../appConfig';

interface UsuarioPerfilDTO {
  id_usuario: number;
  nome: string;
  email: string;
  role: string;
  criado_em: string;
  avatar_url?: string | null;
}

interface AtividadeDTO {
  tipo: string;
  descricao: string;
  detalhe: string;
  criado_em: string;
}

class UsuarioRequests extends BaseRequests {
  /**
   * Retorna os dados do perfil do usuário autenticado
   */
  async perfil(): Promise<UsuarioPerfilDTO | null> {
    const res = await this.request<UsuarioPerfilDTO>(SERVER_CFG.ENDPOINT_USUARIO_PERFIL);
    return res.sucesso && res.dados ? res.dados : null;
  }

  /**
   * Atualiza nome e/ou email do usuário
   */
  async atualizarPerfil(dados: { nome?: string; email?: string }): Promise<{
    sucesso: boolean;
    usuario?: UsuarioPerfilDTO;
    erro?: string;
  }> {
    const res = await this.request<{ mensagem: string; usuario: UsuarioPerfilDTO }>(
      SERVER_CFG.ENDPOINT_USUARIO_PERFIL,
      {
        method: 'PUT',
        body: JSON.stringify(dados),
      }
    );

    if (res.sucesso && res.dados) {
      return { sucesso: true, usuario: res.dados.usuario };
    }
    return { sucesso: false, erro: res.erro || 'Erro ao atualizar perfil.' };
  }

  /**
   * Altera a senha do usuário
   */
  async alterarSenha(dados: {
    senhaAtual: string;
    novaSenha: string;
    confirmacaoSenha: string;
  }): Promise<{ sucesso: boolean; erro?: string }> {
    const res = await this.request<{ mensagem: string }>(SERVER_CFG.ENDPOINT_USUARIO_SENHA, {
      method: 'PATCH',
      body: JSON.stringify(dados),
    });

    if (res.sucesso) {
      return { sucesso: true };
    }
    return { sucesso: false, erro: res.erro || 'Erro ao alterar senha.' };
  }

  /**
   * Faz upload do avatar do usuário
   * PUT /api/usuario/avatar (multipart/form-data)
   */
  async uploadAvatar(file: File): Promise<{
    sucesso: boolean;
    avatar_url?: string;
    erro?: string;
  }> {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${this.serverURL}${SERVER_CFG.ENDPOINT_USUARIO_AVATAR}`, {
        method: 'PUT',
        headers: {
          'x-access-token': token || '',
        },
        body: formData,
      });

      if (!response.ok) {
        let mensagemErro = `Erro ${response.status}`;
        try {
          const errData = await response.json();
          if (errData.mensagem) mensagemErro = errData.mensagem;
        } catch { /* noop */ }
        return { sucesso: false, erro: mensagemErro };
      }

      const data = await response.json();
      return { sucesso: true, avatar_url: data.avatar_url };
    } catch (error: any) {
      return { sucesso: false, erro: error.message || 'Erro ao enviar avatar.' };
    }
  }

  /**
   * Retorna o histórico de atividades do usuário
   */
  async atividades(limite = 20): Promise<AtividadeDTO[]> {
    const res = await this.request<{ atividades: AtividadeDTO[] }>(
      `${SERVER_CFG.ENDPOINT_USUARIO_ATIVIDADES}?limite=${limite}`
    );
    return res.sucesso && res.dados ? res.dados.atividades : [];
  }
}

export default new UsuarioRequests();
export type { UsuarioPerfilDTO, AtividadeDTO };
