import { Home, LogOut, Menu, SquarePlus, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogado, setIsLogado] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const logado = localStorage.getItem('isLogado') === 'true';
    const name = localStorage.getItem('name');
    setName(name ? JSON.parse(name) : null);
    setIsLogado(logado);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      setIsLogado(false);
      setName(null);
      localStorage.removeItem('isLogado');
      localStorage.removeItem('name');
      localStorage.removeItem('access_token');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      navigate('/login');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white shadow-md w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex-shrink: 0 flex items-center gap-2">
            <span className="text-2xl">❤️</span>
            <span className="hidden sm:inline font-bold text-pink-600">
             Everyone_Love_Anime
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-pink-600 transition">
              <Home size={20} />
              <span>Home</span>
            </Link>
            {isLogado && (
              <>
                <Link to="/criar" className="flex items-center gap-2 text-gray-700 hover:text-pink-600 transition">
                  <SquarePlus size={20} />
                  <span>Criar</span>
                </Link>
                <Link to="/perfil" className="text-gray-700 hover:text-pink-600 transition">
                  Perfil
                </Link>
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar posts..."
                className="pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 text-sm"
              />
            </form>
            {isLogado ? (
              <>
                {name && (
                  <span className="text-sm text-gray-600">Olá, {name}</span>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-pink-600 transition hover:bg-gray-100 px-4 py-2 rounded-lg"
                  title="Sair"
                >
                  <LogOut size={20} />
                  <span className="text-sm font-medium">Sair</span>
                </button>
              </>
            ) : (
              <Link to="/login">
                <button className="text-gray-700 hover:text-pink-600 transition hover:bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2">
                  <User size={20} />
                  <span className="text-sm font-medium">Login</span>
                </button>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 text-gray-700 hover:text-pink-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-in">
          <nav className="px-4 py-3 space-y-2">
            <form onSubmit={handleSearch} className="mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar posts..."
                className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 text-sm"
              />
            </form>
            <Link to="/" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-pink-50 hover:text-pink-600">
              Home
            </Link>
            {isLogado && (
              <>
                <Link to="/criar" className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-pink-50 hover:text-pink-600">
                  <SquarePlus size={18} />
                  Criar
                </Link>
                {name && (
                  <div className="px-4 py-2 text-sm text-gray-600">Ola, {name}</div>
                )}
                <Link to="/perfil" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-pink-50 hover:text-pink-600">
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition mt-2"
                >
                  <LogOut size={18} />
                  <span>Sair</span>
                </button>
              </>
            )}
            {!isLogado && (
              <Link to="/login" className="block w-full text-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition">
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
