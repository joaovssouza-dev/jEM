import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user } = useAuth();

  return (
    <header>
      {user ? (
        <span>Logado como: {user.email}</span>
      ) : (
        <Link to="/login">Entrar</Link>
      )}
    </header>
  );
}