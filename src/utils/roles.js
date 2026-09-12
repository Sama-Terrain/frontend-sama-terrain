// Constantes et helpers liés aux rôles de la plateforme Sama-Terrain.
// Il existe 3 rôles : l'amateur (joueur), le gérant (propriétaire de terrain)
// et l'administrateur (supervision globale).

export const ROLES = {
  AMATEUR: 'amateur',
  GERANT: 'gerant',
  ADMIN: 'admin',
};

// Page d'accueil de chaque rôle après connexion
export const HOME_ROUTE_BY_ROLE = {
  [ROLES.AMATEUR]: '/',
  [ROLES.GERANT]: '/gerant/dashboard',
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
