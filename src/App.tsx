import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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
  // Verifica o estado real de autenticação no armazenamento local
  const isAuthenticated = !!localStorage.getItem('isAuth');

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de Autenticação Pública */}
        <Route path='/login' element={<PLogin />} />

        {/* Bloqueio Total: Se não estiver logado, qualquer rota abaixo redireciona para /login */}
        <Route 
          path='/' 
          element={isAuthenticated ? <ProtectedRoute element={PHome} /> : <Navigate to="/login" replace />} 
        />
        
        <Route 
          path='/clientes' 
          element={isAuthenticated ? <ProtectedRoute element={PListagemCliente} /> : <Navigate to="/login" replace />} 
        />
        
        <Route 
          path='/emprestimos' 
          element={isAuthenticated ? <ProtectedRoute element={PListagemEmprestimo} /> : <Navigate to="/login" replace />} 
        />

        <Route 
          path='/novo-cliente' 
          element={isAuthenticated ? <ProtectedRoute element={PFormCliente} /> : <Navigate to="/login" replace />} 
        />
        
        <Route 
          path='/novo-emprestimo' 
          element={isAuthenticated ? <ProtectedRoute element={PFormEmprestimo} /> : <Navigate to="/login" replace />} 
        />

        <Route 
          path='/clientes/:id' 
          element={isAuthenticated ? <ProtectedRoute element={PDetalhesCliente} /> : <Navigate to="/login" replace />} 
        />
        
        <Route 
          path='/emprestimos/:id' 
          element={isAuthenticated ? <ProtectedRoute element={PDetalhesEmprestimo} /> : <Navigate to="/login" replace />} 
        />

        {/* Rota de segurança para caminhos inexistentes ou tentativas de burla */}
        <Route path='*' element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;