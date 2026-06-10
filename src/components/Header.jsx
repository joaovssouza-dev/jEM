import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, PlusCircle, LogOut } from 'lucide-react';
import { supabase } from '../services/supabase';

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="h-20 w-full flex items-center justify-between px-6 md:px-12 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <Link to="/" className="text-2xl font-black text-jem-primary tracking-tighter">
        jEM
      </Link>

      <nav className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/cadastrar" className="hidden md:flex items-center gap-2 text-jem-text font-bold hover:text-jem-primary transition-colors">
              <PlusCircle size={20} /> Anunciar
            </Link>
            
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
              <User size={16} className="text-jem-primary" />
              <span className="text-sm font-bold text-jem-text">
                {user.user_metadata?.nome || user.email.split('@')[0]}
              </span>
            </div>

            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <Link 
            to="/login" 
            className="flex items-center gap-2 bg-jem-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-jem-accent transition-all shadow-lg shadow-jem-primary/20"
          >
            <LogIn size={18} /> Entrar
          </Link>
        )}
      </nav>
    </header>
  );
}