// Formate une date (format "YYYY-MM-DD") et un horaire ("18:00 - 19:00") en texte
// lisible en français. Ex : formatDateTexte('2026-11-29', '18:00 - 19:00')
// -> "Dimanche 29 Novembre — 18:00 - 19:00"
const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const MOIS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

export function formatDateTexte(dateStr, heureLabel) {
  const date = new Date(`${dateStr}T00:00:00`);
  const jourNom = JOURS[date.getDay()];
  const moisNom = MOIS[date.getMonth()];
  return `${jourNom} ${date.getDate()} ${moisNom} — ${heureLabel}`;
}

// Combine une date ("YYYY-MM-DD") et l'heure de début d'un créneau ("18:00 - 19:00")
// en une vraie Date ISO, utilisée pour la règle de remboursement à 24h.
export function combinerDateEtHeureDebut(dateStr, heureLabel) {
  const heureDebut = heureLabel.split(' - ')[0]; // "18:00"
  return new Date(`${dateStr}T${heureDebut}:00`).toISOString();
}
