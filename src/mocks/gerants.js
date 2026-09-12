// Mock : tout ce qui concerne les gérants (compte de test, profil, demandes de
// validation par l'admin, et les terrains qu'ils gèrent).
import samaStadiumImg from '../assets/sama_stadium.jpg';
import ngorArenaImg from '../assets/ngor_arena.jpg';
import keurMadiorImg from '../assets/keur_madior.jpg';
import dakarFootImg from '../assets/dakar_foot.jpg';
import footDorImg from '../assets/foot_dor.jpg';
import yoffMunicipalImg from '../assets/yoff_municipal.jpg';

// Compte de test "Gérant" (utilisé à la connexion)
export const MOCK_GERANT = {
  id: 'user-gerant-1',
  email: 'gerant@samaterrain.sn',
  password: 'gerant123',
  prenom: 'Amadou',
  nom: 'Diouf',
  role: 'gerant',
  verificationCode: '1111',
  initiales: 'AD',
};

// Profil affiché dans l'en-tête de l'espace gérant
export const MOCK_GERANT_PROFILE = {
  name: 'Amadou Diouf',
  role: 'Gérant',
  initials: 'A',
};

// Demandes d'inscription de gérants en attente de validation par l'admin
export const MOCK_DEMANDES_VALIDATION_GERANT = [
  { id: 1, name: 'Amadou Diouf', phone: '+221 77 111 22 33', city: 'Dakar', initials: 'AD', terrainName: 'Dakar Soccer Center', terrainCity: 'Dakar', documentName: 'Reg_Commerce_Diouf.pdf', submittedAt: '28 Nov 2026', status: 'pending' },
  { id: 2, name: 'Ibrahima Fall', phone: '+221 78 222 33 44', city: 'Mermoz', initials: 'IF', terrainName: 'Elite Arena', terrainCity: 'Mermoz', documentName: 'CNI_Fall.pdf', submittedAt: '25 Nov 2026', status: 'pending' },
  { id: 3, name: 'Omar Sy', phone: '+221 77 333 44 55', city: 'Guédiawaye', initials: 'OS', terrainName: 'Saly Foot Arena', terrainCity: 'Saly', documentName: 'RCCM_Sy.pdf', submittedAt: '22 Nov 2026', status: 'pending' },
  { id: 4, name: 'Fatoumata Sarr', phone: '+221 78 444 55 66', city: 'Almadies', initials: 'FS', terrainName: 'Dakar Premier Field', terrainCity: 'Dakar', documentName: 'CNI_Sarr.pdf', submittedAt: '20 Nov 2026', status: 'pending' },
  { id: 5, name: 'Awa Ndiaye', phone: '+221 77 555 66 77', city: 'Yoff', initials: 'AN', terrainName: 'Yoff Municipal Stadium', terrainCity: 'Yoff', documentName: 'Reg_Commerce_Ndiaye.pdf', submittedAt: '18 Nov 2026', status: 'pending' },
];

// Terrains gérés par le gérant connecté (page "Mes terrains")
export const MOCK_TERRAINS_GERANT = [
  { id: 1, nom: 'Terrain A - Elite Arena', localisation: "Mermoz, Dakar (Derrière l'école de police)", image: samaStadiumImg, actif: true, reservationsMois: 48, revenusMois: '720 000 FCFA', note: 4.8 },
  { id: 2, nom: 'Terrain B - Classic Grass', localisation: "Mermoz, Dakar (Derrière l'école de police)", image: ngorArenaImg, actif: true, reservationsMois: 32, revenusMois: '480 000 FCFA', note: 4.4 },
  { id: 3, nom: 'Terrain C - Saly Beach', localisation: 'Saly Carrefour, Mbour', image: keurMadiorImg, actif: false, reservationsMois: 0, revenusMois: '0 FCFA', note: null },
];

// Détail complet d'un terrain gérant, indexé par id (page "Détail Terrain")
export const MOCK_TERRAIN_DETAILS_GERANT = {
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
      "Elite Arena est un terrain de football synthétique moderne situé au cœur de Ouakam, offrant une expérience de jeu exceptionnelle grâce à sa surface de dernière génération et son éclairage LED nocturne. Idéal pour les matchs entre amis ou les tournois entre équipes, le terrain dispose de vestiaires spacieux et de douches pour un confort optimal après l'effort.",
    photos: [samaStadiumImg, ngorArenaImg, keurMadiorImg, footDorImg, dakarFootImg, yoffMunicipalImg],
    stats: { reservationsMois: 142, reservationsTrend: '+12% vs mois dernier', revenusMois: '2.13M', revenusSousTitre: 'FCFA au total', noteMoyenne: 4.8, tauxOccupation: 78 },
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
      "Classic Grass propose un gazon naturel bien entretenu au cœur de Mermoz, apprécié pour son ambiance conviviale et sa proximité avec le centre-ville.",
    photos: [ngorArenaImg, samaStadiumImg, footDorImg, dakarFootImg],
    stats: { reservationsMois: 32, reservationsTrend: '+5% vs mois dernier', revenusMois: '480K', revenusSousTitre: 'FCFA au total', noteMoyenne: 4.4, tauxOccupation: 61 },
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
    stats: { reservationsMois: 0, reservationsTrend: 'Pas encore de réservation', revenusMois: '0', revenusSousTitre: 'FCFA au total', noteMoyenne: 0, tauxOccupation: 0 },
  },
};

// Configuration créneaux & tarifs par terrain (page "Créneaux & tarifs")
export const MOCK_CRENEAUX_CONFIG_GERANT = {
  1: { terrainId: 1, terrainNom: 'Elite Arena', terrainType: '5v5', ouverture: '08:00', fermeture: '23:00', prixSemaine: 10000, prixWeekend: 15000 },
  2: { terrainId: 2, terrainNom: 'Classic Grass', terrainType: '6v6', ouverture: '08:00', fermeture: '22:00', prixSemaine: 8000, prixWeekend: 12000 },
  3: { terrainId: 3, terrainNom: 'Saly Beach', terrainType: '5v5', ouverture: '09:00', fermeture: '21:00', prixSemaine: 9000, prixWeekend: 13000 },
};
