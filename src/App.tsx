import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PHome from './pages/PHome/PHome'
import PListagemCliente from './pages/PListagem/PListagemCliente/PListagemCliente'
import PListagemEmprestimo from './pages/PListagem/PListagemEmprestimo/PListagemEmprestimo'
import PFormCliente from './pages/PFormularios/PFormCliente/PFormCliente'
import PFormEmprestimo from './pages/PFormularios/PFormEmprestimo/PFormEmprestimo'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PHome />} />
        <Route path='/clientes' element={<PListagemCliente />} />
        <Route path='/emprestimos' element={<PListagemEmprestimo />} />
        <Route path='/novo-cliente' element={<PFormCliente />} />
        <Route path='/novo-emprestimo' element={<PFormEmprestimo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
