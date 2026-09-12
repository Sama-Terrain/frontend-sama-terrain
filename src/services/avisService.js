import { MOCK_AVIS } from '../mocks/avis';
import { delaiReseau } from '../utils/delaiReseau';

/**
 * Service pour la gestion des avis joueurs (affichage public sur une fiche terrain).
 */
export const avisService = {
  async getAvisJoueurs() {
    await delaiReseau();
    return MOCK_AVIS;
  }
};
