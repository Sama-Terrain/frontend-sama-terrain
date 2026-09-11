import {
  mockAdminStats,
  mockCroissanceInscriptions,
  mockReservationsVille,
  mockActiviteRecente,
  mockAdminProfile,
  mockUsers,
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
};
