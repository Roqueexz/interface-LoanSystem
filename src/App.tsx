import './App.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/Rotas/ProtectedRoutes';
import PLogin from './pages/Login/PLogin';
import PHome from './pages/Inicio/PInicio';
import PListagemCliente from './pages/Cliente/PListagemCliente/PListagemCliente';
import PListagemEmprestimo from './pages/Emprestimo/PListagemEmprestimo/PListagemEmprestimo';
import PCliente from './pages/Cliente/PCliente/PCliente';
import PDetalhesEmprestimo from './pages/Emprestimo/PDetalhesEmprestimo/PDetalhesEmprestimo';
import PEditarEmprestimo from './pages/Emprestimo/PEditarEmprestimo/PEditarEmprestimo';
import PEditarCliente from "./pages/Cliente/PEditarCliente/PEditarCliente";
import PCaixa from './pages/Caixa/PCaixa';

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