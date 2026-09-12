import { MOCK_ABONNEMENT_GERANT, MOCK_PAIEMENTS_ABONNEMENT, PRIX_ABONNEMENT_MENSUEL } from '../mocks/abonnements';
import { delaiReseau } from '../utils/delaiReseau';

/**
 * Calcule le statut RÉEL de l'abonnement à l'instant présent, à partir des dates
 * stockées (plutôt que de faire confiance au champ `statut` qui peut être périmé).
 * Retourne : 'essai' | 'actif' | 'expire'.
 */
export function calculerStatutEffectif(abonnement) {
  const maintenant = Date.now();

  // Abonnement payé et toujours dans sa période de validité
  if (abonnement.statut === 'actif' && abonnement.dateFinAbonnement) {
    if (new Date(abonnement.dateFinAbonnement).getTime() > maintenant) {
      return 'actif';
    }
    return 'expire';
  }

  // Sinon, on regarde si l'essai gratuit de 7 jours est encore en cours
  if (new Date(abonnement.dateFinEssai).getTime() > maintenant) {
    return 'essai';
  }

  return 'expire';
}

// Nombre de jours entiers restants avant la fin de l'essai (0 si déjà terminé)
export function joursRestantsEssai(abonnement) {
  const millisecondesRestantes = new Date(abonnement.dateFinEssai).getTime() - Date.now();
  return Math.max(0, Math.ceil(millisecondesRestantes / (1000 * 60 * 60 * 24)));
}

/**
 * Service de gestion de l'abonnement gérant.
 * Aujourd'hui : lit/modifie l'objet mock en mémoire.
 * Demain : GET/POST /api/gerant/abonnement, avec le paiement réel géré par PayDunya.
 */
export const abonnementService = {
  async getAbonnement() {
    await delaiReseau();
    return { ...MOCK_ABONNEMENT_GERANT, statutEffectif: calculerStatutEffectif(MOCK_ABONNEMENT_GERANT) };
  },

  // Simule le paiement de l'abonnement mensuel via PayDunya (Wave ou Orange Money)
  async renouvelerAbonnement(moyenPaiement) {
    await delaiReseau();

    const dateFinAbonnement = new Date();
    dateFinAbonnement.setMonth(dateFinAbonnement.getMonth() + 1);

    MOCK_ABONNEMENT_GERANT.statut = 'actif';
    MOCK_ABONNEMENT_GERANT.dateFinAbonnement = dateFinAbonnement.toISOString();
    MOCK_ABONNEMENT_GERANT.moyenPaiement = moyenPaiement;

    MOCK_PAIEMENTS_ABONNEMENT.unshift({
      id: `AB-${Date.now()}`,
      date: new Date().toLocaleDateString('fr-FR'),
      montant: PRIX_ABONNEMENT_MENSUEL,
      moyenPaiement,
      statut: 'Payé',
    });

    return { success: true, abonnement: { ...MOCK_ABONNEMENT_GERANT } };
  },

  async getHistoriquePaiementsAbonnement() {
    await delaiReseau();
    return MOCK_PAIEMENTS_ABONNEMENT;
  },
};
