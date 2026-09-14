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

// Le token d'accès expire au bout d'1h (voir ACCESS_TOKEN_LIFETIME côté
// backend) : sans ça, toute requête après ce délai échouait avec "Token is
// expired" et l'utilisateur devait se reconnecter manuellement. On tente ici
// un refresh silencieux via le refresh token (valide 7 jours) et on rejoue
// la requête d'origine une seule fois.
let rafraichissementEnCours = null;

api.interceptors.response.use(
  (reponse) => reponse,
  async (error) => {
    const requeteOriginale = error.config;
    const estErreurToken = error.response?.status === 401 && !requeteOriginale?._dejaRejouee;

    if (!estErreurToken) {
      return Promise.reject(error);
    }

    const refresh = localStorage.getItem(CLE_REFRESH_TOKEN);
    if (!refresh) {
      return Promise.reject(error);
    }

    requeteOriginale._dejaRejouee = true;

    try {
      if (!rafraichissementEnCours) {
        rafraichissementEnCours = api
          .post('/auth/token/refresh', { refresh })
          .finally(() => {
            rafraichissementEnCours = null;
          });
      }

      const { data } = await rafraichissementEnCours;
      localStorage.setItem(CLE_ACCESS_TOKEN, data.access);

      requeteOriginale.headers.Authorization = `Bearer ${data.access}`;
      return api(requeteOriginale);
    } catch (erreurRefresh) {
      localStorage.removeItem(CLE_ACCESS_TOKEN);
      localStorage.removeItem(CLE_REFRESH_TOKEN);
      window.location.href = '/login';
      return Promise.reject(erreurRefresh);
    }
  }
);

export default api;
