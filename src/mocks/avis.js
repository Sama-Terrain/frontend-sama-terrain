// Mock : avis laissés par les amateurs (affichage public, modération admin, avis reçus par un gérant).

// Avis affichés publiquement sur la page détail d'un terrain
export const MOCK_AVIS = [
  { id: 1, nom: 'Amadou Diallo', role: 'Capitaine FC Almadies', initiales: 'AD', note: 5, date: '15 Oct 2024', commentaire: 'Excellent terrain, bien entretenu et éclairage parfait pour les matchs en soirée. Je recommande vivement !' },
  { id: 2, nom: 'Fatou Sow', role: 'Responsable Tournoi Amical', initiales: 'FS', note: 4, date: '10 Oct 2024', commentaire: 'Très bon complexe, vestiaires propres. Seul bémole, le parking était un peu plein ce soir-là.' },
  { id: 3, nom: 'Moussa Ndiaye', role: 'Joueur Régulier', initiales: 'MN', note: 5, date: '5 Oct 2024', commentaire: 'Le meilleur terrain de mini-foot des Almadies. Pelouse synthétique de qualité, on reviendra !' },
];

// Avis en attente / approuvés dans l'espace admin (page "Modération des avis")
export const MOCK_AVIS_MODERATION = [
  { id: 1, initial: 'C', name: 'Cheikh Tidiane', terrain: 'Elite Arena', rating: 1, comment: "Le terrain était glissant et l'éclairage ne fonctionnait pas pendant la moitié du match.", date: 'Hier, 20:30', status: 'pending' },
  { id: 2, initial: 'F', name: 'Fatoumata Bâ', terrain: 'Classic Grass', rating: 2, comment: 'Réservation annulée sans remboursement. Gérant injoignable par téléphone !', date: '28 Nov 2026', status: 'pending' },
  { id: 3, initial: 'O', name: 'Omar Fall', terrain: 'Saly Beach', rating: 1, comment: 'Pire expérience, le gérant a reloué notre créneau à un autre groupe sous nos yeux.', date: '27 Nov 2026', status: 'pending' },
  { id: 4, initial: 'A', name: 'Amadou Diouf', terrain: 'Dakar Soccer Center', rating: 5, comment: 'Excellent terrain, bien entretenu et très bon accueil du gérant.', date: '26 Nov 2026', status: 'approved' },
  { id: 5, initial: 'K', name: 'Khady Sène', terrain: 'Mermoz Stadium', rating: 4, comment: 'Bon terrain, mais les vestiaires pourraient être plus propres.', date: '25 Nov 2026', status: 'approved' },
  { id: 6, initial: 'I', name: 'Ibrahima Sy', terrain: 'Guédiawaye Field', rating: 3, comment: 'Terrain correct, mais un peu cher pour la qualité.', date: '24 Nov 2026', status: 'pending' },
  { id: 7, initial: 'M', name: 'Mariama Ba', terrain: 'Almadies Arena', rating: 2, comment: 'Réservation compliquée et terrain en mauvais état.', date: '23 Nov 2026', status: 'pending' },
  { id: 8, initial: 'P', name: 'Pape Mbaye', terrain: 'Yoff Municipal', rating: 4, comment: 'Très bon rapport qualité-prix, je recommande.', date: '22 Nov 2026', status: 'pending' },
];

// Avis reçus par un gérant sur l'un de ses terrains (page "Détail Terrain" gérant)
export const MOCK_AVIS_GERANT = [
  { id: 1, nom: 'Aminata Diagne', initiales: 'AD', rating: 5, date: '15 Juin 2024', commentaire: "Excellent terrain, bien entretenu et l'éclairage nocturne est vraiment top. Les vestiaires sont propres. Je recommande vivement !" },
  { id: 2, nom: 'Fatou Sow', initiales: 'FS', rating: 4, date: '10 Juin 2024', commentaire: 'Belle surface synthétique, agréable pour jouer. Le parking pourrait être un peu plus grand mais sinon très satisfait.' },
  { id: 3, nom: 'Khadija Mbaye', initiales: 'KM', rating: 5, date: '5 Juin 2024', commentaire: 'Ambiance conviviale, personnel accueillant et terrain toujours impeccable. On y revient chaque semaine avec les amis !' },
];
