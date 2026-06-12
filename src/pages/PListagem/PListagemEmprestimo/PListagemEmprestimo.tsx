import type { JSX } from "react";
import Navegacao from "../../../components/Navegacao/Navegacao";
import ListagemEmprestimo from "../../../components/Listagens/ListagemEmprestimo/ListagemEmprestimo";

function PListagemEmprestimo(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navegacao paginaAtiva="emprestimos" />
      <ListagemEmprestimo />
    </div>
  );
}

export default PListagemEmprestimo;
