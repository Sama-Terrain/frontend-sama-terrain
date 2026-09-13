import api, { CLE_ACCESS_TOKEN, CLE_REFRESH_TOKEN } from './api';

/**
 * Service d'authentification.
 * Appelle désormais le vrai backend Django (voir backend/authentification/).
 */

// Calcule les initiales à partir du prénom/nom, comme le faisaient les mocks
// (le backend ne renvoie pas ce champ, il n'a pas besoin de le connaître).
function ajouterInitiales(user) {
  const initiale1 = user.prenom?.[0] || '';
  const initiale2 = user.nom?.[0] || '';
  return { ...user, initiales: `${initiale1}${initiale2}`.toUpperCase() };
}

// Traduit les erreurs renvoyées par DRF (souvent {champ: [message]}) en un texte lisible.
function extraireMessageErreur(error) {
  const donnees = error.response?.data;
  if (!donnees) return 'Une erreur réseau est survenue.';
  if (typeof donnees === 'string') return donnees;
  if (donnees.detail) return donnees.detail;

  const premierChamp = Object.values(donnees)[0];
  if (Array.isArray(premierChamp)) return premierChamp[0];
  return 'Une erreur est survenue.';
}

export const authService = {
  login: async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });

      localStorage.setItem(CLE_ACCESS_TOKEN, data.access);
      localStorage.setItem(CLE_REFRESH_TOKEN, data.refresh);

      return { success: true, user: ajouterInitiales(data.user) };
    } catch (error) {
      return { success: false, error: extraireMessageErreur(error) };
    }
  },

  register: async (data) => {
    try {
      const reponse = await api.post('/auth/register', {
        prenom: data.prenom,
        nom: data.nom,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      return { success: true, email: reponse.data.email };
    } catch (error) {
      return { success: false, error: extraireMessageErreur(error) };
    }
  },

  verifyCode: async (email, code) => {
    try {
      await api.post('/auth/verify-email', { email, code });
      return { success: true };
    } catch (error) {
      return { success: false, error: extraireMessageErreur(error) };
    }
  },

  resendCode: async (email) => {
    try {
      await api.post('/auth/resend-code', { email });
      return { success: true };
    } catch (error) {
      return { success: false, error: extraireMessageErreur(error) };
    }
  },

  loginWithGoogle: async (credential) => {
    try {
      const { data } = await api.post('/auth/google', { credential });

      localStorage.setItem(CLE_ACCESS_TOKEN, data.access);
      localStorage.setItem(CLE_REFRESH_TOKEN, data.refresh);

      return { success: true, user: ajouterInitiales(data.user) };
    } catch (error) {
      return { success: false, error: extraireMessageErreur(error) };
    }
  },

  logout: async () => {
    const refresh = localStorage.getItem(CLE_REFRESH_TOKEN);
    try {
      if (refresh) {
        await api.post('/auth/logout', { refresh });
      }
    } finally {
      localStorage.removeItem(CLE_ACCESS_TOKEN);
      localStorage.removeItem(CLE_REFRESH_TOKEN);
    }
  },

  getUtilisateurConnecte: async () => {
    try {
      const { data } = await api.get('/auth/me');
      return { success: true, user: ajouterInitiales(data) };
    } catch (error) {
      return { success: false, error: extraireMessageErreur(error) };
    }
  },

  /**
   * Affiche le vrai bouton Google (rendu par Google lui-même) à l'intérieur
   * de `element`, et appelle `onResultat({success, user|error})` une fois que
   * Google a répondu.
   *
   * On utilise `renderButton` plutôt que `prompt()` (One Tap) : ce dernier est
   * de plus en plus bloqué par les navigateurs (cookies tiers, migration
   * FedCM) même quand tout est bien configuré côté Google Cloud Console.
   * Le vrai bouton, lui, fonctionne de façon fiable dans tous les cas.
   *
   * `element` est superposé (invisible) par-dessus notre bouton stylisé dans
   * Connexion.jsx / Inscription.jsx, pour garder le design de la maquette
   * tout en déclenchant l'authentification native de Google au clic.
   */
  initialiserBoutonGoogle: (element, onResultat, tentative = 0) => {
    if (!element) return;

    // Le script Google (chargé en `async defer` dans index.html) peut ne pas
    // être encore prêt au moment où le composant se monte : on réessaie
    // pendant 5 secondes avant d'abandonner.
    if (!window.google?.accounts?.id) {
      if (tentative >= 25) {
        onResultat({ success: false, error: "Google n'a pas pu se charger. Réessayez." });
        return;
      }
      setTimeout(() => authService.initialiserBoutonGoogle(element, onResultat, tentative + 1), 200);
      return;
    }

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (reponseGoogle) => {
        const resultat = await authService.loginWithGoogle(reponseGoogle.credential);
        onResultat(resultat);
      },
    });

    window.google.accounts.id.renderButton(element, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      width: 400,
    });
  },
};
