import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../services/supabase';
import { loginComGoogle } from '../utils/auth';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) throw error;

      navigate('/');
    } catch (error) {
      console.error(error);
      setErro('E-mail ou senha incorretos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] w-full bg-jem-text relative overflow-hidden flex items-center justify-center p-4">

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-jem-primary/30 blur-[120px] animate-pulse"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-jem-accent/30 blur-[150px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-jem-primary/20 blur-[120px]"></div>
      </div>

      <Link
        to="/"
        className="absolute top-8 left-8 z-20 flex items-center text-sm font-semibold text-white/70 hover:text-white transition-all"
      >
        <ArrowLeft size={20} className="mr-2" />
        Voltar para o início
      </Link>

      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-lg rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-jem-primary tracking-tight mb-2">jEM</h1>
          <p className="text-sm text-gray-500 font-medium">Bem-vindo ao seu portal de lazer</p>
        </div>

        {erro && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium text-center">
            {erro}
          </div>
        )}

        <div className="space-y-5">
          <button
            type="button"
            onClick={loginComGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 h-12 rounded-xl font-bold text-base hover:bg-gray-50 transition-all shadow-sm"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" />
            Entrar com Google
          </button>

          <div className="relative flex items-center py-1">
            <div className="grow border-t border-gray-200"></div>
            <span className="shrink-0 px-4 text-xs text-gray-400 uppercase font-bold">ou com e-mail</span>
            <div className="grow border-t border-gray-200"></div>
          </div>

          <form className="space-y-3" onSubmit={handleLogin}>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-jem-primary" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="E-mail"
                className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-11 text-base focus:ring-2 focus:ring-jem-primary focus:outline-none transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-jem-primary" />
              <input
                type={mostrarSenha ? 'text' : 'password'} // A Mágica acontece aqui
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                placeholder="Senha"
                className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-12 text-base focus:ring-2 focus:ring-jem-primary focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-jem-primary transition-colors"
              >
                {mostrarSenha ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-jem-primary text-white h-12 rounded-xl font-bold text-base hover:bg-jem-accent transition-all shadow-lg shadow-jem-primary/20 flex items-center justify-center disabled:opacity-70 mt-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Entrar'}
            </button>
          </form>

          <div className="text-center text-sm space-y-3 mt-4">
            <a href="#" className="block text-jem-primary font-bold hover:underline">
              Esqueceu a senha?
            </a>

            <p className="text-gray-500 mt-4">
              Ainda não tem conta?{' '}
              <Link to="/cadastro" className="text-jem-primary font-bold hover:underline">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}