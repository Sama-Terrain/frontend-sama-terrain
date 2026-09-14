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

// Transforme un terrain reçu du backend au format attendu par les pages
// de l'espace gérant (GerantTerrainCard.jsx, TerrainDetail.jsx...).
function normaliserTerrainGerant(terrain) {
  return {
    ...terrain,
    id: terrain.id,
    nom: terrain.nom,
    ville: terrain.ville,
    adresse: terrain.adresse,
    localisation: terrain.adresse ? `${terrain.adresse}, ${terrain.ville}` : terrain.ville,
    type: terrain.type,
    surface: terrain.surface,
    capacite: terrain.capacite,
    prixHeure: `${terrain.prix_heure.toLocaleString()} FCFA`,
    horaires: `${terrain.heure_ouverture?.slice(0, 5)} - ${terrain.heure_fermeture?.slice(0, 5)}`,
    equipements: terrain.equipements || [],
    description: terrain.description,
    actif: terrain.actif,
    note: Number(terrain.note_moyenne) || 0,
    image: terrain.image || undefined,
    photos: (terrain.photos || []).map((p) => p.image),
    reservationsMois: terrain.reservations_mois || 0,
    revenusMois: `${(terrain.revenus_mois || 0).toLocaleString()} FCFA`,
    stats: {
      reservationsMois: terrain.reservations_mois || 0,
      revenusMois: `${(terrain.revenus_mois || 0).toLocaleString()} FCFA`,
      noteMoyenne: Number(terrain.note_moyenne) || 0,
      tauxOccupation: terrain.taux_occupation || 0,
    },
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

  // --- Espace gérant ---

  // Terrains du gérant connecté (page "Mes terrains"), y compris inactifs.
  async getMesTerrains() {
    const { data } = await api.get('/terrains', { params: { mine: 'true' } });
    return data.map(normaliserTerrainGerant);
  },

  // Détail d'un terrain géré (page TerrainDetail.jsx).
  async getTerrainDetailGerant(id) {
    const { data } = await api.get(`/terrains/${id}`);
    return normaliserTerrainGerant(data);
  },

  // Transforme le formulaire d'AjouterTerrain.jsx en FormData (nécessaire
  // pour envoyer les photos en même temps que les champs texte).
  _construireFormData({ nom, type, ville, adresse, capacite, surface, prixHeure, heureOuverture, heureFermeture, equipements, description, photos }) {
    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('type', type);
    formData.append('ville', ville);
    formData.append('adresse', adresse);
    formData.append('capacite', capacite);
    formData.append('surface', surface);
    formData.append('prix_heure', prixHeure);
    formData.append('heure_ouverture', heureOuverture);
    formData.append('heure_fermeture', heureFermeture);
    formData.append('description', description);
    // Le champ "equipements" est un JSONField côté backend : avec du
    // multipart/form-data, il doit être envoyé comme UNE chaîne JSON
    // (et non répété plusieurs fois), sinon DRF refuse de le décoder.
    formData.append('equipements', JSON.stringify(equipements));
    (photos || []).forEach((photo) => formData.append('photos', photo));
    return formData;
  },

  // Crée un nouveau terrain (gérant connecté).
  async creerTerrain(formulaire) {
    try {
      const formData = this._construireFormData(formulaire);
      const { data } = await api.post('/terrains/', formData);
      return { success: true, terrain: normaliserTerrainGerant(data) };
    } catch (error) {
      return { success: false, error: extraireErreurTerrain(error) };
    }
  },

  // Modifie un terrain existant (gérant propriétaire uniquement).
  async modifierTerrain(id, formulaire) {
    try {
      const formData = this._construireFormData(formulaire);
      const { data } = await api.patch(`/terrains/${id}/`, formData);
      return { success: true, terrain: normaliserTerrainGerant(data) };
    } catch (error) {
      return { success: false, error: extraireErreurTerrain(error) };
    }
  },

  // Active/désactive un terrain (bascule visible dans le catalogue public).
  async changerActif(id, actif) {
    const formData = new FormData();
    formData.append('actif', actif ? 'true' : 'false');
    const { data } = await api.patch(`/terrains/${id}/`, formData);
    return normaliserTerrainGerant(data);
  },

  async supprimerTerrain(id) {
    await api.delete(`/terrains/${id}/`);
  },
};

function extraireErreurTerrain(error) {
  const donnees = error.response?.data;
  if (!donnees) return 'Une erreur réseau est survenue.';
  const premierChamp = Object.values(donnees)[0];
  return Array.isArray(premierChamp) ? premierChamp[0] : "Impossible d'enregistrer ce terrain.";
}
