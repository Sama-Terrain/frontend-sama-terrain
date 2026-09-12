import { delaiReseau } from '../utils/delaiReseau';

/**
 * Service de paiement.
 * Aujourd'hui : simule un paiement réussi après un court délai.
 * Demain : ce sera un vrai appel à PayDunya (qui agrège Wave et Orange Money) —
 * le reste de l'application (pages, hooks) n'aura rien à changer.
 */
export const paiementService = {
  async effectuerPaiement({ montant, moyenPaiement }) {
    await delaiReseau();

    // Pas de vraie passerelle de paiement branchée pour le moment : on simule
    // toujours un succès, avec un identifiant de transaction factice.
    return {
      success: true,
      transactionId: `PD-${Date.now()}`,
      montant,
      moyenPaiement,
    };
  },
};
