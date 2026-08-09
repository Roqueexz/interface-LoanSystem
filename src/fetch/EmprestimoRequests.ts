import type EmprestimoDTO from "../interface/EmprestimoDTO";
import { BaseRequests } from "./BaseRequests";

class EmprestimoRequests extends BaseRequests {
  private endpointEmprestimo = '/api/emprestimos';

  async obterListaDeEmprestimos(): Promise<EmprestimoDTO[] | undefined> {
    // Busca ativos + liquidados para suportar a aba de Histórico
    const resposta = await this.request<any>(`${this.endpointEmprestimo}?status=todos`);
    
    if (!resposta.sucesso) {
      console.error('[EmprestimoRequests] Erro ao listar empréstimos:', resposta.erro);
      return [];
    }

    // Trata diferentes formatos de resposta
    const data = resposta.dados;
    const lista = Array.isArray(data) ? data : (data?.emprestimos || data?.dados || []);
    return lista;
  }

  async obterEmprestimoPorId(id_emprestimo: number): Promise<EmprestimoDTO | undefined> {
    const resposta = await this.request<EmprestimoDTO>(`${this.endpointEmprestimo}/${id_emprestimo}`);
    
    if (!resposta.sucesso) {
      console.error(`[EmprestimoRequests] Erro ao buscar empréstimo ${id_emprestimo}:`, resposta.erro);
      return undefined;
    }

    return resposta.dados;
  }

  async enviarFormularioEmprestimo(formEmprestimo: EmprestimoDTO): Promise<boolean> {
    // Remove valor_parcela se for 0 ou undefined (deixa o backend calcular)
    const { valor_parcela, ...dadosParaEnviar } = formEmprestimo;
    const dadosFinais: any = { ...dadosParaEnviar };
    
    // Só adiciona valor_parcela se for > 0 (envio manual)
    if (valor_parcela && valor_parcela > 0) {
      dadosFinais.valor_parcela = valor_parcela;
    }

    const resposta = await this.request<{ mensagem: string }>(this.endpointEmprestimo, {
      method: 'POST',
      body: JSON.stringify(dadosFinais),
    });

    if (!resposta.sucesso) {
      console.error('[EmprestimoRequests] Erro ao cadastrar empréstimo:', resposta.erro);
      return false;
    }

    return true;
  }

  async atualizarEmprestimo(id_emprestimo: number, emprestimo: EmprestimoDTO): Promise<boolean> {
    // Remove valor_parcela se for 0 ou undefined
    const { valor_parcela, ...dadosParaEnviar } = emprestimo;
    const dadosFinais: any = { ...dadosParaEnviar };
    
    if (valor_parcela && valor_parcela > 0) {
      dadosFinais.valor_parcela = valor_parcela;
    }

    const resposta = await this.request<{ mensagem: string }>(`${this.endpointEmprestimo}/${id_emprestimo}`, {
      method: 'PUT',
      body: JSON.stringify(dadosFinais),
    });

    if (!resposta.sucesso) {
      console.error(`[EmprestimoRequests] Erro ao atualizar empréstimo ${id_emprestimo}:`, resposta.erro);
      return false;
    }

    return true;
  }

  async excluirEmprestimo(id_emprestimo: number): Promise<boolean> {
    const resposta = await this.request<{ mensagem: string }>(`${this.endpointEmprestimo}/${id_emprestimo}`, {
      method: 'DELETE',
    });

    if (!resposta.sucesso) {
      console.error(`[EmprestimoRequests] Erro ao excluir empréstimo ${id_emprestimo}:`, resposta.erro);
      throw new Error(resposta.erro);
    }

    return true;
  }
}

export default new EmprestimoRequests();