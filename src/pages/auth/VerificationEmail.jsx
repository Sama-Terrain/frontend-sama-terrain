import { useState, useRef } from 'react';
import loginBg from '../../assets/terrain-login.png';

export default function VerificationEmail({ onNavigate, email = 'mariegodmer@gmail.com' }) {
  // Code à 5 chiffres (4 8 2 1 ...)
  const [code, setCode] = useState(['4', '8', '2', '1', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef()];

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto focus sur la case suivante
    if (value && index < 4) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setError('');

    const fullCode = code.join('');
    // On accepte 4821 ou tout code complet de 5 chiffres pour la démo
    if (fullCode.length >= 4) {
      setSuccess(true);
      setTimeout(() => {
        if (onNavigate) onNavigate('accueil');
      }, 1500);
    } else {
      setError('Veuillez entrer les 4 à 5 chiffres du code');
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans">
      {/* Colonne Gauche - Vérification E-mail */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-6 text-center">
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            VÉRIFIEZ VOTRE E-MAIL
          </h1>

          <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
            Nous avons envoyé un code de vérification à<br />
            <strong className="text-gray-900 font-bold">{email}</strong>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-[8px] p-3 text-xs text-red-600 font-semibold">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-[8px] p-3 text-xs text-emerald-700 font-bold">
              ✓ E-mail vérifié avec succès ! Redirection...
            </div>
          )}

          {/* Formulaire des 5 cases de code */}
          <form onSubmit={handleVerify} className="space-y-8">
            <div className="flex justify-center items-center space-x-2 sm:space-x-3 pt-2">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-extrabold text-gray-900 bg-white border border-gray-200 rounded-[8px] focus:outline-none focus:border-[#004030] focus:ring-1 focus:ring-[#004030] shadow-sm"
                />
              ))}
            </div>

            {/* Bouton VÉRIFIER */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#004030] hover:bg-[#005943] text-white font-bold rounded-[8px] text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              VÉRIFIER
            </button>
          </form>

          {/* Section Renvoyer le code */}
          <div className="space-y-2 pt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-[11px] text-gray-400">
                Vous n'avez rien reçu ?
              </span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <button
              type="button"
              onClick={() => alert('Un nouveau code vous a été envoyé (4821).')}
              className="text-xs font-extrabold text-gray-900 hover:underline cursor-pointer"
            >
              Renvoyer le code
            </button>
          </div>

          {/* Lien retour connexion */}
          <div className="pt-6">
            <button
              onClick={() => onNavigate && onNavigate('login')}
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Retourner à la <span className="font-bold text-gray-900">page de connexion</span>
            </button>
          </div>

        </div>
      </div>

      {/* Colonne Droite - Image Figma */}
      <div className="hidden lg:block lg:w-1/2 bg-gray-200 relative overflow-hidden">
        <img
          src={loginBg}
          alt="Sama-Terrain Auth"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
