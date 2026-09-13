// Mock : réservations "récentes" affichées sur le tableau de bord gérant
// (widget résumé). Le reste (liste complète, activité, prochaines
// réservations) est déjà branché sur le vrai backend, voir gerantService.js.
export const MOCK_RESERVATIONS_RECENTES_GERANT = [
  { id: 'RES-9421', terrain: 'Terrain A (Elite Arena)', client: 'Abdoulaye Sow', creneau: 'Demain, 18:00 - 20:00', montant: 30000, statut: 'Confirmé', statutBadgeClass: 'bg-emerald-100 text-emerald-700' },
  { id: 'RES-9420', terrain: 'Terrain B (Classic Grass)', client: 'Cheikh Tidiane', creneau: 'Demain, 20:00 - 21:00', montant: 15000, statut: 'Annulé', statutBadgeClass: 'bg-red-100 text-red-700' },
  { id: 'RES-9419', terrain: 'Terrain A (Elite Arena)', client: 'Omar Fall', creneau: "Aujourd'hui, 17:00 - 18:00", montant: 15000, statut: 'Confirmé', statutBadgeClass: 'bg-emerald-100 text-emerald-700' },
  { id: 'RES-9418', terrain: 'Terrain A (Elite Arena)', client: 'Idrissa Gadiaga', creneau: 'Hier, 19:00 - 21:00', montant: 30000, statut: 'Terminé', statutBadgeClass: 'bg-gray-100 text-gray-700' },
  { id: 'RES-9417', terrain: 'Terrain B (Classic Grass)', client: 'Fatoumata Bâ', creneau: 'Hier, 16:00 - 17:00', montant: 15000, statut: 'Annulé', statutBadgeClass: 'bg-red-100 text-red-700' },
];
