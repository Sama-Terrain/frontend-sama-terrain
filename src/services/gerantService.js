import { MOCK_GERANT_PROFILE, MOCK_TERRAINS_GERANT, MOCK_TERRAIN_DETAILS_GERANT } from '../mocks/gerants';
import {
  MOCK_RESERVATIONS_RECENTES_GERANT,
  MOCK_RESERVATIONS_GERANT,
  MOCK_RESERVATIONS_ACTIVITE,
  MOCK_PROCHAINES_RESERVATIONS,
} from '../mocks/reservations';
import { MOCK_AVIS_GERANT } from '../mocks/avis';
import { MOCK_CRENEAUX_CONFIG } from '../mocks/creneaux';
import { MOCK_HISTORIQUE_PAIEMENTS, MOCK_TICKETS_SCANNABLES, MOCK_DERNIERES_VALIDATIONS } from '../mocks/paiements';
import {
  MOCK_GERANT_STATS,
  MOCK_REVENUS_30_JOURS,
  MOCK_REVENUS_STATS,
  MOCK_REVENUS_EVOLUTION,
  MOCK_STATISTIQUES_KPIS_GERANT,
  MOCK_RESERVATIONS_PAR_JOUR,
  MOCK_MODES_PAIEMENT_STATS,
  MOCK_RECOMMANDATIONS_IA,
} from '../mocks/statistiques';
import { delaiReseau } from '../utils/delaiReseau';

/**
 * Service de l'espace Gérant.
 * Aujourd'hui : renvoie les données mockées de src/mocks/.
 * Demain : chaque méthode appellera l'API Django correspondante, sans que les
 * pages qui les consomment n'aient à changer.
 *
 * NB : la gestion de l'abonnement (essai, expiration, renouvellement) est dans
 * un service séparé, cf. src/services/abonnementService.js.
 */
export const gerantService = {
  async getGerantProfile() {
    await delaiReseau();
    return MOCK_GERANT_PROFILE;
  },

  async getGerantStats() {
    await delaiReseau();
    return MOCK_GERANT_STATS;
  },

  async getRevenus30Jours() {
    await delaiReseau();
    return MOCK_REVENUS_30_JOURS;
  },

  async getReservationsRecentes() {
    await delaiReseau();
    return MOCK_RESERVATIONS_RECENTES_GERANT;
  },

  async getMesTerrains() {
    await delaiReseau();
    return MOCK_TERRAINS_GERANT;
  },

  async getTerrainDetail(terrainId) {
    await delaiReseau();
    return MOCK_TERRAIN_DETAILS_GERANT[terrainId] || null;
  },

  async getProchainesReservations() {
    await delaiReseau();
    return MOCK_PROCHAINES_RESERVATIONS;
  },

  async getAvisRecents() {
    await delaiReseau();
    return MOCK_AVIS_GERANT;
  },

  async getCreneauxConfigs() {
    await delaiReseau();
    return Object.values(MOCK_CRENEAUX_CONFIG);
  },

  async getCreneauxConfig(terrainId) {
    await delaiReseau();
    return MOCK_CRENEAUX_CONFIG[terrainId] || null;
  },

  async getReservationsGerant() {
    await delaiReseau();
    return MOCK_RESERVATIONS_GERANT;
  },

  async getReservationsActivite() {
    await delaiReseau();
    return MOCK_RESERVATIONS_ACTIVITE;
  },

  async getRevenusStats() {
    await delaiReseau();
    return MOCK_REVENUS_STATS;
  },

  async getRevenusEvolution() {
    await delaiReseau();
    return MOCK_REVENUS_EVOLUTION;
  },

  async getHistoriquePaiements() {
    await delaiReseau();
    return MOCK_HISTORIQUE_PAIEMENTS;
  },

  async getDernieresValidations() {
    await delaiReseau();
    return MOCK_DERNIERES_VALIDATIONS;
  },

  // Recherche un ticket par son code (scan caméra ou saisie manuelle)
  async verifierTicket(code) {
    await delaiReseau();
    return MOCK_TICKETS_SCANNABLES[code.trim().toUpperCase()] || null;
  },

  async getStatistiquesKpis() {
    await delaiReseau();
    return MOCK_STATISTIQUES_KPIS_GERANT;
  },

  async getReservationsParJour() {
    await delaiReseau();
    return MOCK_RESERVATIONS_PAR_JOUR;
  },

  async getModesPaiementStats() {
    await delaiReseau();
    return MOCK_MODES_PAIEMENT_STATS;
  },

  async getRecommandationsIA() {
    await delaiReseau();
    return MOCK_RECOMMANDATIONS_IA;
  },
};
