import api from './api';

/**
 * Service pour la gestion des créneaux disponibles côté amateur (recherche + réservation).
 * Appelle désormais le vrai backend Django (voir backend/creneaux/).
 */

// Transforme un créneau reçu du backend (heure_debut/heure_fin/statut) vers
// le format déjà attendu par les pages (heure formatée + booléen disponible).
function normaliserCreneau(creneau) {
  const debut = creneau.heure_debut.slice(0, 5);
  const fin = creneau.heure_fin.slice(0, 5);

  return {
    ...creneau,
    id: creneau.id,
    heure: `${debut} - ${fin}`,
    prix: creneau.prix,
    disponible: creneau.statut === 'disponible',
  };
}

export const creneauService = {
  async getCreneauxByTerrainAndDate(terrainId, dateStr) {
    const { data } = await api.get(`/terrains/${terrainId}/creneaux`, {
      params: { date: dateStr },
    });
    return data.map(normaliserCreneau);
  },
};
