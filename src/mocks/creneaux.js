// Mock : créneaux horaires (disponibilité amateur + configuration tarifaire gérant).
import { MOCK_CRENEAUX_CONFIG_GERANT } from './gerants';

// Jours de la semaine utilisés pour la grille des créneaux gérant
export const JOURS_SEMAINE = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
export const JOURS_WEEKEND = ['Sam', 'Dim'];

// Créneaux proposés à l'amateur pour un terrain + une date donnés
export const MOCK_CRENEAUX = [
  { id: '1', heure: '08:00 - 09:00', prix: 10000, disponible: true },
  { id: '2', heure: '09:00 - 10:00', prix: 30000, disponible: true },
  { id: '3', heure: '10:00 - 11:00', prix: 12000, disponible: false },
  { id: '4', heure: '15:00 - 16:00', prix: 15000, disponible: true },
  { id: '5', heure: '16:00 - 17:00', prix: 20000, disponible: true },
  { id: '6', heure: '17:00 - 18:00', prix: 18000, disponible: false },
  { id: '7', heure: '19:00 - 20:00', prix: 25000, disponible: true },
  { id: '8', heure: '20:00 - 21:00', prix: 25000, disponible: true },
  { id: '9', heure: '21:00 - 22:00', prix: 25000, disponible: true }
];

// Configuration créneaux & tarifs par terrain gérant (ré-exportée depuis gerants.js
// pour que tout ce qui touche aux "créneaux" soit accessible depuis un seul fichier)
export const MOCK_CRENEAUX_CONFIG = MOCK_CRENEAUX_CONFIG_GERANT;
