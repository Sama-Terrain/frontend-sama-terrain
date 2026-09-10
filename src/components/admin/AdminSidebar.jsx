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
} from 'lucide-react';
import logoSamaClair from '../../assets/sama-logo-clair.png';

/**
 * Composant AdminSidebar
 * Barre de navigation latérale fixe (h-screen, sticky) de l'administration.
 * Gère la navigation et la déconnexion de la session admin.
 */
export default function AdminSidebar({ onLogout }) {
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
    <aside className="w-64 bg-[#004030] text-white flex flex-col justify-between h-screen sticky top-0 left-0 p-6 shrink-0 shadow-lg select-none overflow-y-auto z-40">
      <div className="space-y-8">
        
        {/* LOGO OFFICIEL SAMA-TERRAIN */}
        <div
          className="flex items-center space-x-3 cursor-pointer pt-2"
          onClick={() => navigate('/admin/dashboard')}
        >
          <img
            src={logoSamaClair}
            alt="Sama-Terrain Logo"
            className="h-24 w-80 object-contain cursor-pointer" 
          />
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
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#D4AF37] text-gray-900 shadow-md font-black'
                    : 'text-gray-200 hover:bg-[#005943] hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-gray-900' : 'text-gray-300'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

      </div>

      {/* BOUTON DÉCONNEXION EN BAS */}
      <div className="pt-6 border-t border-[#005943]">
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-red-900/30 rounded-xl transition-all cursor-pointer text-xs sm:text-sm font-semibold"
          title="Se déconnecter"
        >
          <LogOut size={18} className="text-gray-300" />
          <span>Déconnexion</span>
        </button>
      </div>

    </aside>
  );
}
