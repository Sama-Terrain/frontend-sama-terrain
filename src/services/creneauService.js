import { MOCK_CRENEAUX } from '../data/mockCreneaux';

export const creneauService = {
  async getCreneauxByTerrainAndDate(terrainId, dateStr) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_CRENEAUX;
  }
};
