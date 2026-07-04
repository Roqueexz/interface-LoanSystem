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

      if (respostaAPI.status === 401) {
        console.warn("Token expirado. Redirecionando para login...");
        AuthRequests.removeToken(); 
        return undefined; 
      }

      if (respostaAPI.ok) {
        const data = await respostaAPI.json();
        const listaEmprestimos = Array.isArray(data) ? data : (data.emprestimos || data.dados || []);
        return listaEmprestimos;
      }

      throw new Error("Não foi possível listar os empréstimos.");
    } catch (error) {
      console.error(`Erro ao consultar empréstimos. ${error}`);
      return [];
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
            "x-access-token": token || "",
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

     
      const { valor_parcela, ...dadosParaEnviar } = formEmprestimo;

      // Se valor_parcela existir e for > 0, mantém; senão, envia sem ele
      const dadosFinais: any = { ...dadosParaEnviar };
      
      // Só adiciona valor_parcela se for > 0 (para enviar manual)
      if (valor_parcela && valor_parcela > 0) {
        dadosFinais.valor_parcela = valor_parcela;
      }

      const respostaAPI = await fetch(
        `${this.serverURL}${this.endpointEmprestimo}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token || "",
          },
          body: JSON.stringify(dadosFinais),
        },
      );

      if (!respostaAPI.ok) {
        let mensagemErro = `Erro ${respostaAPI.status}: ${respostaAPI.statusText}`;
        try {
          const errorData = await respostaAPI.json();
          if (errorData.mensagem) {
            mensagemErro = errorData.mensagem;
          }
        } catch (e) {
          // Ignora se não for JSON
        }
        throw new Error(mensagemErro);
      }

      return true;
    } catch (error: any) {
      console.error(`Erro ao cadastrar empréstimo. ${error.message || error}`);
      alert(error.message || "Erro ao cadastrar empréstimo.");
      return false;
    }
  }

  async atualizarEmprestimo(
    id_emprestimo: number,
    emprestimo: EmprestimoDTO,
  ): Promise<boolean> {
    try {
      const token = localStorage.getItem("token");

      const { valor_parcela, ...dadosParaEnviar } = emprestimo;
      const dadosFinais: any = { ...dadosParaEnviar };
      
      if (valor_parcela && valor_parcela > 0) {
        dadosFinais.valor_parcela = valor_parcela;
      }

      const respostaAPI = await fetch(
        `${this.serverURL}${this.endpointEmprestimo}/${id_emprestimo}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token || "",
          },
          body: JSON.stringify(dadosFinais),
        },
      );

      if (!respostaAPI.ok) {
        let mensagemErro = `Erro ${respostaAPI.status}: ${respostaAPI.statusText}`;
        try {
          const errorData = await respostaAPI.json();
          if (errorData.mensagem) {
            mensagemErro = errorData.mensagem;
          }
        } catch (e) {
          // Ignora se não for JSON
        }
        throw new Error(mensagemErro);
      }

      return true;
    } catch (error: any) {
      console.error(`Erro ao atualizar empréstimo. ${error.message || error}`);
      alert(error.message || "Erro ao atualizar empréstimo.");
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
          "x-access-token": token || "",
        },
      },
    );

    if (!respostaAPI.ok) {
      let mensagemErro = `Erro ${respostaAPI.status}: ${respostaAPI.statusText}`;
      try {
        const errorData = await respostaAPI.json();
        if (errorData.mensagem) {
          mensagemErro = errorData.mensagem;
        }
      } catch (e) {
        // Ignora se não for JSON
      }
      throw new Error(mensagemErro);
    }

    return true;
  } catch (error: any) {
    console.error(`Erro ao excluir empréstimo. ${error.message || error}`);
    throw error;
  }
}
}

export default new EmprestimoRequests();