import React, { useEffect } from 'react';

// Props du composant :
// - isOpen : Vrai si la modale est ouverte, faux sinon
// - onClose : Fonction appelée pour fermer la modale
// - title : Le titre de la fenêtre modale
// - children : Le contenu à l'intérieur de la modale
export default function Modal({ isOpen, onClose, title, children }) {
  // Empêche le défilement de la page quand la modale est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          <button
            className="bg-transparent border-0 text-2xl cursor-pointer text-gray-500 hover:text-gray-700 leading-none"
            onClick={onClose}
            aria-label="Fermer la fenêtre modale"
          >
            &times;
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
