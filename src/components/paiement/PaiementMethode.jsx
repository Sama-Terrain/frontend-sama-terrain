import React from 'react';

// Les deux moyens de paiement mobile agrégés par PayDunya
const MOYENS = [
  { id: 'Wave', description: 'Paiement instantané via l\'application Wave' },
  { id: 'Orange Money', description: 'Paiement instantané via Orange Money' },
];

// Props du composant :
// - value : le moyen de paiement actuellement sélectionné ('Wave' | 'Orange Money')
// - onChange : fonction appelée avec le nouveau moyen choisi
export default function PaiementMethode({ value, onChange }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-gray-900">Choisissez votre moyen de paiement</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MOYENS.map((methode) => {
          const selectionne = value === methode.id;
          return (
            <button
              key={methode.id}
              type="button"
              onClick={() => onChange(methode.id)}
              className={`p-4 rounded-[8px] border text-left transition-colors cursor-pointer ${
                selectionne
                  ? 'border-vert-principal bg-vert-clair/40'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <p className="text-sm font-extrabold text-gray-900">{methode.id}</p>
              <p className="text-xs text-gray-500 mt-0.5">{methode.description}</p>
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-gray-400">
        Paiement sécurisé traité par PayDunya.
      </p>
    </div>
  );
}
