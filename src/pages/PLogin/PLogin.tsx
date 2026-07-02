import type { JSX } from "react";
import FormLogin from "../../components/Formularios/FormLogin/FormLogin";

function PLogin(): JSX.Element {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      {/* Elementos decorativos de fundo opcionais */}
      <div className="absolute top-0 left-0 w-full h-96 bg-indigo-600 rounded-b-[4rem] opacity-10 pointer-events-none"></div>
      
      <div className="relative z-10 w-full flex justify-center">
        <FormLogin />
      </div>
    </div>
  );
}

export default PLogin;