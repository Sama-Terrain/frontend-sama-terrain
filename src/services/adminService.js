import { MOCK_ADMIN_PROFILE, MOCK_UTILISATEURS } from '../mocks/utilisateurs';
import { MOCK_DEMANDES_VALIDATION_GERANT } from '../mocks/gerants';
import { MOCK_AVIS_MODERATION } from '../mocks/avis';
import {
  MOCK_ADMIN_STATS,
  MOCK_CROISSANCE_INSCRIPTIONS,
  MOCK_RESERVATIONS_VILLE,
  MOCK_ACTIVITE_RECENTE_ADMIN,
  MOCK_STATS_KPI_ADMIN,
  MOCK_STATS_PAYMENT_ADMIN,
  MOCK_STATS_CITY_ADMIN,
  MOCK_STATS_TOP_TERRAINS,
} from '../mocks/statistiques';
import { delaiReseau } from '../utils/delaiReseau';

/**
 * Service de l'espace Administrateur.
 * Aujourd'hui : renvoie les données mockées de src/mocks/.
 * Demain : chaque méthode appellera l'API Django correspondante, sans que les
 * pages qui les consomment n'aient à changer.
 */
export const adminService = {
  async getAdminStats() {
    await delaiReseau();
    return MOCK_ADMIN_STATS;
  },

  async getCroissanceInscriptions() {
    await delaiReseau();
    return MOCK_CROISSANCE_INSCRIPTIONS;
  },

  async getReservationsParVille() {
    await delaiReseau();
    return MOCK_RESERVATIONS_VILLE;
  },

  async getActiviteRecente() {
    await delaiReseau();
    return MOCK_ACTIVITE_RECENTE_ADMIN;
  },

  async getAdminProfile() {
    await delaiReseau();
    return MOCK_ADMIN_PROFILE;
  },

  async getUsers() {
    await delaiReseau();
    return MOCK_UTILISATEURS;
  },

  async getValidationRequests() {
    await delaiReseau();
    return MOCK_DEMANDES_VALIDATION_GERANT;
  },

  async getReviews() {
    await delaiReseau();
    return MOCK_AVIS_MODERATION;
  },

  async getStatsKpi() {
    await delaiReseau();
    return MOCK_STATS_KPI_ADMIN;
  },

  async getStatsPayment() {
    await delaiReseau();
    return MOCK_STATS_PAYMENT_ADMIN;
  },

  async getStatsCity() {
    await delaiReseau();
    return MOCK_STATS_CITY_ADMIN;
  },

  async getStatsTopTerrains() {
    await delaiReseau();
    return MOCK_STATS_TOP_TERRAINS;
  },
};
