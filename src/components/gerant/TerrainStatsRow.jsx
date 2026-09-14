import React from 'react';
import { CalendarCheck, Wallet, Star, PieChart } from 'lucide-react';
import RatingStars from '../ui/RatingStars';

// Coquille commune à chaque carte de statistique (label, valeur, icône à droite, contenu additionnel en bas)
function StatCardShell({ icon: Icon, label, value, suffix, children }) {
  return (
    <div className="bg-white rounded-[12px] p-4 sm:p-5 border border-gray-200/80 shadow-2xs text-left space-y-3">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold text-gray-500">{label}</span>
        <span className="w-8 h-8 rounded-[8px] bg-vert-clair text-vert-principal flex items-center justify-center shrink-0">
          <Icon size={16} />
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl sm:text-2xl font-black text-gray-900">{value}</span>
        {suffix && <span className="text-sm font-bold text-gray-400">{suffix}</span>}
      </div>
      {children}
    </div>
  );
}

/**
 * Composant TerrainStatsRow
 * Les 4 cartes de statistiques de la page détail d'un terrain :
 * réservations du mois, revenus du mois, note moyenne, taux d'occupation.
 */
export default function TerrainStatsRow({ stats }) {
  if (!stats) return null;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">

      <StatCardShell icon={CalendarCheck} label="Réservations ce mois" value={stats.reservationsMois}>
        <p className="text-[11px] font-bold text-emerald-600">↑ {stats.reservationsTrend}</p>
      </StatCardShell>

      <StatCardShell icon={Wallet} label="Revenus ce mois" value={stats.revenusMois}>
        <p className="text-[11px] text-gray-400">{stats.revenusSousTitre}</p>
      </StatCardShell>

      <StatCardShell icon={Star} label="Note moyenne" value={stats.noteMoyenne} suffix="/5">
        <RatingStars rating={stats.noteMoyenne} />
      </StatCardShell>

      <StatCardShell icon={PieChart} label="Taux d'occupation" value={`${stats.tauxOccupation}%`}>
        <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-vert-principal"
            style={{ width: `${stats.tauxOccupation}%` }}
          />
        </div>
      </StatCardShell>

    </section>
  );
}
