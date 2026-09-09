import React from 'react';

// Props du composant :
// - children : Le texte ou le contenu du bouton
// - variant : Le style visuel ('primary', 'secondary', 'destructive', 'ghost', 'disabled')
// - size : La taille du bouton ('sm', 'md', 'lg')
// - onClick : La fonction appelée au clic
// - fullWidth : Si true, le bouton prend toute la largeur
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  fullWidth = false,
  disabled = false,
  type = 'button'
}) {
  return (
    <button
      type={type}
      onClick={disabled || variant === 'disabled' ? undefined : onClick}
      disabled={disabled || variant === 'disabled'}
      className={`inline-flex items-center justify-center font-semibold rounded-md transition-colors cursor-pointer border ${
        fullWidth ? 'w-full' : 'w-auto'
      } ${
        size === 'sm' ? 'px-2 py-1 text-sm' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2 text-base'
      } ${
        disabled || variant === 'disabled'
          ? 'bg-gray-200 text-gray-400 border-transparent cursor-not-allowed'
          : variant === 'secondary'
          ? 'bg-white text-[#1b4332] border-[#1b4332] hover:bg-emerald-50'
          : variant === 'destructive'
          ? 'bg-red-100 text-red-700 border-transparent hover:bg-red-200'
          : variant === 'ghost'
          ? 'bg-transparent text-[#1b4332] border-transparent hover:bg-emerald-50'
          : 'bg-[#1b4332] text-white border-transparent hover:bg-[#2d6a4f]'
      }`}
    >
      {children}
    </button>
  );
}
