import api from './api';

/**
 * Service pour la gestion des avis (côté amateur, affichage public sur une fiche terrain).
 * Appelle désormais le vrai backend Django (voir backend/avis/).
 */

// Transforme un avis reçu du backend vers le format déjà attendu par la page.
function normaliserAvis(a) {
  return {
    ...a,
    id: a.id,
    nom: a.nom,
    initiales: a.initiales,
    note: a.note,
    commentaire: a.commentaire,
    date: new Date(a.cree_le).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
  };
}

export const avisService = {
  // Liste publique des avis visibles d'un terrain.
  getAvisJoueurs: async (terrainId) => {
    const { data } = await api.get(`/terrains/${terrainId}/avis`);
    return data.map(normaliserAvis);
  },

  // Témoignages mis en avant sur la page d'accueil (tous terrains confondus).
  getMeilleursAvis: async () => {
    const { data } = await api.get('/avis/meilleurs/');
    return data.map((a) => ({ ...normaliserAvis(a), role: `A joué à ${a.terrain}` }));
  },

  // Indique si l'amateur peut laisser un avis pour cette réservation précise
  // (réservation confirmée, match déjà joué, pas déjà notée).
  avisPossible: async (reservationId) => {
    const { data } = await api.get(`/reservations/${reservationId}/avis-possible`);
    return data.avis_possible;
  },

  // Soumet un nouvel avis, lié à une réservation précise.
  creerAvis: async ({ reservationId, note, commentaire }) => {
    try {
      const { data } = await api.post('/avis/', { reservation: reservationId, note, commentaire });
      return { success: true, avis: normaliserAvis(data) };
    } catch (error) {
      const message =
        error.response?.data?.reservation?.[0] ||
        error.response?.data?.note?.[0] ||
        "Impossible d'enregistrer votre avis.";
      return { success: false, error: message };
    }
  },

  // Signale un avis jugé abusif/faux (visible par un admin ensuite).
  signalerAvis: async (avisId) => {
    await api.post(`/avis/${avisId}/signaler/`);
  },
};
