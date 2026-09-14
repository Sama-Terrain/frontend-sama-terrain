// Mock : avis affichés publiquement sur l'accueil (témoignages, pas liés à un
// terrain précis). La modération admin et les avis par terrain sont déjà
// branchés sur le vrai backend, voir services/adminService.js et avisService.js.

// Avis affichés publiquement sur la page détail d'un terrain
export const MOCK_AVIS = [
  { id: 1, nom: 'Amadou Diallo', role: 'Capitaine FC Almadies', initiales: 'AD', note: 5, date: '15 Oct 2024', commentaire: 'Excellent terrain, bien entretenu et éclairage parfait pour les matchs en soirée. Je recommande vivement !' },
  { id: 2, nom: 'Fatou Sow', role: 'Responsable Tournoi Amical', initiales: 'FS', note: 4, date: '10 Oct 2024', commentaire: 'Très bon complexe, vestiaires propres. Seul bémole, le parking était un peu plein ce soir-là.' },
  { id: 3, nom: 'Moussa Ndiaye', role: 'Joueur Régulier', initiales: 'MN', note: 5, date: '5 Oct 2024', commentaire: 'Le meilleur terrain de mini-foot des Almadies. Pelouse synthétique de qualité, on reviendra !' },
];
