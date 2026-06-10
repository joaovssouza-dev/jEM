import { Link } from 'react-router-dom';
import { User, LogOut, Settings, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export default function Header() {
  const [user, setUser] = useState(null);
  const [nome, setNome] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data } = await supabase.from('usuarios').select('nome').eq('id', session.user.id).single();
        if (data) setNome(data.nome);
      }
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-full">
        <Link to="/" className="text-4xl font-bold text-jem-primary tracking-tight">jEM</Link>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/cadastrar" className="bg-jem-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-jem-accent transition-colors">
                <Plus size={18} /> Anunciar
              </Link>

              <span className="font-semibold text-jem-text text-sm hidden sm:block">Olá, {nome.split(' ')[0]}</span>

              <button onClick={handleLogout} className="text-gray-500 hover:text-red-600"><LogOut size={20} /></button>
            </div>
          ) : (
            <Link to="/login" className="bg-jem-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-jem-accent transition-colors flex items-center gap-2">
              <User size={20} /> Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}