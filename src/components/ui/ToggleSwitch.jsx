import React from 'react';

// Props du composant :
// - checked : état actuel du switch (true = actif)
// - onChange : fonction appelée au changement d'état
// - label : texte affiché à droite du switch
export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange && onChange(!checked)}
      className="inline-flex items-center gap-2 cursor-pointer select-none"
    >
      <span
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          checked ? 'bg-emerald-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </span>
      {label && (
        <span className={`text-xs font-semibold ${checked ? 'text-emerald-700' : 'text-gray-500'}`}>
          {label}
        </span>
      )}
    </button>
  );
}
