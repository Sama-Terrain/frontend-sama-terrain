// Mock : abonnement gérant.
//
// Règle métier :
// - Après validation de son compte par l'admin, le gérant a 7 jours d'essai gratuit.
// - Passé ce délai, il doit payer 7 500 FCFA/mois (via PayDunya, qui agrège Wave et
//   Orange Money) pour continuer à accéder à son tableau de bord.
// - Si l'abonnement expire sans renouvellement, l'accès est suspendu.

export const PRIX_ABONNEMENT_MENSUEL = 7500;
export const DUREE_ESSAI_JOURS = 7;

// Petit utilitaire pour fabriquer une date à N jours d'aujourd'hui (passé ou futur)
function dansNJours(nombreDeJours) {
  const date = new Date();
  date.setDate(date.getDate() + nombreDeJours);
  return date.toISOString();
}

// Abonnement du compte de test "gérant" (cf. mocks/gerants.js -> MOCK_GERANT).
// Par défaut : période d'essai encore active (se termine dans 4 jours).
// Change `statut` ci-dessous pour tester les autres cas ('expire' ou 'actif').
export const MOCK_ABONNEMENT_GERANT = {
  gerantId: 'user-gerant-1',
  // 'essai'  -> période d'essai de 7 jours en cours
  // 'actif'  -> abonnement payé et en cours de validité
  // 'expire' -> essai ou abonnement terminé, accès suspendu
  statut: 'essai',
  dateDebutEssai: dansNJours(-3), // essai commencé il y a 3 jours
  dateFinEssai: dansNJours(4), // il reste 4 jours d'essai
  dateFinAbonnement: null, // renseigné uniquement quand statut = 'actif'
  prixMensuel: PRIX_ABONNEMENT_MENSUEL,
  moyenPaiement: null, // 'Wave' | 'Orange Money' une fois payé
};

// Historique des paiements d'abonnement (page future "Facturation")
export const MOCK_PAIEMENTS_ABONNEMENT = [
  // Vide pour un gérant encore en période d'essai qui n'a jamais payé.
  // Exemple de ligne une fois l'abonnement payé :
  // { id: 'AB-0001', date: '05 Nov 2026', montant: 7500, moyenPaiement: 'Wave', statut: 'Payé' },
];
