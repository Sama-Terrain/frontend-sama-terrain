import React from 'react';

// Props du composant :
// - children : Le contenu à afficher à l'intérieur de la carte
// - padding : L'espacement interne ('sm', 'md', 'lg')
export default function Card({ children, padding = 'md' }) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-md w-full ${
        padding === 'sm' ? 'p-2' : padding === 'lg' ? 'p-6' : 'p-4'
      }`}
    >
      {children}
    </div>
  );
}
