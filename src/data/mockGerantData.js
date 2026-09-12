// Données Mock pour l'Espace Gérant (Tableau de bord)
import samaStadiumImg from '../assets/sama_stadium.jpg';
import ngorArenaImg from '../assets/ngor_arena.jpg';
import keurMadiorImg from '../assets/keur_madior.jpg';

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
