import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './services/supabase';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import CadastrarPropriedade from './pages/CadastrarPropriedade';
import PropriedadeDetalhe from './pages/PropriedadeDetalhe';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header user={user} />
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/propriedade/:id" element={<PropriedadeDetalhe />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/cadastrar" element={<CadastrarPropriedade />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}