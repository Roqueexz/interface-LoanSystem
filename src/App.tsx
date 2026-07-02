import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PHome from './pages/PInicio/PInicio';
import PListagemCliente from './pages/PListagem/PListagemCliente/PListagemCliente';
import PListagemEmprestimo from './pages/PListagem/PListagemEmprestimo/PListagemEmprestimo';
import PFormCliente from './pages/PFormularios/PFormCliente/PFormCliente';
import PFormEmprestimo from './pages/PFormularios/PFormEmprestimo/PFormEmprestimo';
import PDetalhesCliente from './pages/PDetalhes/PDetalhesCliente/PDetalhesCliente';
import PDetalhesEmprestimo from './pages/PDetalhes/PDetalhesEmprestimo/PDetalhesEmprestimo';
import PEditarEmprestimo from './pages/PFormularios/PEditarEmprestimo/PEditarEmprestimo';
import PEditarCliente from "./pages/PFormularios/PEditarCliente/PEditarCliente";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Início */}
        <Route path='/' element={<PHome />} />

        {/* Listagens */}
        <Route path='/clientes' element={<PListagemCliente />} />
        <Route path='/emprestimos' element={<PListagemEmprestimo />} />

        {/* Formulários (Cadastro) */}
        <Route path='/novo-cliente' element={<PFormCliente />} />
        <Route path='/novo-emprestimo' element={<PFormEmprestimo />} />

        {/* Formulários (Edição) */}
        <Route path='/editar-emprestimo/:id' element={<PEditarEmprestimo />} />
        <Route path="/editar-cliente/:id"   element={<PEditarCliente />}
        />
  
        {/* Detalhes (Visualização) */}
        <Route path='/clientes/:id' element={<PDetalhesCliente />} />
        <Route path='/emprestimos/:id' element={<PDetalhesEmprestimo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;