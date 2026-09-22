import api from './api';

/**
 * Service de paiement.
 * Appelle le vrai backend Django, qui lui-même appelle PayTech (agrégateur
 * Wave / Orange Money) pour obtenir une URL de paiement réelle.
 */
export const paiementService = {
  // Demande une URL de paiement PayTech pour l'avance d'une réservation.
  // L'appelant doit ensuite rediriger le navigateur vers cette URL
  // (window.location.href = payment_url) : PayTech n'est pas un popup,
  // c'est une vraie page externe où l'utilisateur choisit Wave/Orange Money.
  async initierPaiement(reservationId, moyenPaiement) {
    try {
      const { data } = await api.post('/paiements/initier/', {
        reservation: reservationId,
        moyen_paiement: moyenPaiement,
      });
      return { success: true, paymentUrl: data.payment_url };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Impossible de démarrer le paiement. Réessayez.",
      };
    }
  },
};
