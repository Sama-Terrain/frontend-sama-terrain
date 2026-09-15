import React from 'react';
import { Bell, TrendingUp, Users } from 'lucide-react';

const ICONES_PAR_TYPE = {
  opportunite: TrendingUp,
  fidelisation: Users,
};

const LABELS_PAR_TYPE = {
  opportunite: 'Opportunité',
  fidelisation: 'Fidélisation',
};

/**
 * Composant AlertesIA
 * Alertes concrètes dérivées des vraies données (créneau sous-tarifé,
 * clients réguliers inactifs...). "Appliquer" n'est actif que pour les
 * alertes liées à un créneau précis (applique le prix recommandé par l'IA).
 */
export default function AlertesIA({ alertes = [], onAppliquer, onIgnorer, applicationEnCours }) {
  if (alertes.length === 0) {
    return (
      <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-2xs">
        <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
          <Bell size={18} className="text-dore" /> Alertes et opportunités immédiates
        </h3>
        <p className="text-sm text-gray-500 mt-2">Aucune alerte pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-2xs space-y-4">
      <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
        <Bell size={18} className="text-dore" /> Alertes et opportunités immédiates
      </h3>

      <ul className="divide-y divide-gray-100">
        {alertes.map((alerte, index) => {
          const Icone = ICONES_PAR_TYPE[alerte.type] || Bell;
          return (
            <li key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 py-4">
              <div className="w-10 h-10 rounded-full bg-vert-principal text-white flex items-center justify-center shrink-0">
                <Icone size={18} />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-bold text-gray-900">{alerte.titre}</h4>
                  <span className="text-[11px] font-bold text-emerald-700 bg-vert-clair/50 px-2 py-0.5 rounded-full">
                    {LABELS_PAR_TYPE[alerte.type] || alerte.type}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{alerte.message}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {alerte.creneau_id && (
                  <button
                    type="button"
                    disabled={applicationEnCours === alerte.creneau_id}
                    onClick={() => onAppliquer(alerte.creneau_id)}
                    className="text-xs font-bold bg-vert-principal text-white px-3 py-2 rounded-[8px] hover:bg-vert-survol transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {applicationEnCours === alerte.creneau_id ? 'Application...' : 'Appliquer'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onIgnorer(index)}
                  className="text-xs font-bold text-gray-500 border border-gray-200 px-3 py-2 rounded-[8px] hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Ignorer
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
