import { Delete } from 'lucide-react';

const TOUCHES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

/**
 * Composant ClavierMontant
 * Gros clavier numérique pour saisir un montant en FCFA, sans
 * clavier système ni petit champ à viser — une seule chose à faire : taper
 * les chiffres du montant reçu.
 */
export default function ClavierMontant({ valeur, onChange }) {
  const appuyerTouche = (touche) => {
    if (touche === '') return;
    if (touche === '⌫') {
      onChange(valeur.slice(0, -1));
      return;
    }
    // 7 chiffres max (jusqu'à 9 999 999 FCFA) : largement suffisant.
    if (valeur.replace(/^0+/, '').length >= 7) return;
    onChange((valeur === '0' ? '' : valeur) + touche);
  };

  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-xs mx-auto">
      {TOUCHES.map((touche, index) => (
        <button
          key={index}
          type="button"
          disabled={touche === ''}
          onClick={() => appuyerTouche(touche)}
          className={`h-16 rounded-2xl text-2xl font-black flex items-center justify-center transition-colors ${
            touche === ''
              ? 'invisible'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 cursor-pointer'
          }`}
        >
          {touche === '⌫' ? <Delete size={24} /> : touche}
        </button>
      ))}
    </div>
  );
}
