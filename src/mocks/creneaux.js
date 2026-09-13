// Mock : configuration des créneaux côté gérant (grille de disponibilité/tarifs).
// Le côté amateur (créneaux réels d'un terrain) est déjà branché sur le vrai
// backend (voir services/creneauService.js) et n'a donc plus besoin de mocks ici.
import { MOCK_CRENEAUX_CONFIG_GERANT } from './gerants';

// Jours de la semaine utilisés pour la grille des créneaux gérant
export const JOURS_SEMAINE = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
export const JOURS_WEEKEND = ['Sam', 'Dim'];

// Configuration créneaux & tarifs par terrain gérant (ré-exportée depuis gerants.js
// pour que tout ce qui touche aux "créneaux" soit accessible depuis un seul fichier)
export const MOCK_CRENEAUX_CONFIG = MOCK_CRENEAUX_CONFIG_GERANT;
