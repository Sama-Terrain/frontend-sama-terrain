import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Composant AdminKpiCard
 * Carte d'affichage d'un indicateur clé de performance (KPI).
 * Exemple: Utilisateurs (2 450, +12% cette semaine).
 *
 * trendDirection: 'up' (défaut, vert) ou 'down' (rouge) — permet d'afficher
 * une baisse (ex: taux d'occupation en recul) sans changer l'usage existant.
 */
export default function AdminKpiCard({ label, value, trend, trendDirection = 'up' }) {
  const isDown = trendDirection === 'down';
  const TrendIcon = isDown ? TrendingDown : TrendingUp;

  return (
    <div className="bg-white rounded-[12px] p-4 sm:p-5 border border-gray-200/80 shadow-2xs hover:shadow-xs transition-shadow text-left space-y-2">
      {/* LABEL DE L'INDICATEUR */}
      <span className="block text-[10px] sm:text-xs font-semibold text-gray-500 tracking-wide">
        {label}
      </span>

      {/* VALEUR DE L'INDICATEUR */}
      <div className="text-xl sm:text-2xl lg:text-3xl font-black text-vert-principal tracking-tight">
        {value}
      </div>

      {/* TENDANCE DE CROISSANCE */}
      <div className={`flex items-center space-x-1.5 text-[10px] sm:text-[11px] font-bold pt-0.5 ${isDown ? 'text-red-600' : 'text-emerald-600'}`}>
        <TrendIcon size={12} sm:size={14} className="shrink-0 stroke-[2.5]" />
        <span>{trend}</span>
      </div>
    </div>
  );
}
