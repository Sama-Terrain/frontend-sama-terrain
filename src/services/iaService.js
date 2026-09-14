import { REPONSES_CHATBOT, REPONSE_CHATBOT_PAR_DEFAUT } from '../mocks/chatbot';
import { delaiReseau } from '../utils/delaiReseau';

/**
 * Service IA (chatbot d'assistance amateur).
 *
 * Aujourd'hui : choisit une réponse mockée selon des mots-clés, pour que
 * l'interface du chatbot soit utilisable sans backend.
 * Demain : ce sera un appel au micro-service IA séparé (FastAPI), qui
 * lui-même interroge un LLM externe (OpenRouter ou HuggingFace) — la page qui
 * utilise ce service n'aura rien à changer.
 */
export const iaService = {
  async envoyerMessageChatbot(message) {
    await delaiReseau();

    const messageMinuscule = message.toLowerCase();
    const reponseTrouvee = REPONSES_CHATBOT.find((entree) =>
      entree.motsCles.some((motCle) => messageMinuscule.includes(motCle))
    );

    return {
      texte: reponseTrouvee ? reponseTrouvee.reponse : REPONSE_CHATBOT_PAR_DEFAUT,
    };
  },
};
