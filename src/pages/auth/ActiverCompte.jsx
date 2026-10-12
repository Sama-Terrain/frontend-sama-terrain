import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import InputMotDePasse from '../../components/ui/InputMotDePasse';
import Alert from '../../components/ui/Alert';
import RetourAccueilButton from '../../components/auth/RetourAccueilButton';
import loginBg from '../../assets/terrain-login.png';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { getHomeRouteForRole } from '../../utils/roles';
import { validerMotDePasse, validerConfirmationMotDePasse } from '../../utils/validation';

/**
 * Page "Activer mon compte" (employé invité par son gérant).
 *
 * L'employé arrive ici depuis le lien reçu par email
 * (/activer-compte?uid=...&token=...). Pas de code de vérification : recevoir
 * le lien prouve déjà que l'email est le sien. Il choisit son mot de passe et
 * il est connecté directement, puis redirigé vers son espace.
 */
export default function ActiverCompte() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  const [etat, setEtat] = useState('verification'); // 'verification' | 'invalide' | 'formulaire'
  const [invitation, setInvitation] = useState(null); // { prenom, email, employeur }
  const [erreurLien, setErreurLien] = useState('');

  const [motDePasse, setMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    let actif = true;
    authService.verifierLienActivation(uid, token).then((resultat) => {
      if (!actif) return;
      if (resultat.success) {
        setInvitation(resultat);
        setEtat('formulaire');
      } else {
        setErreurLien(resultat.error);
        setEtat('invalide');
      }
    });
    return () => {
      actif = false;
    };
  }, [uid, token]);

  const handleActiver = async (e) => {
    e.preventDefault();
    setErreur('');

    const erreurMotDePasse = validerMotDePasse(motDePasse) || validerConfirmationMotDePasse(motDePasse, confirmation);
    if (erreurMotDePasse) {
      setErreur(erreurMotDePasse);
      return;
    }

    setChargement(true);
    const resultat = await authService.activerCompteEmploye(uid, token, motDePasse);
    setChargement(false);

    if (!resultat.success) {
      setErreur(resultat.error);
      return;
    }

    // Connecté directement : on mémorise l'utilisateur et on l'envoie dans son espace.
    login(resultat.user);
    navigate(getHomeRouteForRole(resultat.user.role), { replace: true });
  };

  return (
    <div className="min-h-screen bg-white flex font-sans relative">
      <RetourAccueilButton />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-6 text-center">

          <h1 className="text-2xl sm:text-3xl font-extrabold text-vert-principal tracking-tight">
            ACTIVER MON COMPTE
          </h1>

          {etat === 'verification' && (
            <div className="py-8 space-y-4">
              <div className="w-10 h-10 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-gray-500 font-semibold">Vérification de votre invitation...</p>
            </div>
          )}

          {etat === 'invalide' && (
            <div className="space-y-6">
              <Alert type="error" message={erreurLien} />
              <p className="text-xs text-gray-500">
                Votre compte est peut-être déjà activé :{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-[#D4AF37] font-bold hover:underline cursor-pointer"
                >
                  se connecter
                </button>
              </p>
            </div>
          )}

          {etat === 'formulaire' && (
            <>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                Bienvenue <strong className="text-gray-900">{invitation.prenom}</strong> ! {invitation.employeur} vous a
                ajouté(e) à son équipe sur Sama-Terrain. Choisissez votre mot de passe pour accéder à votre espace.
              </p>

              {erreur && <Alert type="error" message={erreur} />}

              <form onSubmit={handleActiver} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-800">Email</label>
                  <Input type="email" value={invitation.email} state="disabled" className="text-xs font-semibold" readOnly />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-800">Mot de passe</label>
                  <InputMotDePasse
                    required
                    autoComplete="new-password"
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    placeholder="........"
                    className="text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-800">Confirmer le mot de passe</label>
                  <InputMotDePasse
                    required
                    autoComplete="new-password"
                    value={confirmation}
                    onChange={(e) => setConfirmation(e.target.value)}
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
                  {chargement ? 'Activation...' : 'Activer mon compte'}
                </Button>
              </form>
            </>
          )}

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
