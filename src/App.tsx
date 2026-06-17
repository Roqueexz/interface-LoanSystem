import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importação do mecanismo de proteção e da tela de login
import ProtectedRoute from './components/Rotas/ProtectedRoutes';
import PLogin from './pages/PLogin/PLogin';

// Suas páginas existentes
import PHome from './pages/PInicio/PInicio';
import PListagemCliente from './pages/PListagem/PListagemCliente/PListagemCliente';
import PListagemEmprestimo from './pages/PListagem/PListagemEmprestimo/PListagemEmprestimo';
import PFormCliente from './pages/PFormularios/PFormCliente/PFormCliente';
import PFormEmprestimo from './pages/PFormularios/PFormEmprestimo/PFormEmprestimo';
import PDetalhesCliente from './pages/PDetalhes/PDetalhesCliente/PDetalhesCliente';
import PDetalhesEmprestimo from './pages/PDetalhes/PDetalhesEmprestimo/PDetalhesEmprestimo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*  Rota Pública */}
        <Route path='/login' element={<PLogin />} />

        {/*  Rota de Início Protegida */}
        <Route path='/' element={<ProtectedRoute element={PHome} />} />

        {/*  Listagens Protegidas */}
        <Route path='/clientes' element={<ProtectedRoute element={PListagemCliente} />} />
        <Route path='/emprestimos' element={<ProtectedRoute element={PListagemEmprestimo} />} />

        {/*  Formulários (Cadastro) Protegidos */}
        <Route path='/novo-cliente' element={<ProtectedRoute element={PFormCliente} />} />
        <Route path='/novo-emprestimo' element={<ProtectedRoute element={PFormEmprestimo} />} />

        {/*  Detalhes (Visualização) Protegidos */}
        <Route path='/clientes/:id' element={<ProtectedRoute element={PDetalhesCliente} />} />
        <Route path='/emprestimos/:id' element={<ProtectedRoute element={PDetalhesEmprestimo} />} />

        {/*  Rota de fuga: se digitar qualquer coisa inválida, joga para a Home (que vai validar o login) */}
        <Route path='*' element={<ProtectedRoute element={PHome} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;