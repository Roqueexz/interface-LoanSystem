import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/Rotas/ProtectedRoutes";

import PLogin from "./pages/Login/PLogin";
import PHome from "./pages/Inicio/PInicio";

import PListagemCliente from "./pages/Cliente/PListagemCliente/PListagemCliente";
import PCliente from "./pages/Cliente/PCliente/PCliente";
import PEditarCliente from "./pages/Cliente/PEditarCliente/PEditarCliente";
import PFormCliente from "./pages/Cliente/PFormCliente/PFormCliente"; // NOVO

import PListagemEmprestimo from "./pages/Emprestimo/PListagemEmprestimo/PListagemEmprestimo";
import PDetalhesEmprestimo from "./pages/Emprestimo/PDetalhesEmprestimo/PDetalhesEmprestimo";
import PEditarEmprestimo from "./pages/Emprestimo/PEditarEmprestimo/PEditarEmprestimo";
import PFormEmprestimo from "./pages/Emprestimo/PFormEmprestimo/PFormEmprestimo"; // NOVO

import PCaixa from "./pages/Caixa/PCaixa";
import PPerfil from "./pages/Usuario/PPerfil/PPerfil";

function App() {
  const [isAuth, setIsAuth] = useState<boolean>(() => {
    return localStorage.getItem("isAuth") === "true";
  });

  const handleLoginSuccess = () => {
    setIsAuth(true);
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* ROTA RAIZ */}
        <Route
          path="/"
          element={
            isAuth ? (
              <ProtectedRoute isAuth={isAuth} element={PHome} />
            ) : (
              <PLogin onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* LISTAGENS */}
        <Route
          path="/clientes"
          element={<ProtectedRoute isAuth={isAuth} element={PListagemCliente} />}
        />

        <Route
          path="/emprestimos"
          element={<ProtectedRoute isAuth={isAuth} element={PListagemEmprestimo} />}
        />

        <Route
          path="/caixa"
          element={<ProtectedRoute isAuth={isAuth} element={PCaixa} />}
        />

        {/* CRIAÇÃO - NOVAS ROTAS */}
        <Route
          path="/clientes/novo"
          element={<ProtectedRoute isAuth={isAuth} element={PFormCliente} />}
        />

        <Route
          path="/emprestimos/novo"
          element={<ProtectedRoute isAuth={isAuth} element={PFormEmprestimo} />}
        />

        {/* DETALHE / DASHBOARD DO CLIENTE */}
        <Route
          path="/clientes/:id"
          element={<ProtectedRoute isAuth={isAuth} element={PCliente} />}
        />

        {/* EDIÇÃO */}
        <Route
          path="/editar-cliente/:id"
          element={<ProtectedRoute isAuth={isAuth} element={PEditarCliente} />}
        />

        <Route
          path="/editar-emprestimo/:id"
          element={<ProtectedRoute isAuth={isAuth} element={PEditarEmprestimo} />}
        />

        {/* DETALHE EMPRESTIMO */}
        <Route
          path="/emprestimos/:id"
          element={<ProtectedRoute isAuth={isAuth} element={PDetalhesEmprestimo} />}
        />

        <Route
    path="/perfil"
  element={<ProtectedRoute isAuth={isAuth} element={PPerfil} />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;