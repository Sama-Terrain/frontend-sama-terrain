// Mock : réponses du chatbot d'assistance.
//
// Dans la logique métier cible, ce chatbot appelle un LLM externe (OpenRouter
// ou HuggingFace) via un micro-service séparé. Ici, en attendant ce backend,
// on choisit une réponse toute faite selon des mots-clés trouvés dans le
// message de l'utilisateur — juste assez pour que l'interface ait l'air
// "intelligente" pendant la démo.

export const MESSAGE_ACCUEIL_CHATBOT =
  "Bonjour ! Je suis l'assistant Sama-Terrain. Quel quartier ou créneau cherchez-vous à Dakar ?";

export const REPONSES_CHATBOT = [
  {
    motsCles: ['yoff'],
    reponse: "À Yoff, le Terrain Municipal de Yoff est disponible ce soir à partir de 19h00 (18 000 FCFA/heure). Voulez-vous que je vous montre les créneaux ?",
  },
  {
    motsCles: ['almadies'],
    reponse: "Aux Almadies, le Complexe Keur Madior a un créneau libre ce soir à 20h00 (25 000 FCFA/heure). Je peux vous rediriger vers sa fiche.",
  },
  {
    motsCles: ['mermoz'],
    reponse: "À Mermoz, le Sama-Terrain Stadium propose plusieurs créneaux disponibles cette semaine, dès 30 000 FCFA/heure.",
  },
  {
    motsCles: ['prix', 'tarif', 'combien'],
    reponse: "Les prix varient selon les terrains, généralement entre 18 000 et 30 000 FCFA de l'heure. Une avance (à partir de 5 000 FCFA) est demandée en ligne via Wave ou Orange Money, le reste se paie sur place.",
  },
  {
    motsCles: ['annul', 'rembours'],
    reponse: "Vous pouvez annuler gratuitement jusqu'à 24h avant votre créneau : l'avance vous est intégralement remboursée. Passé ce délai, l'avance n'est pas remboursable.",
  },
  {
    motsCles: ['paiement', 'wave', 'orange money', 'payer'],
    reponse: "Le paiement de l'avance se fait en ligne via Wave ou Orange Money (PayDunya). Le solde restant se règle en espèces directement sur le terrain, le jour du match.",
  },
];

// Réponse utilisée si aucun mot-clé ne correspond
export const REPONSE_CHATBOT_PAR_DEFAUT =
  "Je recherche les meilleurs terrains disponibles pour vous. Pouvez-vous préciser un quartier de Dakar (Yoff, Almadies, Mermoz...) ou une date ?";
