import { MOCK_AVIS } from '../data/mockAvis';

/**
 * Service pour la gestion des avis joueurs.
 */
export const avisService = {
  async getAvisJoueurs() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_AVIS;
  }
};
