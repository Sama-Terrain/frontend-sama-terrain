import React from 'react';

/**
 * Composant JourToggle
 * Pastille de sélection d'un jour de la semaine (L, M, M, J, V, S, D),
 * utilisée pour choisir les jours d'application d'une tarification.
 */
export default function JourToggle({ jour, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(jour)}
      title={jour}
      className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${
        selected
          ? 'bg-vert-principal text-white'
          : 'bg-white text-gray-400 border border-gray-300 hover:border-vert-principal'
      }`}
    >
      {jour.charAt(0)}
    </button>
  );
}
