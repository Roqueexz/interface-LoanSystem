import type { JSX } from "react";
import Navegacao from "../../../components/Navegacao/Navegacao";
import FormCliente from "../../../components/Formularios/FormCliente/FormCliente";

function PFormCliente(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navegacao paginaAtiva="novo-cliente" />
      <main className="flex-1 py-8 px-4">
        <FormCliente modo="criar" />
      </main>
    </div>
  );
}

export default PFormCliente;
