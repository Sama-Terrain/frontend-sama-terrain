import { useEffect, useRef } from 'react';

const LONGUEUR_CODE = 6;

/**
 * Composant SaisieCode
 * Les 6 cases du code reçu par email, comme dans la plupart des applications :
 * - on peut coller le code entier (Ctrl+V) : il se répartit dans les cases ;
 * - le curseur passe tout seul à la case suivante, Retour arrière revient en arrière ;
 * - onComplete(code) est appelé dès que les 6 chiffres sont saisis.
 *
 * `chiffres` est un tableau de 6 caractères (contrôlé par le parent).
 */
export default function SaisieCode({ chiffres, onChange, onComplete, disabled = false, enErreur = false }) {
  const cases = useRef([]);

  // Curseur dans la première case à l'affichage, et quand le parent vide les
  // cases (après un code faux ou l'envoi d'un nouveau code).
  const toutVide = chiffres.every((c) => !c);
  useEffect(() => {
    if (toutVide) cases.current[0]?.focus();
  }, [toutVide]);

  const appliquer = (nouveaux) => {
    onChange(nouveaux);
    if (nouveaux.every(Boolean)) onComplete?.(nouveaux.join(''));
  };

  const handleChange = (index, valeur) => {
    const chiffresSaisis = valeur.replace(/\D/g, '');
    if (!chiffresSaisis) return;

    // Saisie normale (1 chiffre) ou remplissage automatique du téléphone (plusieurs).
    const nouveaux = [...chiffres];
    chiffresSaisis.split('').slice(0, LONGUEUR_CODE - index).forEach((chiffre, decalage) => {
      nouveaux[index + decalage] = chiffre;
    });
    appliquer(nouveaux);
    cases.current[Math.min(index + chiffresSaisis.length, LONGUEUR_CODE - 1)]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const nouveaux = [...chiffres];
      if (nouveaux[index]) {
        nouveaux[index] = '';
      } else if (index > 0) {
        nouveaux[index - 1] = '';
        cases.current[index - 1]?.focus();
      }
      onChange(nouveaux);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      cases.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < LONGUEUR_CODE - 1) {
      cases.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const colle = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LONGUEUR_CODE);
    if (!colle) return;
    e.preventDefault();
    const nouveaux = Array.from({ length: LONGUEUR_CODE }, (_, i) => colle[i] || '');
    appliquer(nouveaux);
    cases.current[Math.min(colle.length, LONGUEUR_CODE - 1)]?.focus();
  };

  return (
    <div className="flex justify-center items-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {chiffres.map((chiffre, index) => (
        <input
          key={index}
          ref={(el) => { cases.current[index] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={LONGUEUR_CODE}
          value={chiffre}
          disabled={disabled}
          aria-label={`Chiffre ${index + 1} du code`}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={(e) => e.target.select()}
          className={`w-11 h-14 sm:w-14 sm:h-16 text-center text-xl font-extrabold text-gray-900 bg-white border rounded-[8px] focus:outline-none focus:ring-1 shadow-sm disabled:opacity-60 ${
            enErreur
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-200 focus:border-vert-principal focus:ring-vert-principal'
          }`}
        />
      ))}
    </div>
  );
}
