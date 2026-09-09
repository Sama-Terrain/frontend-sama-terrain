import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logoVert from '../../assets/logo-sama-terrain-vert.png';

export default function Navbar({ onNavigate, currentPage = 'accueil' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => onNavigate && onNavigate('accueil')}
            className="flex items-center cursor-pointer"
          > 
            <img 
              src={logoVert} 
              alt="Logo Sama Terrain" 
              className="h-24 w-auto object-contain cursor-pointer" 
              onClick={() => onNavigate && onNavigate('accueil')}
            />
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate && onNavigate('accueil')}
              className={`text-sm font-semibold transition-colors ${
                currentPage === 'accueil'
                  ? 'text-[#004030] font-bold border-b-2 border-[#004030] pb-1'
                  : 'text-gray-600 hover:text-[#004030]'
              }`}
            >
              Accueil
            </button>
            <button
              onClick={() => onNavigate && onNavigate('terrains')}
              className={`text-sm font-semibold transition-colors ${
                currentPage === 'terrains'
                  ? 'text-[#004030] font-bold border-b-2 border-[#004030] pb-1'
                  : 'text-gray-600 hover:text-[#004030]'
              }`}
            >
              Terrains
            </button>
            <button
              onClick={() => onNavigate && onNavigate('gerant')}
              className="text-sm font-semibold text-gray-600 hover:text-[#004030] transition-colors"
            >
              Devenir Gérant
            </button>
          </nav>

          {/* Boutons d'action Auth Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => onNavigate && onNavigate('login')}
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#004030] transition-colors cursor-pointer"
            >
              Se connecter
            </button>
            <button
              onClick={() => onNavigate && onNavigate('register')}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#004030] rounded-lg hover:bg-[#005943] transition-all cursor-pointer"
            >
              S'inscrire
            </button>
          </div>

          {/* Bouton Menu Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-[#004030] focus:outline-none"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Drawer Menu Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            <button
              onClick={() => {
                onNavigate && onNavigate('accueil');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 text-base font-semibold text-gray-800 hover:text-[#004030]"
            >
              Accueil
            </button>
            <button
              onClick={() => {
                onNavigate && onNavigate('terrains');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 text-base font-semibold text-gray-800 hover:text-[#004030]"
            >
              Terrains
            </button>
            <button
              onClick={() => {
                onNavigate && onNavigate('gerant');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 text-base font-semibold text-gray-800 hover:text-[#004030]"
            >
              Devenir Gérant
            </button>
          </nav>

          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
            <button
              onClick={() => {
                onNavigate && onNavigate('login');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              Se connecter
            </button>
            <button
              onClick={() => {
                onNavigate && onNavigate('register');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[#004030] rounded-lg hover:bg-[#005943]"
            >
              S'inscrire
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
