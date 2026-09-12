import { MOCK_RESERVATIONS_AMATEUR } from '../mocks/reservations';
import { delaiReseau } from '../utils/delaiReseau';
import { formatDateTexte, combinerDateEtHeureDebut } from '../utils/formatDate';

const HEURES_LIMITE_REMBOURSEMENT_TOTAL = 24;

/**
 * Calcule ce qui est remboursé si on annule maintenant une réservation.
 * Règle métier : remboursement total si l'annulation a lieu plus de 24h avant
 * le créneau, sinon l'avance déjà versée est perdue.
 */
function calculerRemboursement(reservation) {
  const heuresRestantes =
    (new Date(reservation.dateHeureCreneau).getTime() - Date.now()) / (1000 * 60 * 60);

  if (heuresRestantes >= HEURES_LIMITE_REMBOURSEMENT_TOTAL) {
    return { remboursementTotal: true, montantRembourse: reservation.montantAcompte };
  }
  return { remboursementTotal: false, montantRembourse: 0 };
}

export const reservationService = {
  getUserReservations: async () => {
    await delaiReseau();
    return MOCK_RESERVATIONS_AMATEUR;
  },

  // Renvoie ce que verrait l'amateur avant de confirmer son annulation
  // (utilisé pour afficher "vous serez remboursé de X FCFA" avant qu'il ne clique).
  previsualiserAnnulation: async (resId) => {
    await delaiReseau();
    const reservation = MOCK_RESERVATIONS_AMATEUR.find((r) => r.id === resId);
    if (!reservation) return null;
    return calculerRemboursement(reservation);
  },

  annulerReservation: async (resId) => {
    await delaiReseau();
    const index = MOCK_RESERVATIONS_AMATEUR.findIndex((r) => r.id === resId);
    if (index === -1) {
      return { success: false, error: 'Réservation introuvable' };
    }

    const remboursement = calculerRemboursement(MOCK_RESERVATIONS_AMATEUR[index]);

    MOCK_RESERVATIONS_AMATEUR[index].status = 'Annulée';
    MOCK_RESERVATIONS_AMATEUR[index].statusBadgeClass = 'bg-red-100 text-red-700';
    MOCK_RESERVATIONS_AMATEUR[index].tabCategory = 'annulees';

    return { success: true, ...remboursement };
  },

  // Crée une nouvelle réservation une fois l'avance payée (cf. pages/amateur/Paiement.jsx).
  // `donnees` vient du formulaire de la page détail terrain :
  // { terrain, date, creneau, nomComplet, telephone, avance, resteSurPlace, moyenPaiement, transactionId }
  creerReservation: async (donnees) => {
    await delaiReseau();

    const prixTotal = donnees.creneau?.prix || donnees.terrain?.prixHeure || donnees.avance * 2;

    const nouvelleReservation = {
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      terrainId: donnees.terrain?.id,
      nomTerrain: donnees.terrain?.nom,
      image: donnees.terrain?.image,
      status: 'Confirmée',
      statusBadgeClass: 'bg-emerald-100 text-emerald-700',
      acomptePaye: true,
      dateHeureCreneau: combinerDateEtHeureDebut(donnees.date, donnees.creneau.heure),
      dateTexte: formatDateTexte(donnees.date, donnees.creneau.heure),
      montantAcompte: donnees.avance,
      prixTotal,
      resteAPayer: donnees.resteSurPlace,
      moyenPaiement: donnees.moyenPaiement,
      transactionId: donnees.transactionId,
      tabCategory: 'a-venir',
    };

    // On l'ajoute en tête de la liste "Mes réservations" de l'amateur
    MOCK_RESERVATIONS_AMATEUR.unshift(nouvelleReservation);

    return nouvelleReservation;
  },
};
