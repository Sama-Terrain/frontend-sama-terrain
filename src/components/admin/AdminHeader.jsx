import { Menu } from 'lucide-react';
import NotificationsCloche from '../layout/NotificationsCloche';

/**
 * Composant AdminHeader
 * Barre supérieure affichant le titre de la page et le profil du Super Admin.
 */
export default function AdminHeader({ title = 'Tableau de Bord Admin', profile, onMenuToggle }) {
  const adminName = profile?.name || 'Alioune Diop';
  const adminRole = profile?.role || 'Super Admin';
  const initials = profile?.initials || 'AD';

  return (
    <header className="flex flex-row items-center justify-between gap-2 sm:gap-4 bg-white border-b border-[#e5e7eb] px-4 sm:px-10 py-3 sm:py-5 sticky top-0 z-30">
      
      {/* TITRE DE LA PAGE + MENU MOBILE */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* BOUTON MENU MOBILE */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-vert-clair border border-gray-200 flex items-center justify-center text-vert-principal hover:bg-vert-survol hover:text-white transition-all cursor-pointer"
          title="Menu"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-base sm:text-[24px] font-extrabold text-vert-principal tracking-tight truncate">
          {title}
        </h1>
      </div>

      {/* NOTIFICATIONS & PROFILE */}
      <div className="flex items-center space-x-2 sm:space-x-6 shrink-0">
        
        {/* CLOCHE DE NOTIFICATIONS */}
        <NotificationsCloche />

        {/* PROFIL SUPER ADMIN */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-dore flex items-center justify-center font-black text-vert-principal text-xs shadow-xs border border-[#b8952b] shrink-0">
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
