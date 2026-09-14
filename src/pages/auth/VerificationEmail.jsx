import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import RetourAccueilButton from '../../components/auth/RetourAccueilButton';
import loginBg from '../../assets/terrain-login.png';
import { authService } from '../../services/authService';

export default function VerificationEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'mariegodmer@gmail.com';
  // Un compte gérant reste inactif tant qu'un admin ne l'a pas validé : on
  // ne peut pas le renvoyer directement vers /login (ça échouerait), on lui
  // explique plutôt qu'il doit attendre la validation de sa demande.
  const depuisDevenirGerant = Boolean(location.state?.depuisDevenirGerant);
  const [demandeEnAttente, setDemandeEnAttente] = useState(false);

  // Le backend envoie un code à 6 chiffres, donc 6 cases de saisie.
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setError('Veuillez entrer les 6 chiffres du code');
      return;
    }

    const resultat = await authService.verifyCode(email, fullCode);

    if (!resultat.success) {
      setError(resultat.error);
      return;
    }

    setSuccess(true);

    if (depuisDevenirGerant) {
      // Le compte n'est pas encore actif (validation admin en attente) :
      // on affiche l'info à la place de rediriger vers /login.
      setDemandeEnAttente(true);
      return;
    }

    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  const handleRenvoyerCode = async () => {
    setError('');
    const resultat = await authService.resendCode(email);
    if (!resultat.success) {
      setError(resultat.error);
    }
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
            Nous avons envoyé un code de vérification à<br />
            <strong className="text-gray-900 font-bold">{email}</strong>
          </p>

          {error && (
            <Alert type="error" message={error} />
          )}

          {success && (
            <Alert
              type="success"
              message={
                demandeEnAttente
                  ? 'E-mail vérifié avec succès !'
                  : 'E-mail vérifié avec succès ! Redirection...'
              }
            />
          )}

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
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-extrabold text-gray-900 bg-white border border-gray-200 rounded-[8px] focus:outline-none focus:border-vert-principal focus:ring-1 focus:ring-vert-principal shadow-sm"
                />
              ))}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              rounded="8px"
              fullWidth
              className="uppercase tracking-wider"
            >
              VÉRIFIER
            </Button>
          </form>

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
              onClick={handleRenvoyerCode}
              className="text-xs font-extrabold text-gray-900 hover:underline cursor-pointer"
            >
              Renvoyer le code
            </button>
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
