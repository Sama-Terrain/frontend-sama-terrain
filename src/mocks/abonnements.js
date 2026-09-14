// Constantes de l'abonnement gérant (identiques au backend, voir
// backend/paiements/models.py -> PRIX_ABONNEMENT_MENSUEL, et la règle des 7
// jours d'essai dans backend/admin_panel/views.py -> ValiderGerantView).
//
// Règle métier :
// - Après validation de son compte par l'admin, le gérant a 7 jours d'essai gratuit.
// - Passé ce délai, il doit payer 7 500 FCFA/mois (via PayTech, qui agrège Wave et
//   Orange Money) pour continuer à accéder à son tableau de bord.
// - Si l'abonnement expire sans renouvellement, l'accès est suspendu.
//
// L'état réel de l'abonnement (statut, dates) est branché sur le vrai
// backend, voir services/abonnementService.js.
export const PRIX_ABONNEMENT_MENSUEL = 7500;
export const DUREE_ESSAI_JOURS = 7;
