import { useState } from 'react';
import { Menu, X, ChevronDown, LogOut, Calendar } from 'lucide-react';
import logoVert from '../../assets/logo-sama-terrain-vert.png';

export default function Navbar({ onNavigate, currentPage = 'accueil', currentUser, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Initiales de l'utilisateur
  const getInitials = (user) => {
    if (user?.initiales) return user.initiales;
    if (user?.prenom && user?.nom) {
      return `${user.prenom[0]}${user.nom[0]}`.toUpperCase();
    }
    return 'MD';
  };

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

            {/* Lien "Mes réservations" affiché si connecté ou pour la navigation */}
            <button
              onClick={() => onNavigate && onNavigate('reservations')}
              className={`text-sm font-semibold transition-colors ${
                currentPage === 'reservations'
                  ? 'text-[#004030] font-bold border-b-2 border-[#004030] pb-1'
                  : 'text-gray-600 hover:text-[#004030]'
              }`}
            >
              Mes réservations
            </button>

            <button
              onClick={() => onNavigate && onNavigate('gerant')}
              className={`text-sm font-semibold transition-colors ${
                currentPage === 'gerant'
                  ? 'text-[#004030] font-bold border-b-2 border-[#004030] pb-1'
                  : 'text-gray-600 hover:text-[#004030]'
              }`}
            >
              Devenir Gérant
            </button>
          </nav>

          {/* Zone Droite : Utilisateur connecté vs Boutons Auth */}
          {currentUser ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity cursor-pointer focus:outline-none"
              >
                {/* Cercle Vert Pale d'initiales MD / Utilisateur (Exact Figma node-id 140-583) */}
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
                      if (onLogout) onLogout();
                      if (onNavigate) onNavigate('accueil');
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
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
                onNavigate && onNavigate('reservations');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 text-base font-semibold text-gray-800 hover:text-[#004030]"
            >
              Mes réservations
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
                    if (onNavigate) onNavigate('accueil');
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-red-600 bg-red-50 rounded-lg"
                >
                  Se déconnecter
                </button>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
