import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileCheck,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import logoSamaClair from '../../assets/sama-logo-clair.png';

/**
 * Composant AdminSidebar
 * Barre de navigation latérale fixe (h-screen, sticky) de l'administration.
 * Gère la navigation et la déconnexion de la session admin.
 */
export default function AdminSidebar({ onLogout, onMobileClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Liste des items de navigation
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'utilisateurs',
      label: 'Utilisateurs',
      path: '/admin/utilisateurs',
      icon: Users,
    },
    {
      id: 'validation-gerants',
      label: 'Validation gérants',
      path: '/admin/validation-gerants',
      icon: FileCheck,
    },
    {
      id: 'moderation-avis',
      label: 'Modération avis',
      path: '/admin/moderation-avis',
      icon: MessageSquare,
    },
    {
      id: 'statistiques',
      label: 'Statistiques',
      path: '/admin/statistiques',
      icon: BarChart3,
    },
    {
      id: 'parametres',
      label: 'Paramètres',
      path: '/admin/parametres',
      icon: Settings,
    },
  ];

  // Gestion de la déconnexion
  const handleLogoutClick = () => {
    // 1. Supprimer l'utilisateur connecté du stockage local
    localStorage.removeItem('sama_current_user');
    
    // 2. Déclencher le callback parent si présent
    if (onLogout) {
      onLogout();
    }
    
    // 3. Rediriger immédiatement vers la page de connexion
    navigate('/login', { replace: true });
  };

  return (
    <aside className="w-[280px] bg-vert-principal text-white flex flex-col justify-between h-screen p-6 shrink-0 shadow-lg select-none overflow-y-auto">
      <div className="space-y-8">
        
        {/* HEADER: LOGO + BOUTON FERMER (MOBILE) */}
        <div className="flex items-center justify-between pt-2">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => {
              navigate('/admin/dashboard');
              if (onMobileClose) onMobileClose();
            }}
          >
            <img
              src={logoSamaClair}
              alt="Sama-Terrain Logo"
              className="h-[54px] w-[169px] object-contain cursor-pointer" 
            />
          </div>
          
          {/* BOUTON FERMER MOBILE */}
          <button
            onClick={onMobileClose}
            className="lg:hidden w-8 h-8 rounded-lg bg-vert-survol hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* MENU DE NAVIGATION */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === '/admin/dashboard' && (location.pathname === '/admin' || location.pathname === '/admin/'));

            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  if (onMobileClose) onMobileClose();
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-[8px] font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-dore text-gray-900 shadow-md font-black'
                    : 'text-gray-200 hover:bg-vert-survol hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-gray-900' : 'text-gray-300'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

      </div>

      {/* BOUTON DÉCONNEXION EN BAS */}
      <div className="pt-6 border-t border-white/13">
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-red-900/30 rounded-[8px] transition-all cursor-pointer text-xs sm:text-sm font-semibold"
          title="Se déconnecter"
        >
          <LogOut size={20} className="text-gray-300" />
          <span>Déconnexion</span>
        </button>
      </div>

    </aside>
  );
}
