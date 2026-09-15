import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, Calendar, QrCode } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Composant GerantHeader
 * Barre supérieure de l'espace gérant : titre de page, date du jour,
 * accès rapide au scanner de ticket, notifications et profil du gérant.
 */
export default function GerantHeader({ title = 'Tableau de bord', profile, onMenuToggle }) {
  const navigate = useNavigate();

  const gerantName = profile?.name || 'Amadou Diouf';
  const initials = profile?.initials || 'A';

  const todayLabel = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="flex items-center justify-between gap-3 bg-white border-b border-[#e5e7eb] px-3 sm:px-10 py-3 sm:py-5 sticky top-0 z-30">

      {/* TITRE DE LA PAGE + MENU MOBILE */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-vert-clair border border-gray-200 flex items-center justify-center text-vert-principal hover:bg-vert-survol hover:text-white transition-all cursor-pointer"
          title="Menu"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-lg sm:text-[24px] font-extrabold text-vert-principal tracking-tight truncate">
          {title}
        </h1>
      </div>

      {/* ACTIONS DE DROITE : date, scanner, cloche, profil */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">

        {/* BADGE DATE DU JOUR (desktop uniquement) */}
        <div className="hidden md:flex items-center gap-2 rounded-[8px] border border-[#e5e7eb] px-4 py-2.5 text-[13px] font-semibold text-gray-700">
          <Calendar size={16} className="text-gray-400" />
          <span>Aujourd'hui, {todayLabel}</span>
        </div>

        {/* BOUTON SCANNER TICKET */}
        <Button
          variant="gold"
          size="sm"
          rounded="8px"
          onClick={() => navigate('/gerant/scanner')}
          className="gap-2"
        >
          <QrCode size={16} className="shrink-0" />
          <span className="hidden sm:inline whitespace-nowrap">Scanner Ticket</span>
          <span className="sm:hidden whitespace-nowrap">Scanner</span>
        </Button>

        {/* BOUTON CLOCHE NOTIFICATION */}
        <button
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#ebf5f1] border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all cursor-pointer relative shadow-2xs shrink-0"
          title="Notifications"
        >
          <Bell size={18} className="sm:hidden" />
          <Bell size={20} className="hidden sm:block" />
          <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        {/* PROFIL GÉRANT */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-dore flex items-center justify-center font-black text-vert-principal text-xs shadow-xs border border-[#b8952b] shrink-0">
            {initials}
          </div>
          <span className="hidden sm:block text-sm font-extrabold text-gray-900 leading-tight">
            {gerantName}
          </span>
        </div>

      </div>

    </header>
  );
}
