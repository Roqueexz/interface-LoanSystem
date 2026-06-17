import { Navigate } from 'react-router-dom';
import { type ComponentType } from 'react';

interface ProtectedRouteProps {
  /*
   * Recebe o estado de autenticacao diretamente do App.tsx via prop,
   * em vez de ler o localStorage de forma independente.
   * Isso garante que o ProtectedRoute sempre reflita o mesmo estado
   * reativo que controla as demais rotas, sem dessincronizacao.
   */
  isAuth: boolean;
  element: ComponentType;
  [key: string]: unknown;
}

/*
 * Componente de protecao de rota.
 *
 * Se o usuario estiver autenticado (isAuth === true), renderiza o componente
 * solicitado normalmente. Caso contrario, redireciona para a raiz ('/'),
 * onde o App.tsx, ciente do estado nao autenticado, exibira a pagina de login.
 *
 * O redirecionamento aponta para '/' e nao para '/login' porque a rota
 * '/login' nao existe nesta arquitetura. A raiz e responsavel por decidir
 * o que exibir com base no estado de autenticacao.
 */
const ProtectedRoute = ({ isAuth, element: Element, ...rest }: ProtectedRouteProps) => {
  return isAuth ? <Element {...rest} /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;