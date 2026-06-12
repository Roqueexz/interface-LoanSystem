import type { JSX } from "react";
import Navegacao from "../../../components/Navegacao/Navegacao";
import ListagemCliente from "../../../components/Listagens/ListagemCliente/ListagemCliente";

function PListagemCliente(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navegacao paginaAtiva="clientes" />
      <ListagemCliente />
    </div>
  );
}

export default PListagemCliente;
