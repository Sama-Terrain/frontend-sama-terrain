import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, Calendar } from 'lucide-react';
import logoVert from '../../assets/logo-sama-terrain-vert.png';

export default function Navbar({ currentUser, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Initiales de l'utilisateur
  const getInitials = (user) => {
    if (user?.initiales) return user.initiales;
    if (user?.prenom && user?.nom) {
      return `${user.prenom[0]}${user.nom[0]}`.toUpperCase();
    }
    return 'MD';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center cursor-pointer">
            <img 
              src={logoVert} 
              alt="Logo Sama Terrain" 
              className="h-24 w-auto object-contain cursor-pointer" 
            />
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors ${
                isActive('/')
                  ? 'text-[#004030] font-bold border-b-2 border-[#004030] pb-1'
                  : 'text-gray-600 hover:text-[#004030]'
              }`}
            >
              Accueil
            </Link>

            <Link
              to="/terrains"
              className={`text-sm font-semibold transition-colors ${
                isActive('/terrains')
                  ? 'text-[#004030] font-bold border-b-2 border-[#004030] pb-1'
                  : 'text-gray-600 hover:text-[#004030]'
              }`}
            >
              Terrains
            </Link>

            {/* Lien "Mes réservations" affiché UNIQUEMENT si l'utilisateur est connecté */}
            {currentUser && (
              <Link
                to="/reservations"
                className={`text-sm font-semibold transition-colors ${
                  isActive('/reservations')
                    ? 'text-[#004030] font-bold border-b-2 border-[#004030] pb-1'
                    : 'text-gray-600 hover:text-[#004030]'
                }`}
              >
                Mes réservations
              </Link>
            )}

            <Link
              to="/gerant"
              className={`text-sm font-semibold transition-colors ${
                isActive('/gerant')
                  ? 'text-[#004030] font-bold border-b-2 border-[#004030] pb-1'
                  : 'text-gray-600 hover:text-[#004030]'
              }`}
            >
              Devenir Gérant
            </Link>
          </nav>

          {/* Zone Droite : Utilisateur connecté vs Boutons Auth */}
          {currentUser ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity cursor-pointer focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-[#e6f4ea] text-[#004030] font-bold text-xs flex items-center justify-center border border-emerald-100">
                  {getInitials(currentUser)}
                </div>

                <span className="text-sm font-bold text-gray-900">
                  {currentUser.prenom} {currentUser.nom}
                </span>

                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {/* Dropdown Menu Utilisateur Connecté */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-[8px] border border-gray-200 shadow-lg py-2 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900">{currentUser.prenom} {currentUser.nom}</p>
                    <p className="text-[11px] text-gray-500 truncate">{currentUser.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      navigate('/reservations');
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-[#004030] text-left"
                  >
                    <Calendar size={14} />
                    <span>Mes réservations</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onLogout) onLogout();
                      navigate('/');
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 text-left cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Boutons d'action Auth Desktop si Déconnecté */
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#004030] transition-colors cursor-pointer"
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#004030] rounded-lg hover:bg-[#005943] transition-all cursor-pointer"
              >
                S'inscrire
              </Link>
            </div>
          )}

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
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-4 text-left">
          <nav className="flex flex-col space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left py-2 text-base font-semibold text-gray-800 hover:text-[#004030]"
            >
              Accueil
            </Link>

            <Link
              to="/terrains"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left py-2 text-base font-semibold text-gray-800 hover:text-[#004030]"
            >
              Terrains
            </Link>

            {currentUser && (
              <Link
                to="/reservations"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left py-2 text-base font-semibold text-gray-800 hover:text-[#004030]"
              >
                Mes réservations
              </Link>
            )}

            <Link
              to="/gerant"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left py-2 text-base font-semibold text-gray-800 hover:text-[#004030]"
            >
              Devenir Gérant
            </Link>
          </nav>

          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-2 bg-[#e6f4ea] rounded-[8px]">
                  <div className="w-8 h-8 rounded-full bg-[#004030] text-white font-bold text-xs flex items-center justify-center">
                    {getInitials(currentUser)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{currentUser.prenom} {currentUser.nom}</p>
                    <p className="text-[10px] text-gray-600">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onLogout) onLogout();
                    navigate('/');
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-red-600 bg-red-50 rounded-lg cursor-pointer"
                >
                  Se déconnecter
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 block"
                >
                  Se connecter
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[#004030] rounded-lg hover:bg-[#005943] block"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
