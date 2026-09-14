import api from './api';

/**
 * Service IA (chatbot d'assistance amateur).
 *
 * Appelle le backend Django, qui fait suivre au micro-service IA séparé
 * (FastAPI), lequel interroge un vrai LLM externe (OpenRouter) en
 * s'appuyant sur les vrais terrains de la base.
 */
export const iaService = {
  async envoyerMessageChatbot(message) {
    const { data } = await api.post('/ia/chatbot/', { message });
    return { texte: data.texte };
  },
};
