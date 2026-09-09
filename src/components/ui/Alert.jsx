import React from 'react';

// Props du composant :
// - type : Le type d'alerte ('success', 'error', 'warning', 'info')
// - message : Le texte du message à afficher
// - onClose : La fonction optionnelle pour fermer l'alerte
export default function Alert({ type = 'info', message, onClose }) {
  return (
    <div
      className={`p-4 rounded-md border flex items-center justify-between gap-4 text-sm font-medium w-full ${
        type === 'success'
          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
          : type === 'error'
          ? 'bg-red-50 text-red-800 border-red-300'
          : type === 'warning'
          ? 'bg-orange-50 text-orange-800 border-orange-300'
          : 'bg-emerald-100 text-emerald-900 border-emerald-300'
      }`}
    >
      <span>{message}</span>
      {onClose && (
        <button
          className="bg-transparent border-0 text-inherit text-xl cursor-pointer leading-none px-1"
          onClick={onClose}
          aria-label="Fermer l'alerte"
        >
          &times;
        </button>
      )}
    </div>
  );
}
