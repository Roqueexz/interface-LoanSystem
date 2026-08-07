import { BaseRequests } from './BaseRequests';

interface UsuarioPerfilDTO {
  id_usuario: number;
  nome: string;
  email: string;
  role: string;
  criado_em: string;
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
    const res = await this.request<UsuarioPerfilDTO>('/api/usuario/perfil');
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
      '/api/usuario/perfil',
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
    const res = await this.request<{ mensagem: string }>('/api/usuario/senha', {
      method: 'PATCH',
      body: JSON.stringify(dados),
    });

    if (res.sucesso) {
      return { sucesso: true };
    }
    return { sucesso: false, erro: res.erro || 'Erro ao alterar senha.' };
  }

  /**
   * Retorna o histórico de atividades do usuário
   */
  async atividades(limite = 20): Promise<AtividadeDTO[]> {
    const res = await this.request<{ atividades: AtividadeDTO[] }>(
      `/api/usuario/atividades?limite=${limite}`
    );
    return res.sucesso && res.dados ? res.dados.atividades : [];
  }
}

export default new UsuarioRequests();
export type { UsuarioPerfilDTO, AtividadeDTO };
