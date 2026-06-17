import './App.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/Rotas/ProtectedRoutes';
import PLogin from './pages/PLogin/PLogin';
import PHome from './pages/PInicio/PInicio';
import PListagemCliente from './pages/PListagem/PListagemCliente/PListagemCliente';
import PListagemEmprestimo from './pages/PListagem/PListagemEmprestimo/PListagemEmprestimo';
import PFormCliente from './pages/PFormularios/PFormCliente/PFormCliente';
import PFormEmprestimo from './pages/PFormularios/PFormEmprestimo/PFormEmprestimo';
import PDetalhesCliente from './pages/PDetalhes/PDetalhesCliente/PDetalhesCliente';
import PDetalhesEmprestimo from './pages/PDetalhes/PDetalhesEmprestimo/PDetalhesEmprestimo';

function App() {
  /*
   * A fonte da verdade sobre autenticação vive aqui como estado React.
   * Inicializamos lendo o localStorage uma única vez, na montagem do App.
   * A partir daí, apenas o callback onLoginSuccess altera esse valor,
   * garantindo que o React re-renderize as rotas de forma limpa e sem reload.
   */
  const [isAuth, setIsAuth] = useState<boolean>(() => {
    return localStorage.getItem('isAuth') === 'true';
  });

  /*
   * Callback passado para o FormLogin via PLogin.
   * Quando o login for bem-sucedido, o AuthRequests já terá persistido
   * os dados no localStorage. Basta sinalizar ao App que o estado mudou.
   */
  const handleLoginSuccess = () => {
    setIsAuth(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/*
         * Rota raiz: comportamento condicional baseado no estado reativo.
         * Nao autenticado -> exibe a pagina de login passando o callback.
         * Autenticado     -> exibe a PHome protegida.
         */}
        <Route
          path="/"
          element={
            isAuth
              ? <ProtectedRoute isAuth={isAuth} element={PHome} />
              : <PLogin onLoginSuccess={handleLoginSuccess} />
          }
        />

        {/*
         * Rotas internas protegidas.
         * Qualquer tentativa de acesso direto sem autenticacao redireciona
         * para a raiz, onde o usuario vera a pagina de login.
         */}
        <Route
          path="/clientes"
          element={<ProtectedRoute isAuth={isAuth} element={PListagemCliente} />}
        />

        <Route
          path="/emprestimos"
          element={<ProtectedRoute isAuth={isAuth} element={PListagemEmprestimo} />}
        />

        <Route
          path="/novo-cliente"
          element={<ProtectedRoute isAuth={isAuth} element={PFormCliente} />}
        />

        <Route
          path="/novo-emprestimo"
          element={<ProtectedRoute isAuth={isAuth} element={PFormEmprestimo} />}
        />

        <Route
          path="/clientes/:id"
          element={<ProtectedRoute isAuth={isAuth} element={PDetalhesCliente} />}
        />

        <Route
          path="/emprestimos/:id"
          element={<ProtectedRoute isAuth={isAuth} element={PDetalhesEmprestimo} />}
        />

        {/* Qualquer rota inexistente cai na raiz */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;