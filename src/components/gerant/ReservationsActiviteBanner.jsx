import React from 'react';
import { Info } from 'lucide-react';

/**
 * Composant ReservationsActiviteBanner
 * Bandeau de synthèse en haut de la page "Réservations" : volume du mois et taux de validation.
 */
export default function ReservationsActiviteBanner({ totalMois, tauxValidation }) {
  return (
    <div className="w-full bg-vert-principal rounded-[12px] px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3">
        <Info size={18} className="text-white shrink-0" />
        <p className="text-white text-sm font-bold">
          Activité ce mois : {totalMois} réservations enregistrées
        </p>
      </div>
      <p className="text-white text-sm">
        Taux de validation : <span className="font-extrabold text-dore">{tauxValidation}%</span>
      </p>
    </div>
  );
}
