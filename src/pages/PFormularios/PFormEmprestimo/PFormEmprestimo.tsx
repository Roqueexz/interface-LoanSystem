import type { JSX } from "react";
import Navegacao from "../../../components/Navegacao/Navegacao";
import FormEmprestimo from "../../../components/Formularios/FormEmprestimo/FormEmprestimo";

function PFormEmprestimo(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navegacao paginaAtiva="novo-emprestimo" />
      <main className="flex-1 py-8 px-4">
        <FormEmprestimo modo="criar" clientesDisponiveis={[]} />
      </main>
    </div>
  );
}

export default PFormEmprestimo;
