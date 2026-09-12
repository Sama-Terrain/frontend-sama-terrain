// Simule le temps de réponse d'une vraie API pendant qu'il n'y a pas encore de backend.
// Délai aléatoire entre 300 et 800ms, pour que les états de chargement soient visibles
// et que l'expérience reste réaliste. Utilisé par tous les fichiers de src/services/.
export function delaiReseau() {
  const duree = 300 + Math.random() * 500;
  return new Promise((resolve) => setTimeout(resolve, duree));
}
