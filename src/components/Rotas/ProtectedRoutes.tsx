import type { JSX, ComponentType } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  isAuth: boolean;
  element: ComponentType;
}

/**
 * ProtectedRoute
 *
 * Responsável por proteger rotas autenticadas.
 *
 * - Se autenticado: renderiza o componente normalmente
 * - Se não autenticado: redireciona para login (/)
 *
 * Mantém a lógica centralizada no App.tsx (single source of truth)
 */
function ProtectedRoute({
  isAuth,
  element: Element,
}: ProtectedRouteProps): JSX.Element {
  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return <Element />;
}

export default ProtectedRoute;