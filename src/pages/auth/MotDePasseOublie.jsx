import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import RetourAccueilButton from '../../components/auth/RetourAccueilButton';
import loginBg from '../../assets/terrain-login.png';
import { authService } from '../../services/authService';

/**
 * Page "Mot de passe oublié" (accessible aux amateurs et gérants).
 *
 * Étape 1 : l'utilisateur saisit son email, reçoit un code à 6 chiffres.
 * Étape 2 : il saisit ce code + son nouveau mot de passe.
 */
export default function MotDePasseOublie() {
  const navigate = useNavigate();
  const [etape, setEtape] = useState(1);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('');

  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState(false);

  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const handleChangeCode = (index, value) => {
    value = value.replace(/\D/g, '');
    if (value.length > 1) value = value[value.length - 1];

    const nouveauCode = [...code];
    nouveauCode[index] = value;
    setCode(nouveauCode);

    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDownCode = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleDemanderCode = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    const resultat = await authService.demanderReinitialisationMotDePasse(email);
    setChargement(false);

    if (!resultat.success) {
      setErreur(resultat.error);
      return;
    }

    setEtape(2);
  };

  const handleReinitialiser = async (e) => {
    e.preventDefault();
    setErreur('');

    const codeComplet = code.join('');
    if (codeComplet.length < 6) {
      setErreur('Veuillez entrer les 6 chiffres du code.');
      return;
    }

    if (nouveauMotDePasse !== confirmationMotDePasse) {
      setErreur('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setChargement(true);
    const resultat = await authService.reinitialiserMotDePasse(email, codeComplet, nouveauMotDePasse);
    setChargement(false);

    if (!resultat.success) {
      setErreur(resultat.error);
      return;
    }

    setSucces(true);
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <div className="min-h-screen bg-white flex font-sans relative">
      <RetourAccueilButton />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-6 text-center">

          <h1 className="text-2xl sm:text-3xl font-extrabold text-vert-principal tracking-tight">
            MOT DE PASSE OUBLIÉ
          </h1>

          <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
            {etape === 1
              ? 'Entrez votre email, nous vous enverrons un code de réinitialisation.'
              : (
                <>
                  Un code a été envoyé à<br />
                  <strong className="text-gray-900 font-bold">{email}</strong>
                </>
              )}
          </p>

          {erreur && <Alert type="error" message={erreur} />}
          {succes && <Alert type="success" message="Mot de passe réinitialisé avec succès ! Redirection..." />}

          {etape === 1 ? (
            <form onSubmit={handleDemanderCode} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-800">Email</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="prenom.nom@exemple.com"
                  className="text-xs font-semibold"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                rounded="8px"
                fullWidth
                disabled={chargement}
                className="mt-4 shadow-xs"
              >
                {chargement ? 'Envoi...' : 'Envoyer le code'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleReinitialiser} className="space-y-6">
              <div className="flex justify-center items-center space-x-2 sm:space-x-3 pt-2">
                {code.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={inputRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChangeCode(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDownCode(idx, e)}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-extrabold text-gray-900 bg-white border border-gray-200 rounded-[8px] focus:outline-none focus:border-vert-principal focus:ring-1 focus:ring-vert-principal shadow-sm"
                  />
                ))}
              </div>

              <div className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-800">Nouveau mot de passe</label>
                  <Input
                    type="password"
                    required
                    value={nouveauMotDePasse}
                    onChange={(e) => setNouveauMotDePasse(e.target.value)}
                    placeholder="........"
                    className="text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-800">Confirmer le nouveau mot de passe</label>
                  <Input
                    type="password"
                    required
                    value={confirmationMotDePasse}
                    onChange={(e) => setConfirmationMotDePasse(e.target.value)}
                    placeholder="........"
                    className="text-xs font-semibold"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                rounded="8px"
                fullWidth
                disabled={chargement}
                className="uppercase tracking-wider"
              >
                {chargement ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </Button>

              <button
                type="button"
                onClick={() => authService.demanderReinitialisationMotDePasse(email)}
                className="text-xs font-extrabold text-gray-900 hover:underline cursor-pointer"
              >
                Renvoyer le code
              </button>
            </form>
          )}

          <p className="text-center text-xs text-gray-500 pt-4">
            Vous vous souvenez de votre mot de passe ?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-[#D4AF37] font-bold hover:underline cursor-pointer"
            >
              Se connecter
            </button>
          </p>

        </div>
      </div>

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
