import { type JSX } from "react";

// Importa o componente de cabeçalho da aplicação
import Navegacao from "../../components/Navegacao/Navegacao";

// Importa o componente que contém o formulário de login
import LoginForm from "../../components/Formularios/FormLogin/FormLogin";

// Importa o rodapé da aplicação
import Rodape from "../../components/Rodape/Rodape";

// Componente funcional que representa a página de login
function PLogin(): JSX.Element {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* Renderiza o cabeçalho da página */}
            <Navegacao />

            {/* O container cresce dinamicamente ocupando o espaço entre topo e rodapé */}
            <main className="flex-grow flex items-center justify-center p-4 py-12">
                <LoginForm />
            </main>

            {/* Renderiza o rodapé */}
            <Rodape />
        </div>
    );
}

// Exporta o componente para que possa ser usado em outras partes da aplicação
export default PLogin;