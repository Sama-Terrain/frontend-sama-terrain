import React from 'react';
import { Star } from 'lucide-react';
import RatingStars from '../ui/RatingStars';

/**
 * Composant AvisRecentsList
 * Liste des avis récents laissés sur un terrain (lecture seule, la modération
 * se fait depuis l'espace admin).
 */
export default function AvisRecentsList({ avis = [] }) {
  return (
    <div className="bg-white rounded-[12px] border border-gray-200/80 shadow-2xs">

      <div className="flex items-center gap-2.5 p-6 sm:p-8 pb-4">
        <span className="w-7 h-7 rounded-full bg-vert-clair text-vert-principal flex items-center justify-center shrink-0">
          <Star size={15} />
        </span>
        <h3 className="text-base font-black text-gray-900">Avis récents</h3>
      </div>

      <div className="divide-y divide-gray-100 px-6 sm:px-8 pb-2">
        {avis.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500 font-semibold">
            Aucun avis pour ce terrain
          </p>
        ) : (
          avis.map((item) => (
            <div key={item.id} className="py-5 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-vert-principal text-dore flex items-center justify-center text-xs font-bold shrink-0">
                    {item.initiales}
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-gray-900">{item.nom}</p>
                    <RatingStars rating={item.rating} size={12} />
                  </div>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{item.date}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed pl-12">{item.commentaire}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
