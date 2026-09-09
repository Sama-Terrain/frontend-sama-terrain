import React from 'react';

// Props du composant :
// - statut : L'état à afficher ('disponible', 'reserve', 'complet', 'en_attente', 'forte_demande')
// - children : Texte personnalisé optionnel
export default function Badge({ statut = 'disponible', children }) {
  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
        statut === 'reserve'
          ? 'bg-orange-100 text-orange-700'
          : statut === 'complet'
          ? 'bg-red-100 text-red-700'
          : statut === 'en_attente'
          ? 'bg-gray-100 text-gray-700'
          : statut === 'forte_demande'
          ? 'bg-emerald-100 text-emerald-900'
          : 'bg-emerald-100 text-emerald-700'
      }`}
    >
      {children || (
        statut === 'reserve'
          ? 'Réservé'
          : statut === 'complet'
          ? 'Complet'
          : statut === 'en_attente'
          ? 'En attente'
          : statut === 'forte_demande'
          ? 'Forte demande'
          : 'Disponible'
      )}
    </span>
  );
}
