import api from './api';
import { formatDateTexte, combinerDateEtHeureDebut } from '../utils/formatDate';

/**
 * Service pour la gestion des réservations (côté amateur).
 * Appelle désormais le vrai backend Django (voir backend/reservations/).
 */

const LABELS_STATUT = {
  en_attente: { label: 'En attente de paiement', badge: 'bg-amber-100 text-amber-700' },
  confirmee: { label: 'Confirmée', badge: 'bg-emerald-100 text-emerald-700' },
  terminee: { label: 'Terminée', badge: 'bg-gray-100 text-gray-700' },
  annulee: { label: 'Annulée', badge: 'bg-red-100 text-red-700' },
};

// Détermine l'onglet ("a-venir" / "passees" / "annulees") d'une réservation
// pour la page "Mes réservations", à partir de son statut et de la date du match.
function determinerTabCategory(reservationBackend) {
  if (reservationBackend.statut === 'annulee') return 'annulees';

  const finMatch = new Date(`${reservationBackend.date}T${reservationBackend.heure_fin}`);
  if (finMatch.getTime() < Date.now()) return 'passees';

  return 'a-venir';
}

// Transforme une réservation reçue du backend vers le format déjà attendu
// par les pages/composants (MesReservations.jsx, TicketQR.jsx, ...).
function normaliserReservation(r) {
  const infosStatut = LABELS_STATUT[r.statut] || LABELS_STATUT.en_attente;
  const heureCreneau = `${r.heure_debut.slice(0, 5)} - ${r.heure_fin.slice(0, 5)}`;

  return {
    ...r,
    id: r.id,
    terrainId: r.terrain_id,
    nomTerrain: r.terrain_nom,
    status: infosStatut.label,
    statusBadgeClass: infosStatut.badge,
    acomptePaye: r.statut !== 'en_attente',
    dateHeureCreneau: combinerDateEtHeureDebut(r.date, heureCreneau),
    dateTexte: formatDateTexte(r.date, heureCreneau),
    montantAcompte: r.montant_avance,
    prixTotal: r.montant_total,
    resteAPayer: r.reste_a_payer,
    moyenPaiement: r.moyen_paiement,
    transactionId: r.transaction_id,
    tabCategory: determinerTabCategory(r),
  };
}

export const reservationService = {
  getUserReservations: async () => {
    const { data } = await api.get('/reservations/mes-reservations/');
    return data.map(normaliserReservation);
  },

  getReservationById: async (id) => {
    const { data } = await api.get(`/reservations/${id}/`);
    return normaliserReservation(data);
  },

  // Renvoie ce que verrait l'amateur avant de confirmer son annulation
  // (utilisé pour afficher "vous serez remboursé de X FCFA" avant qu'il ne clique).
  previsualiserAnnulation: async (resId) => {
    const { data } = await api.get(`/reservations/${resId}/politique-annulation/`);
    return {
      remboursementTotal: data.remboursement_possible,
      montantRembourse: data.montant_rembourse,
    };
  },

  annulerReservation: async (resId) => {
    try {
      const { data } = await api.delete(`/reservations/${resId}/`);
      return {
        success: true,
        remboursementTotal: data.remboursement_possible,
        montantRembourse: data.montant_rembourse,
      };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Erreur lors de l\'annulation.' };
    }
  },

  // Crée une réservation pour le créneau choisi : bloque immédiatement le
  // créneau (statut "en_attente") en attendant le paiement de l'avance.
  // Appelé depuis DetailTerrain.jsx, AVANT de rediriger vers /paiement.
  creerReservation: async ({ creneauId, nomComplet, telephone }) => {
    const { data } = await api.post('/reservations/', {
      creneau: creneauId,
      nom_complet: nomComplet,
      telephone,
    });
    return normaliserReservation(data);
  },
};
