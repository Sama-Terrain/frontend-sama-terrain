import React from 'react';
import { Bell } from 'lucide-react';

/**
 * Composant AdminHeader
 * Barre supérieure affichant le titre de la page et le profil du Super Admin.
 */
export default function AdminHeader({ title = 'Tableau de Bord Admin', profile }) {
  const adminName = profile?.name || 'Alioune Diop';
  const adminRole = profile?.role || 'Super Admin';
  const initials = profile?.initials || 'AD';

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-xs px-8 py-6 border-b border-gray-200/60 sticky top-0 z-30">
      
      {/* TITRE DE LA PAGE */}
      <h1 className="text-2xl sm:text-2xl font-extrabold text-[#004030] tracking-tight">
        {title}
      </h1>

      {/* NOTIFICATIONS & PROFILE */}
      <div className="flex items-center space-x-5">
        
        {/* BOUTON CLOCHE NOTIFICATION */}
        <button
          className="w-10 h-10 rounded-full bg-[#EBF5F1] border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all cursor-pointer relative shadow-2xs"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
        </button>

        {/* PROFIL SUPER ADMIN */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center font-black text-[#004030] text-xs shadow-xs border border-[#b8952b]">
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
