// FAQ affichée sur la page d'accueil, ET utilisée pour générer les données
// structurées schema.org/FAQPage (référencement SEO classique + moteurs
// génératifs type ChatGPT/Perplexity, qui s'appuient beaucoup sur ce
// balisage pour citer une source directement dans leurs réponses).
//
// Contenu aligné avec IA/faq/politiques.txt (même politique que celle
// utilisée par le chatbot), pour ne jamais afficher deux réponses différentes
// à la même question.
export const FAQ_ACCUEIL = [
  {
    question: 'Comment réserver un terrain sur Sama-Terrain ?',
    reponse:
      "Recherchez un terrain par ville ou quartier, choisissez une date et un créneau disponible, puis payez une avance en ligne via Wave ou Orange Money pour confirmer votre réservation. Le solde restant se règle en espèces sur place, le jour du match.",
  },
  {
    question: "Combien coûte l'avance à payer en ligne ?",
    reponse:
      "Le montant de l'avance dépend du terrain choisi (minimum 5 000 FCFA). Le reste du prix total (le solde) se paie directement sur place auprès du gérant, le jour du match.",
  },
  {
    question: 'Puis-je annuler ma réservation et me faire rembourser ?',
    reponse:
      "Oui, gratuitement jusqu'à 24 heures avant l'heure du match : l'avance payée en ligne est alors intégralement remboursée sur le même moyen de paiement utilisé. Passé ce délai, l'annulation reste possible mais l'avance n'est plus remboursable.",
  },
  {
    question: "Que se passe-t-il si je ne paie pas l'avance à temps ?",
    reponse:
      "Vous disposez de 15 minutes après avoir choisi un créneau pour payer l'avance. Passé ce délai, la réservation est automatiquement annulée et le créneau redevient disponible pour quelqu'un d'autre.",
  },
  {
    question: 'Comment devenir gérant et publier mon terrain ?',
    reponse:
      "Remplissez le formulaire \"Devenir gérant\" avec un document justificatif (pièce d'identité ou registre de commerce). Après validation de votre compte par un administrateur (généralement sous 24h), vous bénéficiez de 7 jours d'essai gratuit avant de passer à l'abonnement mensuel de 7 500 FCFA.",
  },
  {
    question: 'Quels moyens de paiement acceptez-vous ?',
    reponse:
      "Sama-Terrain accepte les paiements en ligne via Wave et Orange Money, grâce à l'agrégateur PayTech. Aucune carte bancaire internationale n'est acceptée pour le moment, et le solde restant se paie uniquement en espèces sur place.",
  },
];
