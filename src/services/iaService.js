import api from './api';

/**
 * Service IA (chatbot d'assistance amateur).
 *
 * Appelle le backend Django, qui fait suivre au micro-service IA séparé
 * (FastAPI), lequel interroge un vrai LLM externe (OpenRouter) en
 * s'appuyant sur les vrais terrains de la base.
 */
export const iaService = {
  // `historique` : messages précédents de l'utilisateur, pour préparer une
  // réservation en plusieurs échanges ("demain 20h" puis "terrain Almadies").
  async envoyerMessageChatbot(message, historique = []) {
    const { data } = await api.post('/ia/chatbot/', { message, historique });
    // "liens" est facultatif : le service IA le renvoie seulement quand un
    // vrai terrain ou une vraie page a été identifié pour la question posée.
    // "proposition" : créneau dont la disponibilité et le prix ont été
    // vérifiés en base. Rien n'est réservé : l'utilisateur confirme lui-même
    // sur la fiche du terrain.
    return { texte: data.texte, liens: data.liens || [], proposition: data.proposition || null };
  },
};
