// Constantes et helpers liés aux rôles de la plateforme Sama-Terrain.
// Il existe 4 rôles : l'amateur (joueur), le gérant (propriétaire de terrain),
// l'employé (gestionnaire sur place, qui travaille pour un gérant) et
// l'administrateur (supervision globale).

export const ROLES = {
  AMATEUR: 'amateur',
  GERANT: 'gerant',
  EMPLOYE: 'employe',
  ADMIN: 'admin',
};

// Rôles qui accèdent à l'espace gérant (l'employé n'en voit qu'une partie).
export const ROLES_ESPACE_GERANT = [ROLES.GERANT, ROLES.EMPLOYE];

// Page d'accueil de chaque rôle après connexion. L'employé n'a pas accès au
// tableau de bord (chiffres d'affaires) : il arrive sur les réservations.
export const HOME_ROUTE_BY_ROLE = {
  [ROLES.AMATEUR]: '/',
  [ROLES.GERANT]: '/gerant/dashboard',
  [ROLES.EMPLOYE]: '/gerant/reservations',
  [ROLES.ADMIN]: '/admin/dashboard',
};

// Retourne la route d'accueil correspondant au rôle d'un utilisateur.
// Si le rôle est inconnu, on retombe sur l'accueil public.
export function getHomeRouteForRole(role) {
  return HOME_ROUTE_BY_ROLE[role] || '/';
}

// Vérifie qu'un utilisateur a bien l'un des rôles autorisés.
export function hasRole(user, allowedRoles = []) {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}
