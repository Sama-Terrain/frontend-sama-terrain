// Mock : réservations côté gérant (réservations reçues sur ses terrains).
// Le côté amateur ("mes réservations") est déjà branché sur le vrai backend
// (voir services/reservationService.js) et n'a donc plus besoin de mocks ici.

// Réservations vues côté gérant : synthèse "récentes" (dashboard) et vue complète (page "Réservations")
export const MOCK_RESERVATIONS_RECENTES_GERANT = [
  { id: 'RES-9421', terrain: 'Terrain A (Elite Arena)', client: 'Abdoulaye Sow', creneau: 'Demain, 18:00 - 20:00', montant: 30000, statut: 'Confirmé', statutBadgeClass: 'bg-emerald-100 text-emerald-700' },
  { id: 'RES-9420', terrain: 'Terrain B (Classic Grass)', client: 'Cheikh Tidiane', creneau: 'Demain, 20:00 - 21:00', montant: 15000, statut: 'Annulé', statutBadgeClass: 'bg-red-100 text-red-700' },
  { id: 'RES-9419', terrain: 'Terrain A (Elite Arena)', client: 'Omar Fall', creneau: "Aujourd'hui, 17:00 - 18:00", montant: 15000, statut: 'Confirmé', statutBadgeClass: 'bg-emerald-100 text-emerald-700' },
  { id: 'RES-9418', terrain: 'Terrain A (Elite Arena)', client: 'Idrissa Gadiaga', creneau: 'Hier, 19:00 - 21:00', montant: 30000, statut: 'Terminé', statutBadgeClass: 'bg-gray-100 text-gray-700' },
  { id: 'RES-9417', terrain: 'Terrain B (Classic Grass)', client: 'Fatoumata Bâ', creneau: 'Hier, 16:00 - 17:00', montant: 15000, statut: 'Annulé', statutBadgeClass: 'bg-red-100 text-red-700' },
];

export const MOCK_RESERVATIONS_GERANT = [
  { id: 'RES-9421', client: 'Moustapha Ndiaye', terrain: 'Terrain A (Elite Arena)', date: '29 Nov 2026', creneau: '18:00 - 20:00', montant: 30000, statut: 'Confirmée', statutBadgeClass: 'bg-emerald-100 text-emerald-700' },
  { id: 'RES-9420', client: 'Fatoumata Diop', terrain: 'Terrain B (Classic Grass)', date: '29 Nov 2026', creneau: '20:00 - 21:00', montant: 15000, statut: 'Annulée', statutBadgeClass: 'bg-red-100 text-red-700' },
  { id: 'RES-9419', client: 'Abdoulaye Diallo', terrain: 'Terrain A (Elite Arena)', date: '28 Nov 2026', creneau: '17:00 - 18:00', montant: 15000, statut: 'Confirmée', statutBadgeClass: 'bg-emerald-100 text-emerald-700' },
  { id: 'RES-9418', client: 'Khady Sène', terrain: 'Terrain C (Saly Beach)', date: '28 Nov 2026', creneau: '16:00 - 18:00', montant: 30000, statut: 'Annulée', statutBadgeClass: 'bg-red-100 text-red-700' },
  { id: 'RES-9417', client: 'Cheikh Tidiane Sy', terrain: 'Terrain A (Elite Arena)', date: '27 Nov 2026', creneau: '19:00 - 21:00', montant: 30000, statut: 'Confirmée', statutBadgeClass: 'bg-emerald-100 text-emerald-700' },
  { id: 'RES-9416', client: 'Awa Gueye', terrain: 'Terrain B (Classic Grass)', date: '27 Nov 2026', creneau: '18:00 - 19:00', montant: 15000, statut: 'Confirmée', statutBadgeClass: 'bg-emerald-100 text-emerald-700' },
  { id: 'RES-9415', client: 'Ousmane Sonko', terrain: 'Terrain A (Elite Arena)', date: '26 Nov 2026', creneau: '20:00 - 22:00', montant: 30000, statut: 'Annulée', statutBadgeClass: 'bg-red-100 text-red-700' },
  { id: 'RES-9414', client: 'Babacar Faye', terrain: 'Terrain C (Saly Beach)', date: '25 Nov 2026', creneau: '15:00 - 16:00', montant: 15000, statut: 'Confirmée', statutBadgeClass: 'bg-emerald-100 text-emerald-700' },
];

export const MOCK_RESERVATIONS_ACTIVITE = {
  totalMois: 156,
  tauxValidation: 94,
  periodeLabel: '25 Nov - 01 Déc 2026',
};

export const MOCK_PROCHAINES_RESERVATIONS = [
  { id: 1, joueur: 'Moussa Fall', initiales: 'MF', date: '18 Juin 2024', creneau: '18:00 - 19:00', statut: 'Confirmée', statutBadgeClass: 'bg-emerald-100 text-emerald-700', montant: 15000 },
  { id: 2, joueur: 'Ibrahima Sarr', initiales: 'IS', date: '18 Juin 2024', creneau: '20:00 - 21:00', statut: 'En attente', statutBadgeClass: 'bg-[#fed7aa] text-[#92400e]', montant: 15000 },
  { id: 3, joueur: 'Cheikh Ndiaye', initiales: 'CN', date: '19 Juin 2024', creneau: '17:00 - 18:00', statut: 'Confirmée', statutBadgeClass: 'bg-emerald-100 text-emerald-700', montant: 15000 },
  { id: 4, joueur: 'Omar Ba', initiales: 'OB', date: '20 Juin 2024', creneau: '19:00 - 20:00', statut: 'Confirmée', statutBadgeClass: 'bg-emerald-100 text-emerald-700', montant: 15000 },
  { id: 5, joueur: 'Alassane Diallo', initiales: 'AD', date: '21 Juin 2024', creneau: '21:00 - 22:00', statut: 'En attente', statutBadgeClass: 'bg-[#fed7aa] text-[#92400e]', montant: 15000 },
];
