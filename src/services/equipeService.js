import api from './api';
import { extraireErreursChamps, extraireMessageErreur } from './authService';

/**
 * Équipe du gérant : ses employés (gestionnaires sur place) et le journal
 * d'activité qui indique qui a fait quoi. Réservé au gérant propriétaire.
 */

function normaliserEmploye(e) {
  return {
    id: e.id,
    prenom: e.prenom,
    nom: e.nom,
    nomComplet: `${e.prenom} ${e.nom}`,
    initiales: `${e.prenom?.[0] || ''}${e.nom?.[0] || ''}`.toUpperCase(),
    email: e.email,
    telephone: e.telephone,
    actif: e.actif,
    invitationAcceptee: e.invitation_acceptee,
    ajouteLe: new Date(e.ajoute_le).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
    derniereConnexion: e.derniere_connexion
      ? new Date(e.derniere_connexion).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })
      : null,
  };
}

export const equipeService = {
  async getEmployes() {
    const { data } = await api.get('/gerant/employes/');
    return data.map(normaliserEmploye);
  },

  // telephone : 9 chiffres locaux (sans +221), facultatif.
  async ajouterEmploye({ prenom, nom, email, telephone }) {
    try {
      const { data } = await api.post('/gerant/employes/', {
        prenom, nom, email, telephone: telephone ? `221${telephone}` : '',
      });
      return { success: true, employe: normaliserEmploye(data) };
    } catch (error) {
      return { success: false, error: extraireMessageErreur(error), erreursChamps: extraireErreursChamps(error) };
    }
  },

  async changerStatut(id, actif) {
    try {
      const { data } = await api.patch(`/gerant/employes/${id}/`, { actif });
      return { success: true, employe: normaliserEmploye(data) };
    } catch (error) {
      return { success: false, error: extraireMessageErreur(error) };
    }
  },

  async renvoyerInvitation(id) {
    try {
      await api.post(`/gerant/employes/${id}/invitation/`);
      return { success: true };
    } catch (error) {
      return { success: false, error: extraireMessageErreur(error) };
    }
  },

  // filtres : { auteur, action } (facultatifs)
  async getJournal({ auteur, action } = {}) {
    const { data } = await api.get('/gerant/journal/', {
      params: { ...(auteur ? { auteur } : {}), ...(action ? { action } : {}) },
    });
    return data.map((j) => ({
      id: j.id,
      auteurId: j.auteur_id,
      auteurNom: j.auteur_nom,
      action: j.action,
      actionLibelle: j.action_libelle,
      description: j.description,
      date: new Date(j.mis_a_jour_le),
    }));
  },
};
