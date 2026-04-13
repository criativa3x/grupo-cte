import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/">
              <img 
                src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774648783/logo_kb9nkn.png" 
                alt="Grupo CTE Logo" 
                className="h-12 w-auto"
                referrerPolicy="no-referrer"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/#inicio" className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">Início</Link>
            <Link to="/#cursos" className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">Cursos</Link>
            <Link to="/quero-estagiar" className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">Quero Estagiar</Link>
            <Link to="/para-empresas" className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">Para Empresas</Link>
            <Link to="/vagas" className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">Vagas</Link>
            <Link to="/quem-somos" className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">Quem Somos</Link>
          </nav>

          {/* CTA Button - High Prominence */}
          <div className="hidden md:flex items-center">
            <a 
              href="https://wa.me/5571981586484?text=Olá!%20Gostaria%20de%20informações%20sobre%20o%20Grupo%20CTE." 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-[0_4px_20px_rgba(234,88,12,0.4)] hover:scale-105 active:scale-95"
            >
              Fale com um Consultor
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-orange-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/#inicio" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">Início</Link>
            <Link to="/#cursos" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">Cursos</Link>
            <Link to="/quero-estagiar" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">Quero Estagiar</Link>
            <Link to="/para-empresas" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">Para Empresas</Link>
            <Link to="/vagas" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">Vagas</Link>
            <Link to="/quem-somos" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">Quem Somos</Link>
            <a 
              href="https://wa.me/5571981586484?text=Olá!%20Gostaria%20de%20informações%20sobre%20o%20Grupo%20CTE." 
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center mt-4 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              Fale com um Consultor
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
