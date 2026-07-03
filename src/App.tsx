import './App.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/Rotas/ProtectedRoutes';
import PLogin from './pages/PLogin/PLogin';
import PHome from './pages/PInicio/PInicio';
import PListagemCliente from './pages/PCliente/PListagemCliente/PListagemCliente';
import PListagemEmprestimo from './pages/PEmprestimo/PListagemEmprestimo/PListagemEmprestimo';
import PDetalhesCliente from './pages/PCliente/PDetalhesCliente/PDetalhesCliente';
import PDetalhesEmprestimo from './pages/PEmprestimo/PDetalhesEmprestimo/PDetalhesEmprestimo';
import PEditarEmprestimo from './pages/PEmprestimo/PEditarEmprestimo/PEditarEmprestimo';
import PEditarCliente from "./pages/PCliente/PEditarCliente/PEditarCliente";
import PCaixa from './pages/PCaixa/PCaixa';

function App() {
  const [isAuth, setIsAuth] = useState<boolean>(() => {
    return localStorage.getItem('isAuth') === 'true';
  });

  const handleLoginSuccess = () => {
    setIsAuth(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Raiz */}
        <Route
          path="/"
          element={
            isAuth
              ? <ProtectedRoute isAuth={isAuth} element={PHome} />
              : <PLogin onLoginSuccess={handleLoginSuccess} />
          }
        />

        {/* Listagens (Todas Protegidas) */}
        <Route path='/clientes' element={<ProtectedRoute isAuth={isAuth} element={PListagemCliente} />} />
        <Route path='/emprestimos' element={<ProtectedRoute isAuth={isAuth} element={PListagemEmprestimo} />} />
        <Route path='/caixa' element={<ProtectedRoute isAuth={isAuth} element={PCaixa} />} />

        {/* Formulários de Edição (Todos Protegidos) */}
        <Route path='/editar-emprestimo/:id' element={<ProtectedRoute isAuth={isAuth} element={PEditarEmprestimo} />} />
        <Route path="/editar-cliente/:id" element={<ProtectedRoute isAuth={isAuth} element={PEditarCliente} />} />
  
        {/* Detalhes de Visualização (Todos Protegidos) */}
        <Route path='/clientes/:id' element={<ProtectedRoute isAuth={isAuth} element={PDetalhesCliente} />} />
        <Route path='/emprestimos/:id' element={<ProtectedRoute isAuth={isAuth} element={PDetalhesEmprestimo} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;