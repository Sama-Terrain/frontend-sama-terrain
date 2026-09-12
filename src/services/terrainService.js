import { MOCK_TERRAINS } from '../mocks/terrains';
import { delaiReseau } from '../utils/delaiReseau';

/**
 * Service pour la gestion des terrains (catalogue public, côté amateur).
 * Pour le moment, il retourne des données mockées.
 * Plus tard, il suffira de remplacer le contenu des fonctions par des appels
 * fetch / axios à l'API Backend Django, sans rien changer côté pages.
 */
export const terrainService = {
  // Récupérer la liste de tous les terrains
  async getTerrains() {
    await delaiReseau();
    return MOCK_TERRAINS;
  },

  async getAllTerrains() {
    return this.getTerrains();
  },

  // Récupérer les terrains vedettes pour la page d'accueil
  async getTerrainsVedettes() {
    await delaiReseau();
    return MOCK_TERRAINS.slice(0, 3);
  },

  // Récupérer un terrain par son ID
  async getTerrainById(id) {
    await delaiReseau();
    return MOCK_TERRAINS.find((t) => t.id === Number(id)) || null;
  }
};
