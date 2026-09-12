// Données Mock pour l'Espace Gérant (Tableau de bord)
import samaStadiumImg from '../assets/sama_stadium.jpg';
import ngorArenaImg from '../assets/ngor_arena.jpg';
import keurMadiorImg from '../assets/keur_madior.jpg';
import dakarFootImg from '../assets/dakar_foot.jpg';
import footDorImg from '../assets/foot_dor.jpg';
import yoffMunicipalImg from '../assets/yoff_municipal.jpg';

export const mockGerantProfile = {
  name: 'Amadou Diouf',
  role: 'Gérant',
  initials: 'A',
};

export const mockGerantStats = [
  {
    id: 'reservations-jour',
    label: "Réservations aujourd'hui",
    value: '12',
    trend: '+3 match de plus',
    trendDirection: 'up',
  },
  {
    id: 'revenus-mois',
    label: 'Revenus du mois',
    value: '450K FCFA',
    trend: '+12% vs mois dernier',
    trendDirection: 'up',
  },
  {
    id: 'taux-occupation',
    label: "Taux d'occupation",
    value: '78%',
    trend: '-2% ce week-end',
    trendDirection: 'down',
  },
  {
    id: 'avis-moyen',
    label: 'Avis moyen',
    value: '4.6 / 5',
    trend: 'Basé sur 124 retours',
    trendDirection: 'up',
  },
];

// Revenus des 30 derniers jours (en FCFA)
export const mockRevenus30Jours = {
  total: '2 450 000 FCFA',
  data: [
    { jour: 'J1', montant: 62000 }, { jour: 'J2', montant: 65000 }, { jour: 'J3', montant: 70000 },
    { jour: 'J4', montant: 68000 }, { jour: 'J5', montant: 72000 }, { jour: 'J6', montant: 66000 },
    { jour: 'J7', montant: 69000 }, { jour: 'J8', montant: 74000 }, { jour: 'J9', montant: 80000 },
    { jour: 'J10', montant: 78000 }, { jour: 'J11', montant: 82000 }, { jour: 'J12', montant: 79000 },
    { jour: 'J13', montant: 85000 }, { jour: 'J14', montant: 83000 }, { jour: 'J15', montant: 88000 },
    { jour: 'J16', montant: 95000 }, { jour: 'J17', montant: 90000 }, { jour: 'J18', montant: 93000 },
    { jour: 'J19', montant: 97000 }, { jour: 'J20', montant: 100000 }, { jour: 'J21', montant: 98000 },
    { jour: 'J22', montant: 104000 }, { jour: 'J23', montant: 108000 }, { jour: 'J24', montant: 106000 },
    { jour: 'J25', montant: 112000 }, { jour: 'J26', montant: 118000 }, { jour: 'J27', montant: 115000 },
    { jour: 'J28', montant: 122000 }, { jour: 'J29', montant: 128000 }, { jour: 'J30', montant: 125000 },
  ],
};

// Liste des terrains gérés par le gérant connecté (page "Mes terrains")
export const mockMesTerrains = [
  {
    id: 1,
    nom: 'Terrain A - Elite Arena',
    localisation: "Mermoz, Dakar (Derrière l'école de police)",
    image: samaStadiumImg,
    actif: true,
    reservationsMois: 48,
    revenusMois: '720 000 FCFA',
    note: 4.8,
  },
  {
    id: 2,
    nom: 'Terrain B - Classic Grass',
    localisation: "Mermoz, Dakar (Derrière l'école de police)",
    image: ngorArenaImg,
    actif: true,
    reservationsMois: 32,
    revenusMois: '480 000 FCFA',
    note: 4.4,
  },
  {
    id: 3,
    nom: 'Terrain C - Saly Beach',
    localisation: 'Saly Carrefour, Mbour',
    image: keurMadiorImg,
    actif: false,
    reservationsMois: 0,
    revenusMois: '0 FCFA',
    note: null,
  },
];

// Détail complet d'un terrain (page "Detail Terrain"), indexé par id de terrain (cf. mockMesTerrains)
export const mockTerrainDetails = {
  1: {
    id: 1,
    nom: 'Elite Arena',
    ville: 'Dakar',
    adresse: 'Route de Ouakam, Dakar',
    type: 'Foot à 5',
    surface: 'Synthétique',
    capacite: '10 joueurs',
    prixHeure: '15 000 FCFA',
    horaires: '08:00 à 23:00',
    equipements: ['Vestiaires', 'Éclairage nocturne', 'Douches'],
    description:
      "Elite Arena est un terrain de football synthétique moderne situé au cœur de Ouakam, offrant une expérience de jeu exceptionnelle grâce à sa surface de dernière génération et son éclairage LED nocturne. Idéal pour les matchs entre amis ou les tournois entre équipes, le terrain dispose de vestiaires spacieux et de douches pour un confort optimal après l'effort. Réservez dès maintenant pour profiter d'une ambiance conviviale et professionnelle, sept jours sur sept.",
    photos: [samaStadiumImg, ngorArenaImg, keurMadiorImg, footDorImg, dakarFootImg, yoffMunicipalImg],
    stats: {
      reservationsMois: 142,
      reservationsTrend: '+12% vs mois dernier',
      revenusMois: '2.13M',
      revenusSousTitre: 'FCFA au total',
      noteMoyenne: 4.8,
      tauxOccupation: 78,
    },
  },
  2: {
    id: 2,
    nom: 'Classic Grass',
    ville: 'Dakar',
    adresse: "Derrière l'école de police, Mermoz",
    type: 'Foot à 6',
    surface: 'Gazon naturel',
    capacite: '12 joueurs',
    prixHeure: '15 000 FCFA',
    horaires: '08:00 à 23:00',
    equipements: ['Vestiaires', 'Éclairage nocturne'],
    description:
      "Classic Grass propose un gazon naturel bien entretenu au cœur de Mermoz, apprécié pour son ambiance conviviale et sa proximité avec le centre-ville. Un bon compromis entre confort de jeu et accessibilité pour vos matchs entre amis.",
    photos: [ngorArenaImg, samaStadiumImg, footDorImg, dakarFootImg],
    stats: {
      reservationsMois: 32,
      reservationsTrend: '+5% vs mois dernier',
      revenusMois: '480K',
      revenusSousTitre: 'FCFA au total',
      noteMoyenne: 4.4,
      tauxOccupation: 61,
    },
  },
  3: {
    id: 3,
    nom: 'Saly Beach',
    ville: 'Mbour',
    adresse: 'Saly Carrefour, Mbour',
    type: 'Foot à 5',
    surface: 'Synthétique',
    capacite: '10 joueurs',
    prixHeure: '15 000 FCFA',
    horaires: '08:00 à 23:00',
    equipements: ['Vestiaires', 'Douches'],
    description:
      "Saly Beach est un terrain récemment ajouté à Sama-Terrain, situé à Saly Carrefour. Il est actuellement inactif en attendant sa mise en service par le gérant.",
    photos: [keurMadiorImg, yoffMunicipalImg],
    stats: {
      reservationsMois: 0,
      reservationsTrend: 'Pas encore de réservation',
      revenusMois: '0',
      revenusSousTitre: 'FCFA au total',
      noteMoyenne: 0,
      tauxOccupation: 0,
    },
  },
};

export const mockProchainesReservations = [
  { id: 1, joueur: 'Moussa Fall', initiales: 'MF', date: '18 Juin 2024', creneau: '18:00 - 19:00', statut: 'Confirmée', statutBadgeClass: 'bg-emerald-100 text-emerald-700', montant: 15000 },
  { id: 2, joueur: 'Ibrahima Sarr', initiales: 'IS', date: '18 Juin 2024', creneau: '20:00 - 21:00', statut: 'En attente', statutBadgeClass: 'bg-[#fed7aa] text-[#92400e]', montant: 15000 },
  { id: 3, joueur: 'Cheikh Ndiaye', initiales: 'CN', date: '19 Juin 2024', creneau: '17:00 - 18:00', statut: 'Confirmée', statutBadgeClass: 'bg-emerald-100 text-emerald-700', montant: 15000 },
  { id: 4, joueur: 'Omar Ba', initiales: 'OB', date: '20 Juin 2024', creneau: '19:00 - 20:00', statut: 'Confirmée', statutBadgeClass: 'bg-emerald-100 text-emerald-700', montant: 15000 },
  { id: 5, joueur: 'Alassane Diallo', initiales: 'AD', date: '21 Juin 2024', creneau: '21:00 - 22:00', statut: 'En attente', statutBadgeClass: 'bg-[#fed7aa] text-[#92400e]', montant: 15000 },
];

export const mockAvisRecents = [
  {
    id: 1,
    nom: 'Aminata Diagne',
    initiales: 'AD',
    rating: 5,
    date: '15 Juin 2024',
    commentaire: "Excellent terrain, bien entretenu et l'éclairage nocturne est vraiment top. Les vestiaires sont propres. Je recommande vivement !",
  },
  {
    id: 2,
    nom: 'Fatou Sow',
    initiales: 'FS',
    rating: 4,
    date: '10 Juin 2024',
    commentaire: 'Belle surface synthétique, agréable pour jouer. Le parking pourrait être un peu plus grand mais sinon très satisfait.',
  },
  {
    id: 3,
    nom: 'Khadija Mbaye',
    initiales: 'KM',
    rating: 5,
    date: '5 Juin 2024',
    commentaire: 'Ambiance conviviale, personnel accueillant et terrain toujours impeccable. On y revient chaque semaine avec les amis !',
  },
];

// Statuts possibles : 'Confirmé', 'Annulé', 'Terminé' (mêmes classes que le pattern déjà utilisé côté amateur)
export const mockReservationsRecentes = [
  {
    id: 'RES-9421',
    terrain: 'Terrain A (Elite Arena)',
    client: 'Abdoulaye Sow',
    creneau: 'Demain, 18:00 - 20:00',
    montant: 30000,
    statut: 'Confirmé',
    statutBadgeClass: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'RES-9420',
    terrain: 'Terrain B (Classic Grass)',
    client: 'Cheikh Tidiane',
    creneau: 'Demain, 20:00 - 21:00',
    montant: 15000,
    statut: 'Annulé',
    statutBadgeClass: 'bg-red-100 text-red-700',
  },
  {
    id: 'RES-9419',
    terrain: 'Terrain A (Elite Arena)',
    client: 'Omar Fall',
    creneau: "Aujourd'hui, 17:00 - 18:00",
    montant: 15000,
    statut: 'Confirmé',
    statutBadgeClass: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'RES-9418',
    terrain: 'Terrain A (Elite Arena)',
    client: 'Idrissa Gadiaga',
    creneau: 'Hier, 19:00 - 21:00',
    montant: 30000,
    statut: 'Terminé',
    statutBadgeClass: 'bg-gray-100 text-gray-700',
  },
  {
    id: 'RES-9417',
    terrain: 'Terrain B (Classic Grass)',
    client: 'Fatoumata Bâ',
    creneau: 'Hier, 16:00 - 17:00',
    montant: 15000,
    statut: 'Annulé',
    statutBadgeClass: 'bg-red-100 text-red-700',
  },
];
