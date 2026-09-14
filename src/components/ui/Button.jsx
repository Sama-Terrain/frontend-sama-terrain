import React from 'react';

// Props du composant :
// - children : Le texte ou le contenu du bouton
// - variant : Le style visuel ('primary', 'secondary', 'destructive', 'ghost', 'disabled', 'gold', 'outline')
// - size : La taille du bouton ('sm', 'md', 'lg')
// - rounded : L'arrondi du bouton ('8px', 'xl', 'lg')
// - onClick : La fonction appelée au clic
// - fullWidth : Si true, le bouton prend toute la largeur
// - className : Classes CSS additionnelles pour surcharger
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  rounded = '8px',
  onClick,
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = ''
}) {
  return (
    <button
      type={type}
      onClick={disabled || variant === 'disabled' ? undefined : onClick}
      disabled={disabled || variant === 'disabled'}
      className={`inline-flex items-center justify-center font-bold transition-colors cursor-pointer border ${
        fullWidth ? 'w-full' : 'w-auto'
      } ${
        size === 'sm' ? 'px-4 py-2 text-xs' : size === 'lg' ? 'px-6 py-4 text-base' : 'px-5 py-2.5 text-sm'
      } rounded-${rounded} ${
        disabled || variant === 'disabled'
          ? 'bg-gray-200 text-gray-400 border-transparent cursor-not-allowed'
          : variant === 'secondary'
          ? 'bg-vert-clair hover:bg-vert-principal text-vert-principal hover:text-white border-transparent'
          : variant === 'outline'
          ? 'bg-white text-vert-principal border-vert-principal hover:bg-emerald-50'
          : variant === 'destructive'
          ? 'bg-red-100 text-red-700 border-transparent hover:bg-red-200'
          : variant === 'ghost'
          ? 'bg-transparent text-vert-principal border-transparent hover:bg-emerald-50'
          : variant === 'gold'
          ? 'bg-dore hover:bg-dore-survol text-gray-900 border-transparent'
          : 'bg-vert-principal text-white border-transparent hover:bg-vert-survol'
      } ${className}`}
    >
      {children}
    </button>
  );
}
