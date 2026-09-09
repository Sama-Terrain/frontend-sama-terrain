import React from 'react';

// Props du composant :
// - size : La taille ('sm', 'md', 'lg')
export default function Spinner({ size = 'md' }) {
  return (
    <span
      className={`inline-block rounded-full border-gray-300 border-t-[#1b4332] animate-spin ${
        size === 'sm' ? 'w-4 h-4 border-2' : size === 'lg' ? 'w-10 h-10 border-3' : 'w-6 h-6 border-2'
      }`}
      role="status"
      aria-label="Chargement en cours"
    />
  );
}
