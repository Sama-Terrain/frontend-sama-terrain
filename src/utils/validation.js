// Petites fonctions de validation réutilisées par plusieurs formulaires du
// site, pour ne pas dupliquer les mêmes règles (obligatoire, longueur...)
// dans chaque page.

// Vrai si la valeur est vide OU ne contient que des espaces ("   ").
export function estVide(valeur) {
  return !valeur || valeur.trim().length === 0;
}

// Vérifie qu'un champ texte obligatoire est bien rempli (pas vide, pas que
// des espaces). Retourne le message d'erreur, ou '' si c'est valide.
export function validerTexteObligatoire(valeur, nomChamp, { min, max } = {}) {
  if (estVide(valeur)) return `${nomChamp} est obligatoire.`;
  const longueur = valeur.trim().length;
  if (min && longueur < min) return `${nomChamp} doit contenir au moins ${min} caractères.`;
  if (max && longueur > max) return `${nomChamp} ne doit pas dépasser ${max} caractères.`;
  return '';
}

// Vérifie qu'un champ numérique obligatoire est bien un nombre dans les
// bornes attendues. `valeur` est la chaîne brute saisie dans l'input.
export function validerNombre(valeur, nomChamp, { min, max, entier = false } = {}) {
  if (valeur === '' || valeur === null || valeur === undefined) {
    return `${nomChamp} est obligatoire.`;
  }
  const nombre = Number(valeur);
  if (!Number.isFinite(nombre)) return `${nomChamp} doit être un nombre valide.`;
  if (entier && !Number.isInteger(nombre)) return `${nomChamp} doit être un nombre entier.`;
  if (min !== undefined && nombre < min) return `${nomChamp} doit être supérieur ou égal à ${min}.`;
  if (max !== undefined && nombre > max) return `${nomChamp} doit être inférieur ou égal à ${max}.`;
  return '';
}

// Format email simple (suffisant pour rejeter les fautes de frappe
// évidentes ; l'unicité/validité réelle est de toute façon vérifiée
// côté backend).
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validerEmail(valeur) {
  if (estVide(valeur)) return "L'email est obligatoire.";
  if (!REGEX_EMAIL.test(valeur.trim())) return 'Veuillez saisir un email valide.';
  return '';
}

// Mot de passe : mêmes règles minimales que celles déjà appliquées sur
// Inscription/DevenirGerant (le backend impose en plus ses propres règles
// Django, ceci n'est qu'un premier filtre côté UX).
export function validerMotDePasse(valeur) {
  if (estVide(valeur)) return 'Le mot de passe est obligatoire.';
  if (valeur.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères.';
  return '';
}

export function validerConfirmationMotDePasse(motDePasse, confirmation) {
  if (estVide(confirmation)) return 'Veuillez confirmer le mot de passe.';
  if (motDePasse !== confirmation) return 'Les mots de passe ne correspondent pas.';
  return '';
}
