// Mock : indicateurs et graphiques (dashboards admin et gérant, page statistiques).

// --- Espace ADMIN ---

export const MOCK_ADMIN_STATS = [
  { id: 'terrains', label: 'Total Terrains', value: '156', trend: '+8 cette semaine' },
  { id: 'utilisateurs', label: 'Total Utilisateurs', value: '1 240', trend: '+12% cette semaine' },
  { id: 'reservations', label: 'Réservations', value: '89', trend: '+18% vs mois dernier' },
  { id: 'revenus', label: 'Revenus', value: '4.5M FCFA', trend: '+24% de croissance' },
];

export const MOCK_CROISSANCE_INSCRIPTIONS = {
  totalMois: '+18% vs mois dernier',
  data: [
    { period: 'Jan', value: 45 }, { period: 'Fév', value: 52 }, { period: 'Mar', value: 68 },
    { period: 'Avr', value: 75 }, { period: 'Mai', value: 92 }, { period: 'Juin', value: 89 },
  ],
};

export const MOCK_RESERVATIONS_VILLE = [
  { ville: 'Dakar', rawValue: 45, hexColor: '#004030' },
  { ville: 'Mermoz', rawValue: 32, hexColor: '#D4AF37' },
  { ville: 'Guédiawaye', rawValue: 28, hexColor: '#A7F3D0' },
  { ville: 'Almadies', rawValue: 25, hexColor: '#CBD5E1' },
  { ville: 'Yoff', rawValue: 18, hexColor: '#94A3B8' },
];

export const MOCK_ACTIVITE_RECENTE_ADMIN = [
  { id: 1, time: 'Il y a 5 min', description: "Nouveau terrain 'Saly Foot Arena' créé par le gérant Ibrahima Fall", category: 'Terrain', badgeClass: 'bg-[#e6f4ea] text-[#004030]' },
  { id: 2, time: 'Il y a 15 min', description: "Avis signalé sur le terrain 'Dakar Soccer' par l'utilisateur Omar Sy", category: 'Modération', badgeClass: 'bg-red-100 text-red-700' },
  { id: 3, time: 'Il y a 1 heure', description: 'Demande de validation soumise par le gérant Amadou Diouf (Elite Arena)', category: 'Gérant', badgeClass: 'bg-amber-100 text-amber-800' },
  { id: 4, time: 'Il y a 3 heures', description: 'Nouveau joueur inscrit : Fatoumata Sarr (Saint-Louis)', category: 'Inscription', badgeClass: 'bg-sky-100 text-sky-700' },
  { id: 5, time: 'Il y a 5 heures', description: 'Réservation confirmée pour RES-1092 - Montant : 30 000 FCFA', category: 'Paiement', badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200' },
];

export const MOCK_STATS_KPI_ADMIN = [
  { title: 'Taux de Conversion', value: '23%', trend: '+2% vs trimestre dernier' },
  { title: 'Temps Moyen Réservation', value: '3m 42s', trend: '-45 secondes' },
  { title: "Taux d'Annulation", value: '8%', trend: "-1.5% d'amélioration" },
  { title: 'Net Promoter Score (NPS)', value: '72', trend: 'Excellent (Basé sur 1.2k avis)' },
];

export const MOCK_STATS_PAYMENT_ADMIN = [{ name: 'Paiements', Wave: 55, OrangeMoney: 30, Free: 15 }];

export const MOCK_STATS_CITY_ADMIN = [
  { name: 'Dakar', value: 60, color: 'var(--color-vert-principal, #004030)' },
  { name: 'Thiès', value: 25, color: 'var(--color-dore, #D4AF37)' },
  { name: 'Mbour & Saly', value: 15, color: '#DEF7EC' },
];

export const MOCK_STATS_TOP_TERRAINS = [
  { rank: 1, terrain: 'Elite Arena (Dakar)', ville: 'Dakar', reservations: '342 matches', chiffre: '10 260 000 FCFA' },
  { rank: 2, terrain: 'Classic Grass (Thiès)', ville: 'Thiès', reservations: '289 matches', chiffre: '4 335 000 FCFA' },
  { rank: 3, terrain: 'Saly Beach Club (Mbour)', ville: 'Mbour', reservations: '254 matches', chiffre: '7 620 000 FCFA' },
  { rank: 4, terrain: 'Galaxy Foot (Dakar)', ville: 'Dakar', reservations: '198 matches', chiffre: '5 940 000 FCFA' },
  { rank: 5, terrain: 'Saint-Louis Stadium', ville: 'Saint-Louis', reservations: '145 matches', chiffre: '2 175 000 FCFA' },
];

// L'espace gérant (dashboard, revenus, statistiques, avis récents) est
// entièrement branché sur le vrai backend, voir services/gerantService.js.

