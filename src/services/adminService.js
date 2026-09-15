import api from './api';
import { authService } from './authService';

// Transforme une demande de gérant reçue du backend vers le format attendu
// par ValiderGerants.jsx.
function normaliserDemandeGerant(d) {
  return {
    id: d.id,
    initials: `${d.prenom[0]}${d.nom[0]}`.toUpperCase(),
    name: `${d.prenom} ${d.nom}`,
    phone: d.whatsapp,
    city: d.quartier,
    // Pas de "terrain à enregistrer" dans le vrai formulaire d'inscription
    // (le gérant crée ses terrains une fois son compte validé) : on affiche
    // le nom de son complexe/entreprise à la place.
    terrainName: d.nom_complexe,
    terrainCity: d.quartier,
    documentName: d.document ? d.document.split('/').pop() : 'Aucun document',
    documentUrl: d.document || null,
    submittedAt: new Date(d.cree_le).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: d.statut === 'en_attente' ? 'pending' : d.statut === 'validee' ? 'approved' : 'rejected',
  };
}

// Transforme un avis reçu du backend vers le format attendu par ModerationAvis.jsx.
function normaliserAvisModeration(a) {
  return {
    id: a.id,
    initial: a.amateur_nom.charAt(0).toUpperCase(),
    name: a.amateur_nom,
    terrain: a.terrain_nom,
    rating: a.note,
    comment: a.commentaire,
    date: new Date(a.cree_le).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
    // "En attente" = signalé et toujours visible : nécessite une décision
    // de l'admin. "Approuvé" = pas (ou plus) signalé.
    status: a.signale ? 'pending' : 'approved',
  };
}

/**
 * Service de l'espace Administrateur.
 * Certaines méthodes appellent déjà le vrai backend (voir backend/admin_panel/) ;
 * les statistiques avancées restent mockées en attendant les routes dédiées.
 */
export const adminService = {
  async getAdminProfile() {
    const resultat = await authService.getUtilisateurConnecte();
    if (!resultat.success) return null;

    const { prenom, nom, initiales } = resultat.user;
    return { name: `${prenom} ${nom}`, role: 'Administrateur', initials: initiales };
  },

  // 4 KPIs globaux de la plateforme.
  async getAdminStats() {
    const { data } = await api.get('/admin/dashboard/');
    return [
      { id: 'terrains', label: 'Total Terrains', value: data.total_terrains },
      { id: 'utilisateurs', label: 'Total Utilisateurs', value: data.total_utilisateurs },
      { id: 'reservations', label: 'Réservations confirmées', value: data.total_reservations },
      { id: 'revenus', label: 'Revenus', value: `${data.revenus_totaux.toLocaleString('fr-FR')} FCFA` },
    ];
  },

  async getUsers() {
    const { data } = await api.get('/admin/utilisateurs/');
    const LABELS_ROLE = { amateur: 'Amateur', gerant: 'Gérant', admin: 'Admin' };

    return data.map((u) => ({
      id: u.id,
      name: u.nom,
      email: u.email,
      phone: u.telephone,
      city: u.ville,
      role: LABELS_ROLE[u.role] || u.role,
      registeredAt: new Date(u.date_inscription).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: u.actif ? 'actif' : 'inactif',
    }));
  },

  // Toutes les demandes de gérant (le calcul des compteurs pending/approved/
  // rejected se fait côté page, sur la liste complète).
  async getValidationRequests() {
    const { data } = await api.get('/admin/gerants/');
    return data.map(normaliserDemandeGerant);
  },

  async approuverGerant(id) {
    await api.patch(`/admin/gerants/${id}/valider/`);
  },

  async rejeterGerant(id, motif) {
    await api.patch(`/admin/gerants/${id}/rejeter/`, { motif });
  },

  async getReviews() {
    const { data } = await api.get('/admin/avis/');
    return data.map(normaliserAvisModeration);
  },

  // "Approuver" = lever le signalement (l'avis reste visible).
  async approuverAvis(id) {
    await api.patch(`/admin/avis/${id}/valider/`);
  },

  // "Supprimer" = masquer l'avis (il n'apparaît plus publiquement, mais
  // reste en base : le backend ne supprime jamais un avis définitivement).
  async supprimerAvis(id) {
    await api.patch(`/admin/avis/${id}/masquer/`);
  },

  // Évolution mensuelle des inscriptions (graphique du tableau de bord).
  async getCroissanceInscriptions() {
    const { data } = await api.get('/admin/croissance-inscriptions/');
    return data;
  },

  // Répartition des réservations confirmées par ville (graphique du tableau de bord).
  async getReservationsParVille() {
    const { data } = await api.get('/admin/reservations-ville/');
    return data;
  },

  // Flux des derniers événements notables de la plateforme.
  async getActiviteRecente() {
    const { data } = await api.get('/admin/activite-recente/');
    return data;
  },

  // --- Page "Analyses et Statistiques Globales" ---
  // Un seul appel backend (/admin/statistiques/) alimente les 3 méthodes
  // ci-dessous : on le met en cache brièvement pour éviter 3 requêtes
  // identiques quand la page se charge (kpis + payment + city + terrains).
  async _getStatistiquesCompletes() {
    if (!this._statistiquesCache) {
      const { data } = await api.get('/admin/statistiques/');
      this._statistiquesCache = data;
      // Le cache ne sert que pour un seul chargement de page : on l'efface
      // juste après, pour ne jamais afficher de chiffres périmés si l'admin
      // revient plus tard sur la page.
      setTimeout(() => { this._statistiquesCache = null; }, 5000);
    }
    return this._statistiquesCache;
  },

  async getStatsKpi() {
    const data = await this._getStatistiquesCompletes();
    return data.kpis;
  },

  async getStatsPayment() {
    const data = await this._getStatistiquesCompletes();
    return data.payment_stats;
  },

  async getStatsCity() {
    const data = await this._getStatistiquesCompletes();
    return data.city_stats;
  },

  // Active/suspend un compte (bouton "Modifier" de la page Utilisateurs).
  async toggleActifUtilisateur(id) {
    try {
      const { data } = await api.patch(`/admin/utilisateurs/${id}/toggle-actif/`);
      return { success: true, actif: data.actif };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || "Impossible de modifier ce compte." };
    }
  },

  // Supprime définitivement un compte (bouton "Supprimer" de la page Utilisateurs).
  async supprimerUtilisateur(id) {
    try {
      await api.delete(`/admin/utilisateurs/${id}/`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || "Impossible de supprimer ce compte." };
    }
  },

  async getStatsTopTerrains() {
    const data = await this._getStatistiquesCompletes();
    return data.top_terrains;
  },

  // Vue détaillée d'un gérant (page "Gestion des utilisateurs" -> Voir) :
  // ses terrains, son abonnement, ses revenus et son historique de paiements.
  async getGerantDetail(userId) {
    const { data } = await api.get(`/admin/utilisateurs/${userId}/gerant-detail/`);
    const LABELS_TYPE_PAIEMENT = {
      avance: 'Avance de réservation',
      solde: 'Solde payé sur place',
      abonnement: 'Abonnement',
    };
    const LABELS_MOYEN_PAIEMENT = { wave: 'Wave', orange_money: 'Orange Money', cash: 'Cash', '': 'Non renseigné' };

    return {
      gerant: data.gerant,
      nombreTerrains: data.nombre_terrains,
      terrains: data.terrains.map((t) => ({
        id: t.id,
        nom: t.nom,
        ville: t.ville,
        actif: t.actif,
        prixHeure: t.prix_heure,
        noteMoyenne: t.note_moyenne,
        nombreAvis: t.nombre_avis,
      })),
      revenusTotaux: data.revenus_totaux,
      revenusMois: data.revenus_mois,
      abonnement: data.abonnement && {
        statut: data.abonnement.statut,
        estActif: data.abonnement.est_actif,
        dateFinEssai: data.abonnement.date_fin_essai,
        dateFinAbonnement: data.abonnement.date_fin_abonnement,
      },
      paiementsRecus: data.paiements_recus.map((p) => ({
        id: p.id,
        type: LABELS_TYPE_PAIEMENT[p.type] || p.type,
        montant: p.montant,
        moyenPaiement: LABELS_MOYEN_PAIEMENT[p.moyen_paiement] ?? p.moyen_paiement,
        date: new Date(p.cree_le).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      })),
      paiementsAbonnement: data.paiements_abonnement.map((p) => ({
        id: p.id,
        montant: p.montant,
        moyenPaiement: LABELS_MOYEN_PAIEMENT[p.moyen_paiement] ?? p.moyen_paiement,
        date: new Date(p.cree_le).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      })),
    };
  },
};
