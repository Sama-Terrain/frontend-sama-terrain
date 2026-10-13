import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import InputMotDePasse from '../../components/ui/InputMotDePasse';
import Alert from '../../components/ui/Alert';
import RetourAccueilButton from '../../components/auth/RetourAccueilButton';
import SaisieCode from '../../components/auth/SaisieCode';
import loginBg from '../../assets/terrain-login.png';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { getHomeRouteForRole } from '../../utils/roles';
import { validerEmail, validerMotDePasse, validerConfirmationMotDePasse } from '../../utils/validation';

const CODE_VIDE = ['', '', '', '', '', ''];
// Délai avant de pouvoir redemander un code (évite d'en envoyer des dizaines).
const DELAI_RENVOI_SECONDES = 60;

const TITRES_ETAPES = {
  1: 'Entrez votre email, nous vous enverrons un code de réinitialisation.',
  2: null, // texte avec l'email, voir plus bas
  3: 'Code vérifié. Choisissez votre nouveau mot de passe.',
};

/**
 * Page "Mot de passe oublié" (amateurs, gérants, employés), en 3 étapes
 * comme dans la plupart des applications :
 *
 * 1. Email (pré-rempli avec celui déjà tapé sur la page de connexion)
 *    -> "Envoyer le code".
 * 2. Code à 6 chiffres reçu par email : vérifié automatiquement dès le 6e
 *    chiffre (on peut coller le code). Renvoi possible après 60 secondes.
 * 3. Nouveau mot de passe -> l'utilisateur est connecté directement et
 *    arrive dans son espace.
 */
export default function MotDePasseOublie() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [etape, setEtape] = useState(1);
  const [email, setEmail] = useState(() => location.state?.email || '');
  const [code, setCode] = useState(CODE_VIDE);
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('');

  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [info, setInfo] = useState('');
  const [secondesAvantRenvoi, setSecondesAvantRenvoi] = useState(0);

  // Compte à rebours avant de pouvoir renvoyer un code.
  useEffect(() => {
    if (secondesAvantRenvoi <= 0) return undefined;
    const minuteur = setTimeout(() => setSecondesAvantRenvoi((s) => s - 1), 1000);
    return () => clearTimeout(minuteur);
  }, [secondesAvantRenvoi]);

  // --- Étape 1 : envoi du code
  const envoyerCode = async () => {
    setErreur('');
    setInfo('');
    setChargement(true);
    const resultat = await authService.demanderReinitialisationMotDePasse(email.trim());
    setChargement(false);

    if (!resultat.success) {
      setErreur(resultat.error);
      return false;
    }
    setCode(CODE_VIDE);
    setSecondesAvantRenvoi(DELAI_RENVOI_SECONDES);
    return true;
  };

  const handleDemanderCode = async (e) => {
    e.preventDefault();
    const erreurEmail = validerEmail(email);
    if (erreurEmail) {
      setErreur(erreurEmail);
      return;
    }
    if (await envoyerCode()) setEtape(2);
  };

  const handleRenvoyerCode = async () => {
    if (await envoyerCode()) setInfo('Un nouveau code vous a été envoyé.');
  };

  // --- Étape 2 : vérification du code (automatique au 6e chiffre)
  const handleVerifierCode = async (codeComplet) => {
    if (chargement) return;
    setErreur('');
    setInfo('');
    setChargement(true);
    const resultat = await authService.verifierCodeReinitialisation(email.trim(), codeComplet);
    setChargement(false);

    if (!resultat.success) {
      setErreur(resultat.error);
      setCode(CODE_VIDE);
      return;
    }
    setEtape(3);
  };

  // --- Étape 3 : nouveau mot de passe, puis connexion automatique
  const handleReinitialiser = async (e) => {
    e.preventDefault();
    setErreur('');

    const erreurMotDePasse = validerMotDePasse(nouveauMotDePasse)
      || validerConfirmationMotDePasse(nouveauMotDePasse, confirmationMotDePasse);
    if (erreurMotDePasse) {
      setErreur(erreurMotDePasse);
      return;
    }

    setChargement(true);
    const resultat = await authService.reinitialiserMotDePasse(email.trim(), code.join(''), nouveauMotDePasse);
    setChargement(false);

    if (!resultat.success) {
      setErreur(resultat.error);
      return;
    }

    if (resultat.user) {
      login(resultat.user);
      navigate(getHomeRouteForRole(resultat.user.role), { replace: true });
      return;
    }

    // Compte pas encore activé (ex: gérant en attente de validation) : pas de connexion automatique.
    setInfo('Mot de passe modifié. Vous pourrez vous connecter dès que votre compte sera activé.');
    setTimeout(() => navigate('/login'), 2500);
  };

  const revenirAEmail = () => {
    setEtape(1);
    setCode(CODE_VIDE);
    setErreur('');
    setInfo('');
  };

  return (
    <div className="min-h-screen bg-white flex font-sans relative">
      <RetourAccueilButton />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-6 text-center">

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-vert-principal tracking-tight">
              MOT DE PASSE OUBLIÉ
            </h1>
            {/* Indicateur d'étape */}
            <div className="flex items-center justify-center gap-2" aria-label={`Étape ${etape} sur 3`}>
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className={`h-1.5 rounded-full transition-all ${n === etape ? 'w-8 bg-vert-principal' : n < etape ? 'w-4 bg-vert-principal/50' : 'w-4 bg-gray-200'}`}
                />
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
            {etape === 2 ? (
              <>
                Saisissez le code à 6 chiffres envoyé à<br />
                <strong className="text-gray-900 font-bold">{email.trim()}</strong>
              </>
            ) : TITRES_ETAPES[etape]}
          </p>

          {erreur && <Alert type="error" message={erreur} />}
          {info && <Alert type="success" message={info} />}

          {/* ÉTAPE 1 : EMAIL */}
          {etape === 1 && (
            <form onSubmit={handleDemanderCode} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-800">Email</label>
                <Input
                  type="email"
                  required
                  autoComplete="email"
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
          )}

          {/* ÉTAPE 2 : CODE */}
          {etape === 2 && (
            <div className="space-y-6">
              <SaisieCode
                chiffres={code}
                onChange={(chiffres) => {
                  setCode(chiffres);
                  if (erreur) setErreur('');
                }}
                onComplete={handleVerifierCode}
                disabled={chargement}
                enErreur={Boolean(erreur)}
              />

              {chargement && <p className="text-xs font-semibold text-gray-500">Vérification du code...</p>}

              <div className="flex items-center justify-center gap-4 text-xs">
                {secondesAvantRenvoi > 0 ? (
                  <span className="font-semibold text-gray-400">Renvoyer le code dans {secondesAvantRenvoi} s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleRenvoyerCode}
                    disabled={chargement}
                    className="font-extrabold text-gray-900 hover:underline cursor-pointer disabled:opacity-50"
                  >
                    Renvoyer le code
                  </button>
                )}
                <span className="text-gray-300">·</span>
                <button
                  type="button"
                  onClick={revenirAEmail}
                  className="font-extrabold text-gray-900 hover:underline cursor-pointer"
                >
                  Changer d'email
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : NOUVEAU MOT DE PASSE */}
          {etape === 3 && (
            <form onSubmit={handleReinitialiser} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-800">Nouveau mot de passe</label>
                <InputMotDePasse
                  required
                  autoFocus
                  autoComplete="new-password"
                  value={nouveauMotDePasse}
                  onChange={(e) => setNouveauMotDePasse(e.target.value)}
                  placeholder="........"
                  className="text-xs font-semibold"
                />
                <p className="text-[11px] text-gray-500">Au moins 8 caractères, pas uniquement des chiffres.</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-800">Confirmer le nouveau mot de passe</label>
                <InputMotDePasse
                  required
                  autoComplete="new-password"
                  value={confirmationMotDePasse}
                  onChange={(e) => setConfirmationMotDePasse(e.target.value)}
                  placeholder="........"
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
                className="uppercase tracking-wider mt-2"
              >
                {chargement ? 'Enregistrement...' : 'Changer mon mot de passe'}
              </Button>
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
