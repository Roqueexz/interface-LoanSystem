import type ClienteDTO from "../interface/ClienteDTO";

class ClienteRequests {
  private serverURL;
  private endpointCliente;

  constructor() {
    this.serverURL = "http://localhost:3333";
    this.endpointCliente = "/api/clientes";
  }

  async obterListaDeClientes(): Promise<ClienteDTO[] | undefined> {
    try {
      const token = localStorage.getItem("token");

      const respostaAPI = await fetch(
        `${this.serverURL}${this.endpointCliente}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${token}`,
          },
        },
      );

      if (respostaAPI.ok) {
        const listaClientes: ClienteDTO[] = await respostaAPI.json();

        return listaClientes;
      }

      throw new Error("Não foi possível listar os clientes.");
    } catch (error) {
      console.error(`Erro ao consultar clientes. ${error}`);
      return;
    }
  }

  async obterClientePorId(id_cliente: number): Promise<ClienteDTO | undefined> {
    try {
      const token = localStorage.getItem("token");

      const respostaAPI = await fetch(
        `${this.serverURL}${this.endpointCliente}/${id_cliente}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${token}`,
          },
        },
      );

      if (respostaAPI.ok) {
        const cliente: ClienteDTO = await respostaAPI.json();

        return cliente;
      }

      throw new Error("Não foi possível buscar o cliente.");
    } catch (error) {
      console.error(`Erro ao consultar cliente por ID. ${error}`);
      return;
    }
  }

  async enviarFormularioCliente(formCliente: ClienteDTO): Promise<boolean> {
    try {
      const token = localStorage.getItem("token");

      const respostaAPI = await fetch(
        `${this.serverURL}${this.endpointCliente}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${token}`,
          },
          body: JSON.stringify(formCliente),
        },
      );

      if (!respostaAPI.ok) {
        throw new Error(
          `Erro ${respostaAPI.status}: ${respostaAPI.statusText}`,
        );
      }

      console.info(`${respostaAPI.status}: ${respostaAPI.statusText}`);

      return true;
    } catch (error) {
      console.error(`Erro ao cadastrar cliente. ${error}`);

      return false;
    }
  }

  async atualizarCliente(
    id_cliente: number,
    cliente: ClienteDTO,
  ): Promise<boolean> {
    try {
      const token = localStorage.getItem("token");

      const respostaAPI = await fetch(
        `${this.serverURL}${this.endpointCliente}/${id_cliente}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${token}`,
          },
          body: JSON.stringify(cliente),
        },
      );

      if (!respostaAPI.ok) {
        throw new Error(
          `Erro ${respostaAPI.status}: ${respostaAPI.statusText}`,
        );
      }

      return true;
    } catch (error) {
      console.error(`Erro ao atualizar cliente. ${error}`);

      return false;
    }
  }

  async excluirCliente(id_cliente: number): Promise<boolean> {
    try {
      const token = localStorage.getItem("token");

      const respostaAPI = await fetch(
        `${this.serverURL}${this.endpointCliente}/${id_cliente}`,
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
      console.error(`Erro ao excluir cliente. ${error}`);

      return false;
    }
  }
}

export default new ClienteRequests();
