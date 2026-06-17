import FormLogin from '../../components/Formularios/FormLogin/FormLogin';

/*
 * PLogin recebe o callback onLoginSuccess do App.tsx e o repassa
 * diretamente para o FormLogin. A pagina em si e apenas estrutural
 * e nao precisa saber o que o callback faz.
 */
interface PLoginProps {
  onLoginSuccess: () => void;
}

export default function PLogin({ onLoginSuccess }: PLoginProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <FormLogin onSuccess={onLoginSuccess} />
    </div>
  );
}