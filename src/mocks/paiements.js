// Mock : paiements. Tous les paiements réels passeront par PayDunya (qui agrège
// Wave et Orange Money) — ici on simule uniquement le résultat de ces paiements.

export const MOYENS_PAIEMENT = ['Wave', 'Orange Money', 'Carte Bancaire'];

// Historique des paiements reçus par un gérant (page "Revenus")
export const MOCK_HISTORIQUE_PAIEMENTS = [
  { id: 1, date: "Aujourd'hui, 14:32", client: 'Malick Fall', terrain: 'Terrain A - Elite Arena', mode: 'Wave', montant: 15000, statut: 'Succès' },
  { id: 2, date: "Aujourd'hui, 11:15", client: 'Khady Syll', terrain: 'Terrain B - Classic Grass', mode: 'Orange Money', montant: 15000, statut: 'Succès' },
  { id: 3, date: 'Hier, 21:03', client: 'Ibrahima Ndiaye', terrain: 'Terrain A - Elite Arena', mode: 'Wave', montant: 30000, statut: 'Succès' },
  { id: 4, date: 'Hier, 18:40', client: 'Amy Collé', terrain: 'Terrain C - Saly Beach', mode: 'Carte Bancaire', montant: 30000, statut: 'Succès' },
  { id: 5, date: '27 Nov, 16:12', client: 'Modou Lô', terrain: 'Terrain A - Elite Arena', mode: 'Orange Money', montant: 15000, statut: 'Succès' },
];

// Tickets (réservations payées) reconnus par le scanner du gérant, indexés par code
export const MOCK_TICKETS_SCANNABLES = {
  'RES-9421-SND': { code: 'RES-9421-SND', client: 'Elhadji Diouf', terrain: 'Terrain A (Elite Arena)', creneau: 'Ce soir, 18h00 - 20h00', montantRestant: 15000 },
  'RES-9418-SND': { code: 'RES-9418-SND', client: 'Khady Sène', terrain: 'Terrain C (Saly Beach)', creneau: 'Ce soir, 16h00 - 18h00', montantRestant: 30000 },
};

export const MOCK_DERNIERES_VALIDATIONS = [
  { id: 1, nom: 'Moustapha Ndiaye', sousTitre: 'Parcelles • 18h-20h • Il y a 2 min', statut: 'Validé', statutBadgeClass: 'bg-emerald-100 text-emerald-700' },
  { id: 2, nom: 'Fatou Kiné Diop', sousTitre: 'Terrain B • 16h-17h • Il y a 10 min', statut: 'Expiré', statutBadgeClass: 'bg-red-100 text-red-700' },
  { id: 3, nom: 'Alioune Sarr', sousTitre: 'Elite Arena • 14h-16h • Il y a 30 min', statut: 'Déjà utilisé', statutBadgeClass: 'bg-gray-100 text-gray-600' },
  { id: 4, nom: 'Abdou Ndoye', sousTitre: 'Saly Beach • 20h-21h • Il y a 1h', statut: 'Validé', statutBadgeClass: 'bg-emerald-100 text-emerald-700' },
  { id: 5, nom: 'Soda Mama', sousTitre: 'Terrain A • 10h-12h • Il y a 2h', statut: 'Validé', statutBadgeClass: 'bg-emerald-100 text-emerald-700' },
];
