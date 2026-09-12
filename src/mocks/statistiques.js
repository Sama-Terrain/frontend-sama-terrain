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

// --- Espace GÉRANT ---

export const MOCK_GERANT_STATS = [
  { id: 'reservations-jour', label: "Réservations aujourd'hui", value: '12', trend: '+3 match de plus', trendDirection: 'up' },
  { id: 'revenus-mois', label: 'Revenus du mois', value: '450K FCFA', trend: '+12% vs mois dernier', trendDirection: 'up' },
  { id: 'taux-occupation', label: "Taux d'occupation", value: '78%', trend: '-2% ce week-end', trendDirection: 'down' },
  { id: 'avis-moyen', label: 'Avis moyen', value: '4.6 / 5', trend: 'Basé sur 124 retours', trendDirection: 'up' },
];

export const MOCK_REVENUS_30_JOURS = {
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

export const MOCK_REVENUS_STATS = [
  { id: 'revenus-mois', label: 'Revenus ce mois', value: '650 000 FCFA', trend: '+12% vs mois dernier', trendDirection: 'up' },
  { id: 'revenus-hier', label: 'Revenus hier', value: '28 000 FCFA', trend: '-3% vs jour moyen', trendDirection: 'down' },
  { id: 'avances-recues', label: 'Avances reçues', value: '325 000 FCFA', trend: '50% du total requis', trendDirection: 'up' },
  { id: 'solde-a-percevoir', label: 'Solde à percevoir', value: '325 000 FCFA', trend: 'À récupérer sur place', trendDirection: 'up' },
];

export const MOCK_REVENUS_EVOLUTION = {
  ville: 'Dakar',
  data: [
    { jour: 'J1', montant: 32000 }, { jour: 'J2', montant: 45000 }, { jour: 'J3', montant: 28000 },
    { jour: 'J4', montant: 52000 }, { jour: 'J5', montant: 68000 }, { jour: 'J6', montant: 58000 },
    { jour: 'J7', montant: 62000 }, { jour: 'J8', montant: 75000 }, { jour: 'J9', montant: 66000 },
    { jour: 'J10', montant: 82000 }, { jour: 'J11', montant: 78000 }, { jour: 'J12', montant: 88000 },
  ],
};

export const MOCK_STATISTIQUES_KPIS_GERANT = [
  { id: 'taux-occupation', label: "Taux d'occupation moyen", value: '78%', trend: '+4% vs mois dernier', trendDirection: 'up' },
  { id: 'terrain-demande', label: 'Terrain le plus demandé', value: 'Parcelles', trend: '48 Réservations', trendDirection: 'up' },
  { id: 'creneau-populaire', label: 'Créneau le plus populaire', value: '18h - 20h', trend: "88% de taux d'occupation", trendDirection: 'up' },
  { id: 'clients-uniques', label: 'Clients uniques', value: '234', trend: '+32 nouveaux cette semaine', trendDirection: 'up' },
];

export const MOCK_RESERVATIONS_PAR_JOUR = [
  { jour: 'Lun', valeur: 18 }, { jour: 'Mar', valeur: 22 }, { jour: 'Mer', valeur: 28 },
  { jour: 'Jeu', valeur: 25 }, { jour: 'Ven', valeur: 42 }, { jour: 'Sam', valeur: 48 }, { jour: 'Dim', valeur: 45 },
];

export const MOCK_MODES_PAIEMENT_STATS = [
  { name: 'Orange Money', value: 45, color: '#F59E0B' },
  { name: 'Wave', value: 35, color: '#0EA5E9' },
  { name: 'Carte Bancaire', value: 20, color: '#004030' },
];

// Recommandations affichées telles quelles pour l'instant (texte statique).
// Note : dans la logique métier cible, ces recommandations proviennent d'un LLM externe
// (OpenRouter / HuggingFace) appelé par un micro-service FastAPI séparé, qui écrit ses
// résultats dans les champs `niveauDemande` / `prixRecommandePIA` / `derniereMajIA` d'un
// modèle Creneau côté backend. Rien de tout cela n'existe encore ici : c'est du texte fixe.
export const MOCK_RECOMMANDATIONS_IA = [
  "Augmentez vos créneaux le samedi matin — la demande de réservations à Dakar dépasse actuellement l'offre disponible de 40%.",
  'Proposez un tarif réduit en semaine entre 10h et 14h pour attirer des étudiants et améliorer votre taux d\'occupation de 15%.',
  "Les joueurs recherchent fréquemment des terrains avec vestiaires — activez l'affichage de cet équipement pour booster votre attractivité.",
];
