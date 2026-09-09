import React from 'react';

// Props du composant :
// - label : Le texte affiché au-dessus du champ
// - placeholder : Le texte indicatif quand le champ est vide
// - type : Le type d'entrée ('text', 'password', 'email', etc.)
// - value : La valeur saisie
// - onChange : La fonction appelée quand l'utilisateur tape
// - errorMessage : Le message d'erreur à afficher sous le champ
// - state : L'état du champ ('default', 'focus', 'error', 'disabled')
export default function Input({
  label,
  placeholder = '',
  type = 'text',
  value,
  onChange,
  errorMessage = '',
  state = 'default'
}) {
  const estDesactive = state === 'disabled';
  const aErreur = state === 'error' || Boolean(errorMessage);

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium text-gray-800">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={estDesactive}
        className={`w-full px-4 py-2 text-base rounded-md border outline-none transition-colors ${
          estDesactive
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            : aErreur
            ? 'bg-white text-gray-900 border-red-500 focus:border-red-500'
            : state === 'focus'
            ? 'bg-white text-gray-900 border-[#1b4332]'
            : 'bg-white text-gray-900 border-gray-300 focus:border-[#1b4332]'
        }`}
      />
      {aErreur && errorMessage && <span className="text-sm text-red-600">{errorMessage}</span>}
    </div>
  );
}
