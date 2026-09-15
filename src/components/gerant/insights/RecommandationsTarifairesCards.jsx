import React from 'react';

/**
 * Composant RecommandationsTarifairesCards
 * Créneaux disponibles pour lesquels l'IA recommande un prix différent du
 * prix actuel (voir Creneau.prix_recommande_ia côté backend).
 */
export default function RecommandationsTarifairesCards({ recommandations = [] }) {
  if (recommandations.length === 0) {
    return (
      <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-2xs">
        <h3 className="text-base font-black text-gray-900 mb-2">
          Recommandations tarifaires basées sur la demande
        </h3>
        <p className="text-sm text-gray-500">
          Aucune recommandation pour le moment : pas encore assez de créneaux passés pour estimer la demande.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-base font-black text-gray-900">
        Recommandations tarifaires basées sur la demande
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommandations.map((r) => (
          <div key={r.id} className="bg-white rounded-[12px] p-5 border border-gray-200/80 shadow-2xs space-y-3">
            <h4 className="text-sm font-black text-gray-900">{r.terrain}</h4>
            <p className="text-xs text-gray-500">
              Créneau : <span className="font-bold text-gray-700">{r.jour}, {r.creneau}</span>
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-gray-400 line-through">
                {r.prix_actuel.toLocaleString('fr-FR')} FCFA
              </span>
              <span className="text-lg font-black text-vert-principal">
                {r.prix_recommande.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
            <span className="inline-block bg-vert-clair/50 text-vert-principal text-[11px] font-bold px-2.5 py-1 rounded-full">
              Impact attendu : {r.impact_pct > 0 ? '+' : ''}{r.impact_pct}% revenus
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
