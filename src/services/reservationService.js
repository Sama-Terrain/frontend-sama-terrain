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
    // Pour un terrain divisible, on précise la partie louée (ex: "Portion 2").
    nomTerrain: r.libelle_portion ? `${r.terrain_nom} · ${r.libelle_portion}` : r.terrain_nom,
    image: r.terrain_image,
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
    // Le ticket (QR) n'existe qu'une fois le paiement confirmé par l'IPN
    // PayTech : tant que la réservation est "en_attente", il n'y en a pas.
    reference: r.ticket ? `#ST-${r.ticket.code.slice(0, 8).toUpperCase()}` : null,
    ticketCode: r.ticket?.code || null,
    ticketDisponible: Boolean(r.ticket),
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
      fraisAnnulation: data.frais_annulation,
    };
  },

  annulerReservation: async (resId) => {
    try {
      const { data } = await api.delete(`/reservations/${resId}/`);
      return {
        success: true,
        remboursementTotal: data.remboursement_possible,
        montantRembourse: data.montant_rembourse,
        fraisAnnulation: data.frais_annulation,
      };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Erreur lors de l\'annulation.' };
    }
  },

  // Crée une réservation pour le créneau choisi : bloque immédiatement le
  // créneau (statut "en_attente") en attendant le paiement de l'avance.
  // Appelé depuis DetailTerrain.jsx, AVANT de rediriger vers /paiement.
  creerReservation: async ({ creneauId, nomComplet, telephone, montantAvance }) => {
    const { data } = await api.post('/reservations/', {
      creneau: creneauId,
      nom_complet: nomComplet,
      telephone,
      montant_avance: montantAvance,
    });
    return normaliserReservation(data);
  },

  // Réserve plusieurs créneaux d'un même terrain en une seule fois (avance
  // globale répartie au prorata côté backend). Renvoie l'id de la Commande
  // créée et les réservations qui la composent (une par créneau).
  creerReservationGroupe: async ({ creneauIds, nomComplet, telephone, montantAvance }) => {
    const { data } = await api.post('/reservations/groupe/', {
      creneaux: creneauIds,
      nom_complet: nomComplet,
      telephone,
      montant_avance: montantAvance,
    });
    return {
      commandeId: data.commande,
      reservations: data.reservations.map(normaliserReservation),
    };
  },

  // Détail d'une commande (utilisé sur la page de paiement et la page de
  // succès, pour connaître/vérifier l'état de TOUTES ses réservations).
  getCommandeById: async (commandeId) => {
    const { data } = await api.get(`/reservations/commande/${commandeId}/`);
    return {
      commandeId: data.commande,
      reservations: data.reservations.map(normaliserReservation),
    };
  },
};
