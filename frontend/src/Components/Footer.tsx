import { Facebook, Github, Heart, Instagram, Mail, Smartphone, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">


          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">❤️</span>
              <span className="font-bold text-pink-600 text-lg">Everyone_Love_Anime</span>
            </div>
            <p className="text-gray-600 text-sm">
              Sua comunidade para compartilhar amor por anime e mangá.
            </p>

            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-pink-600 transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-600 transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-600 transition">
                <Instagram size={20} />
              </a>
              <a href="https://github.com/Whofelisberto?tab=repositories" className="text-gray-400 hover:text-pink-600 transition">
                <Github size={20} />
              </a>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">
              Navegação
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-600 hover:text-pink-600 transition text-sm">
                Home
              </Link>
              <Link to="/criar" className="text-gray-600 hover:text-pink-600 transition text-sm">
                Criar
              </Link>
              <Link to="/login" className="text-gray-600 hover:text-pink-600 transition text-sm">
                Login
              </Link>
            </nav>
          </div>


          <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">
              Informações
            </h3>
            <nav className="flex flex-col space-y-3">
              <a href="#" className="text-gray-600 hover:text-pink-600 transition text-sm">
                Sobre Nós
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-600 transition text-sm">
                Termos de Serviço
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-600 transition text-sm">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-600 transition text-sm">
                Contato
              </a>
            </nav>
          </div>


          <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">
              Contato
            </h3>
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-pink-600 shrink-0 mt-1" />
              <div className="flex flex-col">
                <span className="text-gray-600 text-sm">Email</span>
                <a href="mailto:info@everyoneloveanimee.com" className="text-gray-800 hover:text-pink-600 transition text-sm font-medium">
                  info@everyoneloveanimee.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Smartphone size={18} className="text-pink-600 shrink-0 mt-1" />
              <div className="flex flex-col">
                <span className="text-gray-600 text-sm">Telefone</span>
                <a href="tel:+5511999999999" className="text-gray-800 hover:text-pink-600 transition text-sm font-medium">
                  +55 (21) 9999-9999
                </a>
              </div>
            </div>
          </div>
        </div>


        <div className="border-t border-gray-200 pt-8">

          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm">
              © {currentYear} <span className="font-bold text-pink-600">Everyone Love Anime</span>. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              Feito com <Heart size={16} className="text-red-500 fill-red-500" /> por WhoFelisberto
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
