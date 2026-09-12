import { MOCK_AMATEUR, MOCK_ADMIN } from '../mocks/utilisateurs';
import { MOCK_GERANT } from '../mocks/gerants';
import { delaiReseau } from '../utils/delaiReseau';

/**
 * Service d'authentification.
 * Aujourd'hui : compare les identifiants aux comptes de test mockés.
 * Demain : remplacer le contenu de ces fonctions par de vrais appels à l'API
 * Django (ex: POST /api/auth/login/) sans changer la façon dont les pages les utilisent.
 */
export const authService = {
  login: async (email, password) => {
    await delaiReseau();

    const emailSaisi = email.trim().toLowerCase();

    if (emailSaisi === MOCK_ADMIN.email.toLowerCase() && password === MOCK_ADMIN.password) {
      return { success: true, user: MOCK_ADMIN };
    }
    if (emailSaisi === MOCK_GERANT.email.toLowerCase() && password === MOCK_GERANT.password) {
      return { success: true, user: MOCK_GERANT };
    }
    if (emailSaisi === MOCK_AMATEUR.email.toLowerCase() && password === MOCK_AMATEUR.password) {
      return { success: true, user: MOCK_AMATEUR };
    }

    return { success: false, error: 'Identifiants incorrects' };
  },

  verifyCode: async (code) => {
    await delaiReseau();

    if (code === MOCK_AMATEUR.verificationCode) {
      return { success: true, user: MOCK_AMATEUR };
    }
    return { success: false, error: 'Code de vérification invalide' };
  },

  register: async (data) => {
    await delaiReseau();
    return { success: true, user: data };
  }
};
