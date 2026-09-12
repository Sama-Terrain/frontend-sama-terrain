import {
  mockGerantProfile,
  mockGerantStats,
  mockRevenus30Jours,
  mockReservationsRecentes,
  mockMesTerrains,
  mockTerrainDetails,
  mockProchainesReservations,
  mockAvisRecents,
  mockCreneauxConfig,
  mockReservationsGerant,
  mockReservationsActivite,
} from '../data/mockGerantData';

// Couche service de l'espace Gérant.
// Aujourd'hui : renvoie les données mock (avec un léger délai simulant un appel réseau).
// Demain : chaque méthode sera remplacée par un appel à l'API REST Django, sans changer les pages qui les consomment.
export const gerantService = {
  async getGerantProfile() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockGerantProfile;
  },

  async getGerantStats() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockGerantStats;
  },

  async getRevenus30Jours() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockRevenus30Jours;
  },

  async getReservationsRecentes() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockReservationsRecentes;
  },

  async getMesTerrains() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockMesTerrains;
  },

  async getTerrainDetail(terrainId) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockTerrainDetails[terrainId] || null;
  },

  async getProchainesReservations() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockProchainesReservations;
  },

  async getAvisRecents() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockAvisRecents;
  },

  async getCreneauxConfigs() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return Object.values(mockCreneauxConfig);
  },

  async getCreneauxConfig(terrainId) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockCreneauxConfig[terrainId] || null;
  },

  async getReservationsGerant() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockReservationsGerant;
  },

  async getReservationsActivite() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockReservationsActivite;
  },
};
