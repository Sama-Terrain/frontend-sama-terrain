import {
  mockAdminStats,
  mockCroissanceInscriptions,
  mockReservationsVille,
  mockActiviteRecente,
  mockAdminProfile,
  mockUsers,
  mockValidationRequests,
  mockReviews,
  mockStatsKpi,
  mockStatsPayment,
  mockStatsCity,
  mockStatsTopTerrains,
} from '../data/mockAdminData';

export const adminService = {
  async getAdminStats() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockAdminStats;
  },

  async getCroissanceInscriptions() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockCroissanceInscriptions;
  },

  async getReservationsParVille() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockReservationsVille;
  },

  async getActiviteRecente() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockActiviteRecente;
  },

  async getAdminProfile() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockAdminProfile;
  },

  async getUsers() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockUsers;
  },

  async getValidationRequests() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockValidationRequests;
  },

  async getReviews() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockReviews;
  },

  async getStatsKpi() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockStatsKpi;
  },

  async getStatsPayment() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockStatsPayment;
  },

  async getStatsCity() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockStatsCity;
  },

  async getStatsTopTerrains() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockStatsTopTerrains;
  },
};
