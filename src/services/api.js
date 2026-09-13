import axios from 'axios';

/**
 * Instance Axios unique, utilisée par tous les services (authService,
 * terrainService, etc.) pour parler au backend Django.
 *
 * Elle attache automatiquement le token JWT (si l'utilisateur est
 * connecté) à chaque requête, pour que les autres services n'aient pas
 * à s'en soucier.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
});

// Clé utilisée pour stocker le token dans le navigateur (voir authService.js)
export const CLE_ACCESS_TOKEN = 'sama_access_token';
export const CLE_REFRESH_TOKEN = 'sama_refresh_token';

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(CLE_ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
