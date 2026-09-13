// Mock : paiements. Tous les paiements réels passeront par PayDunya (qui agrège
// Wave et Orange Money) — ici on simule uniquement le résultat de ces paiements.

export const MOYENS_PAIEMENT = ['Wave', 'Orange Money', 'Carte Bancaire'];

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
