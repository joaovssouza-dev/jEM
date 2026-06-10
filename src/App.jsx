import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import CadastrarPropriedade from './pages/CadastrarPropriedade';
import PropriedadeDetalhe from './pages/PropriedadeDetalhe';

export default function App() {
  return (
    <BrowserRouter>
      {/* Container principal */}
      <div className="min-h-screen flex flex-col bg-gray-50">

        <Header />

        {/* Conteúdo principal */}
        <main className="grow">
          <Routes>
            {/* Vitrine e Detalhes */}
            <Route path="/" element={<Home />} />
            <Route path="/propriedade/:id" element={<PropriedadeDetalhe />} />

            {/* Autenticação */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />

            {/* Área do Locador */}
            <Route path="/cadastrar" element={<CadastrarPropriedade />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}