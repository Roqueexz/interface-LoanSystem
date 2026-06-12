import type { JSX } from "react";
import Navegacao from "../../components/Navegacao/Navegacao";
import Inicio from "../../components/Inicio/Inicio";

function PHome(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navegacao paginaAtiva="inicio" />
      <Inicio />
    </div>
  );
}

export default PHome;
