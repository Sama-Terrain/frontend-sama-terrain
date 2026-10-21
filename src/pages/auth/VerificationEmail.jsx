import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Clock, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import RetourAccueilButton from '../../components/auth/RetourAccueilButton';
import SaisieCode from '../../components/auth/SaisieCode';
import loginBg from '../../assets/terrain-login.png';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { getHomeRouteForRole } from '../../utils/roles';

const CODE_VIDE = ['', '', '', '', '', ''];
// Un code vient d'être envoyé à l'inscription : on attend avant d'en renvoyer un.
const DELAI_RENVOI_SECONDES = 60;

/**
 * Page "Vérifiez votre e-mail" (après l'inscription d'un joueur ou la demande
 * d'un gérant). Même comportement que "Mot de passe oublié" :
 * - code collable, vérifié automatiquement dès le 6e chiffre ;
 * - 5 essais maximum par code, renvoi possible après 60 secondes ;
 * - une fois vérifié, le joueur est connecté directement. Le gérant, lui,
 *   doit encore attendre la validation de sa demande par un administrateur.
 */
export default function VerificationEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const email = location.state?.email;
  const depuisDevenirGerant = Boolean(location.state?.depuisDevenirGerant);

  const [code, setCode] = useState(CODE_VIDE);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [info, setInfo] = useState('');
  const [demandeEnAttente, setDemandeEnAttente] = useState(false);
  const [secondesAvantRenvoi, setSecondesAvantRenvoi] = useState(DELAI_RENVOI_SECONDES);

  // Compte à rebours avant de pouvoir renvoyer un code.
  useEffect(() => {
    if (secondesAvantRenvoi <= 0) return undefined;
    const minuteur = setTimeout(() => setSecondesAvantRenvoi((s) => s - 1), 1000);
    return () => clearTimeout(minuteur);
  }, [secondesAvantRenvoi]);

  // Page ouverte sans email (lien direct, rechargement...) : rien à vérifier.
  if (!email) {
    return <Navigate to="/login" replace />;
  }

  const handleVerifier = async (codeComplet) => {
    if (chargement) return;
    setErreur('');
    setInfo('');
    setChargement(true);
    const resultat = await authService.verifyCode(email, codeComplet);
    setChargement(false);

    if (!resultat.success) {
      setErreur(resultat.error);
      setCode(CODE_VIDE);
      return;
    }

    if (resultat.user) {
      // Connecté directement, comme dans la plupart des applications.
      login(resultat.user);
      navigate(getHomeRouteForRole(resultat.user.role), { replace: true });
      return;
    }

    if (depuisDevenirGerant) {
      // Compte gérant pas encore actif (validation admin en attente).
      setDemandeEnAttente(true);
      return;
    }

    setInfo('E-mail vérifié avec succès ! Redirection...');
    setTimeout(() => navigate('/login'), 1500);
  };

  const handleRenvoyerCode = async () => {
    setErreur('');
    setInfo('');
    const resultat = await authService.resendCode(email);
    if (!resultat.success) {
      setErreur(resultat.error);
      return;
    }
    setCode(CODE_VIDE);
    setSecondesAvantRenvoi(DELAI_RENVOI_SECONDES);
    setInfo('Un nouveau code vous a été envoyé.');
  };

  return (
    <div className="min-h-screen bg-white flex font-sans relative">
      <RetourAccueilButton />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-6 text-center">

          <h1 className="text-2xl sm:text-3xl font-extrabold text-vert-principal tracking-tight">
            VÉRIFIEZ VOTRE E-MAIL
          </h1>

          <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
            Saisissez le code à 6 chiffres envoyé à<br />
            <strong className="text-gray-900 font-bold">{email}</strong>
          </p>

          {erreur && <Alert type="error" message={erreur} />}
          {info && <Alert type="success" message={info} />}

          <SaisieCode
            chiffres={code}
            onChange={(chiffres) => {
              setCode(chiffres);
              if (erreur) setErreur('');
            }}
            onComplete={handleVerifier}
            disabled={chargement || demandeEnAttente}
            enErreur={Boolean(erreur)}
          />

          {chargement && <p className="text-xs font-semibold text-gray-500">Vérification du code...</p>}

          <div className="space-y-2 pt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-[11px] text-gray-400">
                Vous n'avez rien reçu ? Pensez à vérifier vos spams.
              </span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            {secondesAvantRenvoi > 0 ? (
              <p className="text-xs font-semibold text-gray-400">Renvoyer le code dans {secondesAvantRenvoi} s</p>
            ) : (
              <button
                type="button"
                onClick={handleRenvoyerCode}
                disabled={chargement}
                className="text-xs font-extrabold text-gray-900 hover:underline cursor-pointer disabled:opacity-50"
              >
                Renvoyer le code
              </button>
            )}
          </div>

          <div className="pt-6">
            <button
              onClick={() => navigate('/login')}
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Retourner à la <span className="font-bold text-gray-900">page de connexion</span>
            </button>
          </div>

        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 bg-gray-200 relative overflow-hidden">
        <img
          src={loginBg}
          alt="Sama-Terrain Auth"
          className="w-full h-full object-cover"
        />
      </div>

      {/* MODAL : demande gérant en attente de validation admin */}
      {demandeEnAttente && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[8px] p-6 sm:p-8 max-w-md w-full space-y-5 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-vert-clair flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} className="text-vert-principal" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-vert-principal">
                Email vérifié avec succès !
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Votre demande pour devenir gérant a bien été enregistrée.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-[8px] p-4 flex items-start gap-2.5 text-left">
              <Clock size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                Notre équipe va examiner votre dossier sous <strong>24h</strong>. Votre compte sera activé
                dès validation — vous pourrez alors vous connecter à votre espace gérant.
              </p>
            </div>

            <Button
              onClick={() => navigate('/')}
              variant="primary"
              size="md"
              rounded="8px"
              fullWidth
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
