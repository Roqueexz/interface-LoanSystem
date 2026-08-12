import "./App.css";
import { useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";

import ProtectedRoute from "./components/Rotas/ProtectedRoutes";
import PLogin from "./pages/Login/PLogin";

import { ApiStatusProvider } from "./context/ApiStatusContext";

// Lazy Loading das paginas
const PHome = lazy(() => import("./pages/Inicio/PInicio"));
const PListagemCliente = lazy(
  () => import("./pages/Cliente/PListagemCliente/PListagemCliente"),
);
const PCliente = lazy(() => import("./pages/Cliente/PCliente/PCliente"));
const PEditarCliente = lazy(
  () => import("./pages/Cliente/PEditarCliente/PEditarCliente"),
);
const PFormCliente = lazy(
  () => import("./pages/Cliente/PFormCliente/PFormCliente"),
);
const PListagemEmprestimo = lazy(
  () => import("./pages/Emprestimo/PListagemEmprestimo/PListagemEmprestimo"),
);
const PDetalhesEmprestimo = lazy(
  () => import("./pages/Emprestimo/PDetalhesEmprestimo/PDetalhesEmprestimo"),
);
const PEditarEmprestimo = lazy(
  () => import("./pages/Emprestimo/PEditarEmprestimo/PEditarEmprestimo"),
);
const PFormEmprestimo = lazy(
  () => import("./pages/Emprestimo/PFormEmprestimo/PFormEmprestimo"),
);
const PCaixa = lazy(() => import("./pages/Caixa/PCaixa"));
const PDashboardInteligente = lazy(
  () => import("./pages/Dashboard/PDashboardInteligente"),
);
const PCalendario = lazy(() => import("./pages/Calendario/PCalendario"));
const PNotificacoes = lazy(() => import("./pages/Notificacoes/PNotificacoes"));
const PPerfil = lazy(() => import("./pages/Usuario/PPerfil/PPerfil"));
const Erro404 = lazy(() => import("./components/Erros/Erro404"));

// Componente de loading global
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Loader2 size={32} className="animate-spin text-primary" />
  </div>
);

function App() {
  const [isAuth, setIsAuth] = useState<boolean>(() => {
    return localStorage.getItem("isAuth") === "true";
  });

  const handleLoginSuccess = () => {
    setIsAuth(true);
  };

  return (
    <ApiStatusProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ROTA RAIZ */}
          <Route
            path="/"
            element={
              isAuth ? (
                <ProtectedRoute isAuth={isAuth}>
                  <PHome />
                </ProtectedRoute>
              ) : (
                <PLogin onLoginSuccess={handleLoginSuccess} />
              )
            }
          />

          {/* LISTAGENS */}
          <Route
            path="/clientes"
            element={
              <ProtectedRoute isAuth={isAuth}>
                <PListagemCliente />
              </ProtectedRoute>
            }
          />

          <Route
            path="/emprestimos"
            element={
              <ProtectedRoute isAuth={isAuth}>
                <PListagemEmprestimo />
              </ProtectedRoute>
            }
          />

          <Route
            path="/caixa"
            element={
              <ProtectedRoute isAuth={isAuth}>
                <PCaixa />
              </ProtectedRoute>
            }
          />

          {/* CRIAÇÃO */}
          <Route
            path="/clientes/novo"
            element={
              <ProtectedRoute isAuth={isAuth}>
                <PFormCliente />
              </ProtectedRoute>
            }
          />

          <Route
            path="/emprestimos/novo"
            element={
              <ProtectedRoute isAuth={isAuth}>
                <PFormEmprestimo />
              </ProtectedRoute>
            }
          />

          {/* DETALHE / DASHBOARD DO CLIENTE */}
          <Route
            path="/clientes/:id"
            element={
              <ProtectedRoute isAuth={isAuth}>
                <PCliente />
              </ProtectedRoute>
            }
          />

          {/* EDIÇÃO */}
          <Route
            path="/editar-cliente/:id"
            element={
              <ProtectedRoute isAuth={isAuth}>
                <PEditarCliente />
              </ProtectedRoute>
            }
          />

          <Route
            path="/editar-emprestimo/:id"
            element={
              <ProtectedRoute isAuth={isAuth}>
                <PEditarEmprestimo />
              </ProtectedRoute>
            }
          />

          {/* DETALHE EMPRESTIMO */}
          <Route
            path="/emprestimos/:id"
            element={
              <ProtectedRoute isAuth={isAuth}>
                <PDetalhesEmprestimo />
              </ProtectedRoute>
            }
          />

          {/* DASHBOARD INTELIGENTE */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuth={isAuth}>
                <PDashboardInteligente />
              </ProtectedRoute>
            }
          />

          {/* CALENDÁRIO FINANCEIRO */}
          <Route
            path="/calendario"
            element={
              <ProtectedRoute isAuth={isAuth}>
                <PCalendario />
              </ProtectedRoute>
            }
          />

          {/* NOTIFICAÇÕES */}
          <Route
            path="/notificacoes"
            element={
              <ProtectedRoute isAuth={isAuth}>
                <PNotificacoes />
              </ProtectedRoute>
            }
          />

          {/* PERFIL */}
          <Route
            path="/perfil"
            element={
              <ProtectedRoute isAuth={isAuth}>
                <PPerfil />
              </ProtectedRoute>
            }
          />

          {/* ROTA CATCH-ALL PARA 404 */}
          <Route path="*" element={<Erro404 />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </ApiStatusProvider>
  );
}

export default App;
