import type { JSX, ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  isAuth: boolean;
  children: ReactNode;
}

/**
 * ProtectedRoute
 *
 * Responsável por proteger rotas autenticadas.
 *
 * - Se autenticado: renderiza o children normalmente
 * - Se não autenticado: redireciona para login (/)
 *
 * Mantém a lógica centralizada no App.tsx (single source of truth)
 */
function ProtectedRoute({
  isAuth,
  children,
}: ProtectedRouteProps): JSX.Element {
  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;