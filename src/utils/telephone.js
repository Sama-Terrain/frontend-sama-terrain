// Validation des numéros de mobile sénégalais (9 chiffres locaux, sans le +221).
//
// Préfixes mobiles réellement attribués au Sénégal :
// - 70, 76, 77, 78 : Orange
// - 75 : Free/Promobile
// (33 est un préfixe fixe, pas mobile/WhatsApp : volontairement exclu.)
export const PREFIXES_MOBILES_SENEGAL = ['70', '75', '76', '77', '78'];

// Ne garde que les chiffres et limite à 9 (longueur d'un numéro sénégalais
// sans l'indicatif +221). Utilisé sur chaque champ téléphone du site pour
// empêcher la saisie de lettres/espaces au clavier ou au collage.
export function nettoyerTelephone(valeur) {
  return valeur.replace(/\D/g, '').slice(0, 9);
}

// Un numéro "trivial" (tous les chiffres identiques, ou une suite comme
// 123456789) n'est presque jamais un vrai numéro : on le refuse pour éviter
// les faux numéros de test du type "77 777 77 77" ou "77 000 00 00".
function estNumeroTrivial(numero) {
  if (/^(\d)\1{8}$/.test(numero)) return true; // 777777777, 700000000...
  const croissante = '0123456789';
  const decroissante = '9876543210';
  return croissante.includes(numero) || decroissante.includes(numero);
}

// Vérifie qu'un numéro local (9 chiffres) est un vrai numéro de mobile
// sénégalais plausible : bon préfixe, et pas un numéro trivial/inventé.
export function estNumeroSenegalaisValide(numero) {
  if (!/^\d{9}$/.test(numero)) return false;
  if (!PREFIXES_MOBILES_SENEGAL.includes(numero.slice(0, 2))) return false;
  if (estNumeroTrivial(numero)) return false;
  return true;
}
