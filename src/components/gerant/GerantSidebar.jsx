import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Calendar,
  ClipboardCheck,
  DollarSign,
  QrCode,
  BarChart3,
  Sparkles,
  LogOut,
  X,
} from 'lucide-react';
import logoSamaClair from '../../assets/sama-logo-clair.png';

/**
 * Composant GerantSidebar
 * Barre de navigation latérale fixe (h-screen, sticky) de l'espace gérant.
 * Suit la même structure que AdminSidebar (couleurs, comportement mobile, déconnexion).
 */
export default function GerantSidebar({ onLogout, onMobileClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', path: '/gerant/dashboard', icon: LayoutDashboard },
    { id: 'terrains', label: 'Mes terrains', path: '/gerant/terrains', icon: Layers },
    { id: 'creneaux', label: 'Créneaux & tarifs', path: '/gerant/creneaux', icon: Calendar },
    { id: 'reservations', label: 'Réservations', path: '/gerant/reservations', icon: ClipboardCheck },
    { id: 'revenus', label: 'Revenus', path: '/gerant/revenus', icon: DollarSign },
    { id: 'scanner', label: 'Scanner Ticket', path: '/gerant/scanner', icon: QrCode },
    { id: 'statistiques', label: 'Statistiques', path: '/gerant/statistiques', icon: BarChart3 },
    { id: 'insights', label: 'Insights IA', path: '/gerant/insights', icon: Sparkles },
  ];

  const handleLogoutClick = () => {
    localStorage.removeItem('sama_current_user');
    if (onLogout) onLogout();
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
              navigate('/gerant/dashboard');
              if (onMobileClose) onMobileClose();
            }}
          >
            <img
              src={logoSamaClair}
              alt="Sama-Terrain Logo"
              className="h-[54px] w-[169px] object-contain cursor-pointer"
            />
          </div>

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
            const isActive = location.pathname === item.path;

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
