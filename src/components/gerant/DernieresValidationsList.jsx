import React from 'react';

/**
 * Composant DernieresValidationsList
 * Historique des derniers tickets scannés par le gérant (validés, expirés
 * ou déjà utilisés).
 */
export default function DernieresValidationsList({ validations = [] }) {
  return (
    <div className="bg-white rounded-[12px] border border-gray-200/80 shadow-2xs p-6 space-y-4">
      <h3 className="text-base font-black text-gray-900">Dernières validations</h3>

      <div className="divide-y divide-gray-100">
        {validations.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500 font-semibold">
            Aucune validation pour le moment
          </p>
        ) : (
          validations.map((item) => (
            <div key={item.id} className="py-3.5 flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{item.nom}</p>
                <p className="text-xs text-gray-500 truncate">{item.sousTitre}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold whitespace-nowrap ${item.statutBadgeClass}`}
              >
                {item.statut}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
