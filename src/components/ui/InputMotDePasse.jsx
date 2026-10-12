import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from './Input';

/**
 * Composant InputMotDePasse
 * Champ mot de passe avec un bouton "œil" pour afficher / masquer ce qu'on
 * est en train de saisir (même rendu que sur la page de connexion).
 * Accepte les mêmes props que Input (value, onChange, placeholder...).
 * Le label et le message d'erreur sont à afficher autour, pour que l'œil
 * reste bien centré verticalement sur le champ.
 */
export default function InputMotDePasse({ className = '', ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input {...props} type={visible ? 'text' : 'password'} className={`${className} pr-10`} />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
