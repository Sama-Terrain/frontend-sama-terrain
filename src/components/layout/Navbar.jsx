import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, User, Home, MapPinned, CalendarCheck, Building2, LogIn } from 'lucide-react';
import logoVert from '../../assets/logo-sama-terrain-vert.png';

// Liens de la barre de navigation basse (mobile uniquement), selon que
// quelqu'un est connecté ou non — 4 destinations maximum pour rester lisible.
const LIENS_BAS_CONNECTE = [
  { to: '/', label: 'Accueil', icon: Home },
  { to: '/terrains', label: 'Terrains', icon: MapPinned },
  { to: '/reservations', label: 'Réservations', icon: CalendarCheck },
  { to: '/profil', label: 'Profil', icon: User },
];

const LIENS_BAS_DECONNECTE = [
  { to: '/', label: 'Accueil', icon: Home },
  { to: '/terrains', label: 'Terrains', icon: MapPinned },
  { to: '/gerant', label: 'Devenir Gérant', icon: Building2 },
  { to: '/login', label: 'Connexion', icon: LogIn },
];

export default function Navbar({ currentUser, onLogout }) {
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
                  ? 'text-vert-principal font-bold border-b-2 border-vert-principal pb-1'
                  : 'text-gray-600 hover:text-vert-principal'
              }`}
            >
              Accueil
            </Link>

            <Link
              to="/terrains"
              className={`text-sm font-semibold transition-colors ${
                isActive('/terrains')
                  ? 'text-vert-principal font-bold border-b-2 border-vert-principal pb-1'
                  : 'text-gray-600 hover:text-vert-principal'
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
                    ? 'text-vert-principal font-bold border-b-2 border-vert-principal pb-1'
                    : 'text-gray-600 hover:text-vert-principal'
                }`}
              >
                Mes réservations
              </Link>
            )}

            <Link
              to="/gerant"
              className={`text-sm font-semibold transition-colors ${
                isActive('/gerant')
                  ? 'text-vert-principal font-bold border-b-2 border-vert-principal pb-1'
                  : 'text-gray-600 hover:text-vert-principal'
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
                <div className="w-9 h-9 rounded-full bg-vert-clair text-vert-principal font-bold text-xs flex items-center justify-center border border-emerald-100">
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
                      navigate('/profil');
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-vert-principal text-left cursor-pointer"
                  >
                    <User size={14} />
                    <span>Mon profil</span>
                  </button>

                  {/* <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      navigate('/reservations');
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-vert-principal text-left"
                  >
                    <Calendar size={14} />
                    <span>Mes réservations</span>
                  </button> */}

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
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-vert-principal transition-colors cursor-pointer"
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-vert-principal rounded-lg hover:bg-vert-survol transition-all cursor-pointer"
              >
                S'inscrire
              </Link>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}

/**
 * Composant BarreNavigationBasse
 * Barre de navigation fixée en bas de l'écran, visible uniquement sur
 * mobile (< md), avec les 4 destinations principales selon la connexion.
 * À utiliser dans App.jsx à côté de <Navbar />.
 */
export function BarreNavigationBasse({ currentUser }) {
  const location = useLocation();
  const liens = currentUser ? LIENS_BAS_CONNECTE : LIENS_BAS_DECONNECTE;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex pb-[env(safe-area-inset-bottom,0px)]">
      {liens.map(({ to, label, icon: Icon }) => {
        const active = location.pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 relative ${
              active ? 'text-vert-principal' : 'text-gray-500'
            }`}
          >
            {active && <span className="absolute top-0 w-1 h-1 rounded-full bg-dore" />}
            <Icon size={20} strokeWidth={active ? 2.4 : 2} />
            <span className="text-[10px] font-bold">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
