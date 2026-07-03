import type EmprestimoDTO from "../interface/EmprestimoDTO";
import AuthRequests from "./AuthRequests";

class EmprestimoRequests {
  private serverURL;
  private endpointEmprestimo;

  constructor() {
    this.serverURL = "http://localhost:3333";
    this.endpointEmprestimo = "/api/emprestimos";
  }

  async obterListaDeEmprestimos(): Promise<EmprestimoDTO[] | undefined> {
    try {
      const token = localStorage.getItem("token");

      const respostaAPI = await fetch(
        `${this.serverURL}${this.endpointEmprestimo}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token || "",
          },
        },
      );

      // Bloqueio de intrusos
      if (respostaAPI.status === 401) {
        console.warn("Token expirado. Redirecionando para login...");
        AuthRequests.removeToken(); 
        return undefined; 
      }

      if (respostaAPI.ok) {
        const data = await respostaAPI.json();
        // O Pulo do Gato: Verifica se é um array puro. Se não for, extrai da propriedade correta.
        const listaEmprestimos = Array.isArray(data) ? data : (data.emprestimos || data.dados || []);
        return listaEmprestimos;
      }

      throw new Error("Não foi possível listar os empréstimos.");
    } catch (error) {
      console.error(`Erro ao consultar empréstimos. ${error}`);
      return []; // Retorne um array vazio em vez de undefined para não quebrar a tela
    }
  }

  async obterEmprestimoPorId(
    id_emprestimo: number,
  ): Promise<EmprestimoDTO | undefined> {
    try {
      const token = localStorage.getItem("token");

      const respostaAPI = await fetch(
        `${this.serverURL}${this.endpointEmprestimo}/${id_emprestimo}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${token}`,
          },
        },
      );

      if (respostaAPI.ok) {
        const emprestimo: EmprestimoDTO = await respostaAPI.json();

        return emprestimo;
      }

      throw new Error("Não foi possível buscar o empréstimo.");
    } catch (error) {
      console.error(`Erro ao consultar empréstimo por ID. ${error}`);

      return;
    }
  }

  async enviarFormularioEmprestimo(
    formEmprestimo: EmprestimoDTO,
  ): Promise<boolean> {
    try {
      const token = localStorage.getItem("token");

      const respostaAPI = await fetch(
        `${this.serverURL}${this.endpointEmprestimo}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${token}`,
          },
          body: JSON.stringify(formEmprestimo),
        },
      );

      if (!respostaAPI.ok) {
        throw new Error(
          `Erro ${respostaAPI.status}: ${respostaAPI.statusText}`,
        );
      }

      return true;
    } catch (error) {
      console.error(`Erro ao cadastrar empréstimo. ${error}`);

      return false;
    }
  }

  async atualizarEmprestimo(
    id_emprestimo: number,
    emprestimo: EmprestimoDTO,
  ): Promise<boolean> {
    try {
      const token = localStorage.getItem("token");

      const respostaAPI = await fetch(
        `${this.serverURL}${this.endpointEmprestimo}/${id_emprestimo}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${token}`,
          },
          body: JSON.stringify(emprestimo),
        },
      );

      if (!respostaAPI.ok) {
        throw new Error(
          `Erro ${respostaAPI.status}: ${respostaAPI.statusText}`,
        );
      }

      return true;
    } catch (error) {
      console.error(`Erro ao atualizar empréstimo. ${error}`);

      return false;
    }
  }

  async excluirEmprestimo(id_emprestimo: number): Promise<boolean> {
    try {
      const token = localStorage.getItem("token");

      const respostaAPI = await fetch(
        `${this.serverURL}${this.endpointEmprestimo}/${id_emprestimo}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${token}`,
          },
        },
      );

      if (!respostaAPI.ok) {
        throw new Error(
          `Erro ${respostaAPI.status}: ${respostaAPI.statusText}`,
        );
      }

      return true;
    } catch (error) {
      console.error(`Erro ao excluir empréstimo. ${error}`);

      return false;
    }
  }
}

export default new EmprestimoRequests();
