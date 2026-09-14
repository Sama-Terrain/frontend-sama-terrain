import React from 'react';
import { Bell, Menu } from 'lucide-react';

/**
 * Composant AdminHeader
 * Barre supérieure affichant le titre de la page et le profil du Super Admin.
 */
export default function AdminHeader({ title = 'Tableau de Bord Admin', profile, onMenuToggle }) {
  const adminName = profile?.name || 'Alioune Diop';
  const adminRole = profile?.role || 'Super Admin';
  const initials = profile?.initials || 'AD';

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-b border-[#e5e7eb] px-4 sm:px-10 py-4 sm:py-5 sticky top-0 z-30">
      
      {/* TITRE DE LA PAGE + MENU MOBILE */}
      <div className="flex items-center gap-3">
        {/* BOUTON MENU MOBILE */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-10 h-10 rounded-lg bg-vert-clair border border-gray-200 flex items-center justify-center text-vert-principal hover:bg-vert-survol hover:text-white transition-all cursor-pointer"
          title="Menu"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-xl sm:text-[24px] font-extrabold text-vert-principal tracking-tight">
          {title}
        </h1>
      </div>

      {/* NOTIFICATIONS & PROFILE */}
      <div className="flex items-center space-x-3 sm:space-x-6">
        
        {/* BOUTON CLOCHE NOTIFICATION */}
        <button
          className="w-10 h-10 rounded-full bg-[#ebf5f1] border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all cursor-pointer relative shadow-2xs"
          title="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
        </button>

        {/* PROFIL SUPER ADMIN */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-dore flex items-center justify-center font-black text-vert-principal text-xs shadow-xs border border-[#b8952b]">
            {initials}
          </div>

          <div className="text-left hidden sm:block">
            <span className="block text-sm font-extrabold text-gray-900 leading-tight">
              {adminName}
            </span>
            <span className="block text-[11px] font-medium text-gray-500">
              {adminRole}
            </span>
          </div>
        </div>

      </div>

    </header>
  );
}
