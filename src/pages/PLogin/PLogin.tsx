import type { JSX } from "react";
import FormLogin from "../../components/Formularios/FormLogin/FormLogin";

// 1. Criamos a interface para a prop
interface PLoginProps {
  onLoginSuccess: () => void;
}

// 2. Recebemos a prop e repassamos para o FormLogin
function PLogin({ onLoginSuccess }: PLoginProps): JSX.Element {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <div className="absolute top-0 left-0 w-full h-96 bg-indigo-600 rounded-b-[4rem] opacity-10 pointer-events-none"></div>
      <div className="relative z-10 w-full flex justify-center">
        <FormLogin onLoginSuccess={onLoginSuccess} />
      </div>
    </div>
  );
}

export default PLogin;