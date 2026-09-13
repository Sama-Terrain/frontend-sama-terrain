import api from './api';

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
  if (abonnement.dateFinEssai && new Date(abonnement.dateFinEssai).getTime() > maintenant) {
    return 'essai';
  }

  return 'expire';
}

// Nombre de jours entiers restants avant la fin de l'essai (0 si déjà terminé)
export function joursRestantsEssai(abonnement) {
  if (!abonnement.dateFinEssai) return 0;
  const millisecondesRestantes = new Date(abonnement.dateFinEssai).getTime() - Date.now();
  return Math.max(0, Math.ceil(millisecondesRestantes / (1000 * 60 * 60 * 24)));
}

/**
 * Service de gestion de l'abonnement gérant.
 * Appelle désormais le vrai backend Django (voir backend/gerant/ et backend/paiements/).
 */
export const abonnementService = {
  async getAbonnement() {
    const { data } = await api.get('/gerant/abonnement/');
    const abonnement = {
      statut: data.statut,
      dateFinEssai: data.date_fin_essai,
      dateFinAbonnement: data.date_fin_abonnement,
      prixMensuel: data.prix_mensuel,
    };
    return { ...abonnement, statutEffectif: calculerStatutEffectif(abonnement) };
  },

  // Démarre le paiement PayTech de l'abonnement mensuel : redirige le
  // navigateur vers la page de paiement externe (Wave/Orange Money réels).
  // La confirmation réelle arrivera de façon asynchrone via l'IPN PayTech
  // (voir AbonnementIPNView), donc on ne marque rien comme "payé" ici.
  async renouvelerAbonnement() {
    try {
      const { data } = await api.post('/paiements/abonnement/initier/');
      window.location.href = data.payment_url;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Impossible de démarrer le paiement. Réessayez.",
      };
    }
  },
};
