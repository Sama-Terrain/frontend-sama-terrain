import api from './api';

/**
 * Service pour la gestion des terrains (catalogue public, côté amateur).
 * Appelle désormais le vrai backend Django (voir backend/terrains/).
 */

// Le backend stocke le type sous forme "Foot à 5", "Foot à 6", etc.
// alors que les pages/filtres du frontend utilisent "5v5", "6v6", "7v7".
// On fait la conversion ici pour ne rien avoir à changer côté pages.
const TYPES_BACKEND_VERS_FRONTEND = {
  'Foot à 5': '5v5',
  'Foot à 6': '6v6',
  'Foot à 7': '7v7',
  'Foot à 11': '11v11',
};

// Transforme un terrain reçu du backend au format attendu par les pages
// (mêmes noms de champs que les anciennes données mockées).
function normaliserTerrain(terrain) {
  if (!terrain) return null;

  return {
    ...terrain,
    id: terrain.id,
    nom: terrain.nom,
    localisation: terrain.adresse ? `${terrain.adresse}, ${terrain.ville}` : terrain.ville,
    type: TYPES_BACKEND_VERS_FRONTEND[terrain.type] || terrain.type,
    prixHeure: terrain.prix_heure,
    avance: terrain.avance,
    note: Number(terrain.note_moyenne) || 0,
    nombreAvis: terrain.nombre_avis,
    disponible: terrain.actif,
    surface: terrain.surface,
    equipements: terrain.equipements || [],
    image: terrain.image || undefined,
    description: terrain.description,
    capacite: terrain.capacite,
    heureOuverture: terrain.heure_ouverture,
    heureFermeture: terrain.heure_fermeture,
    photos: terrain.photos,
  };
}

export const terrainService = {
  // Récupérer la liste de tous les terrains (catalogue public)
  async getTerrains() {
    const { data } = await api.get('/terrains');
    return data.map(normaliserTerrain);
  },

  async getAllTerrains() {
    return this.getTerrains();
  },

  // Récupérer les terrains vedettes pour la page d'accueil
  // (pas de champ "vedette" côté backend : on prend simplement les mieux notés)
  async getTerrainsVedettes() {
    const terrains = await this.getTerrains();
    return [...terrains].sort((a, b) => b.note - a.note).slice(0, 3);
  },

  // Récupérer un terrain par son ID
  async getTerrainById(id) {
    try {
      const { data } = await api.get(`/terrains/${id}`);
      return normaliserTerrain(data);
    } catch (error) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },
};
