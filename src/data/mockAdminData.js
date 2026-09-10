// Données Mock pour l'Espace Administrateur

export const mockAdminStats = [
  {
    id: 'utilisateurs',
    label: 'Utilisateurs',
    value: '2 450',
    trend: '+12% cette semaine',
  },
  {
    id: 'gerants',
    label: 'Gérants Actifs',
    value: '87',
    trend: '+4 nouveaux',
  },
  {
    id: 'terrains',
    label: 'Terrains',
    value: '156',
    trend: '+8 cette semaine',
  },
  {
    id: 'reservations',
    label: 'Réservations',
    value: '12 340',
    trend: '+18% vs mois dernier',
  },
  {
    id: 'revenus',
    label: 'Revenus Global',
    value: '8.5M FCFA',
    trend: '+24% de croissance',
  },
];

export const mockCroissanceInscriptions = {
  totalMois: '+342 ce mois-ci',
  data: [
    { period: 'J1-3', value: 15 },
    { period: 'J4-6', value: 25 },
    { period: 'J7-9', value: 35 },
    { period: 'J10-12', value: 48 },
    { period: 'J13-15', value: 42 },
    { period: 'J16-18', value: 60 },
    { period: 'J19-21', value: 75 },
    { period: 'J22-24', value: 88 },
    { period: 'J25-27', value: 110 },
    { period: 'J28-30', value: 125 },
  ],
};

export const mockReservationsVille = [
  { ville: 'Dakar (6.2k)', rawValue: 6200, hexColor: '#004030' },
  { ville: 'Thiès (3.1k)', rawValue: 3100, hexColor: '#D4AF37' },
  { ville: 'Mbour (2.1k)', rawValue: 2100, hexColor: '#A7F3D0' },
  { ville: 'Saint-Louis (0.9k)', rawValue: 900, hexColor: '#CBD5E1' },
];

export const mockActiviteRecente = [
  {
    id: 1,
    time: 'Il y a 5 min',
    description: "Nouveau terrain 'Saly Foot Arena' créé par le gérant Ibrahima Fall",
    category: 'Terrain',
    badgeClass: 'bg-[#e6f4ea] text-[#004030]',
  },
  {
    id: 2,
    time: 'Il y a 15 min',
    description: "Avis signalé sur le terrain 'Dakar Soccer' par l'utilisateur Omar Sy",
    category: 'Modération',
    badgeClass: 'bg-red-100 text-red-700',
  },
  {
    id: 3,
    time: 'Il y a 1 heure',
    description: 'Demande de validation soumise par le gérant Amadou Diouf (Elite Arena)',
    category: 'Gérant',
    badgeClass: 'bg-amber-100 text-amber-800',
  },
  {
    id: 4,
    time: 'Il y a 3 heures',
    description: 'Nouveau joueur inscrit : Fatoumata Sarr (Saint-Louis)',
    category: 'Inscription',
    badgeClass: 'bg-sky-100 text-sky-700',
  },
  {
    id: 5,
    time: 'Il y a 5 heures',
    description: 'Réservation confirmée pour RES-1092 - Montant : 30 000 FCFA',
    category: 'Paiement',
    badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
];

export const mockAdminProfile = {
  name: 'Alioune Diop',
  role: 'Super Admin',
  initials: 'AD',
};
