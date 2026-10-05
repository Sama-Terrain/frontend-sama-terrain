import api from './api';

/**
 * Notifications de la cloche (espaces gérant et admin), stockées en base :
 * l'état "lue" est donc le même sur tous les appareils.
 */
export const notificationService = {
  // { non_lues, notifications: [{ id, type, titre, message, lien, lue, cree_le }] }
  async getNotifications() {
    const { data } = await api.get('/notifications/');
    return data;
  },

  async marquerLue(id) {
    await api.post(`/notifications/${id}/lue/`);
  },

  async toutMarquerLu() {
    await api.post('/notifications/tout-lire/');
  },
};
