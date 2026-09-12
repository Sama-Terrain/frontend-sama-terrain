import { MOCK_CRENEAUX } from '../mocks/creneaux';
import { delaiReseau } from '../utils/delaiReseau';

/**
 * Service pour la gestion des créneaux disponibles côté amateur (recherche + réservation).
 */
export const creneauService = {
  async getCreneauxByTerrainAndDate(terrainId, dateStr) {
    await delaiReseau();
    return MOCK_CRENEAUX;
  }
};
