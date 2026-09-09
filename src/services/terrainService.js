import { MOCK_TERRAINS } from '../data/mockTerrains';

/**
 * Service pour la gestion des terrains.
 * Pour le moment, il retourne des données mockées.
 * Plus tard, il suffira de remplacer le contenu des fonctions par des appels fetch / axios à l'API Backend.
 */
export const terrainService = {
  // Récupérer la liste de tous les terrains
  async getTerrains() {
    // Simulation d'un délai réseau API (300ms)
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_TERRAINS;
  },

  async getAllTerrains() {
    return this.getTerrains();
  },

  // Récupérer les terrains vedettes pour la page d'accueil
  async getTerrainsVedettes() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_TERRAINS.slice(0, 3);
  },

  // Récupérer un terrain par son ID
  async getTerrainById(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_TERRAINS.find((t) => t.id === Number(id)) || null;
  }
};
