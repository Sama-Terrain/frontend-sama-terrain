import api from './api';
import { authService } from './authService';
import { terrainService } from './terrainService';
import { avisService } from './avisService';

// Libellés affichés pour chaque moyen de paiement stocké côté backend.
const LABELS_MOYEN_PAIEMENT = {
  wave: 'Wave',
  orange_money: 'Orange Money',
  cash: 'Cash',
  '': 'Non renseigné',
};

const LABELS_STATUT_RESERVATION = {
  en_attente: { label: 'En attente', badge: 'bg-amber-100 text-amber-700' },
  confirmee: { label: 'Confirmée', badge: 'bg-emerald-100 text-emerald-700' },
  terminee: { label: 'Terminée', badge: 'bg-gray-100 text-gray-700' },
  annulee: { label: 'Annulée', badge: 'bg-red-100 text-red-700' },
};

// Transforme une réservation reçue du backend (ReservationSerializer) vers
// le format attendu par les tableaux de l'espace gérant (ReservationsTable.jsx,
// ProchainesReservationsTable.jsx...).
function normaliserReservationGerant(r) {
  const infosStatut = LABELS_STATUT_RESERVATION[r.statut] || LABELS_STATUT_RESERVATION.en_attente;
  const initiales = r.nom_complet
    .split(' ')
    .map((mot) => mot[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return {
    id: `RES-${r.id}`,
    client: r.nom_complet,
    joueur: r.nom_complet,
    initiales,
    terrainId: r.terrain_id,
    terrain: r.terrain_nom,
    date: new Date(r.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
    dateIso: r.date,
    creneau: `${r.heure_debut.slice(0, 5)} - ${r.heure_fin.slice(0, 5)}`,
    montant: r.montant_total,
    statut: infosStatut.label,
    statutBadgeClass: infosStatut.badge,
    statutBrut: r.statut,
  };
}

/**
 * Service de l'espace Gérant.
 * Aujourd'hui : renvoie les données mockées de src/mocks/.
 * Demain : chaque méthode appellera l'API Django correspondante, sans que les
 * pages qui les consomment n'aient à changer.
 *
 * NB : la gestion de l'abonnement (essai, expiration, renouvellement) est dans
 * un service séparé, cf. src/services/abonnementService.js.
 */
export const gerantService = {
  // Profil affiché dans l'en-tête de l'espace gérant (GerantLayout.jsx).
  async getGerantProfile() {
    const resultat = await authService.getUtilisateurConnecte();
    if (!resultat.success) return null;

    const { prenom, nom, initiales } = resultat.user;
    return { name: `${prenom} ${nom}`, role: 'Gérant', initials: initiales };
  },

  // 4 KPIs affichés en haut du tableau de bord.
  async getGerantStats() {
    const { data } = await api.get('/gerant/dashboard/');
    return [
      { id: 'reservations-jour', label: "Réservations aujourd'hui", value: data.reservations_aujourdhui, trend: 'Confirmées uniquement' },
      { id: 'revenus-mois', label: 'Revenus ce mois', value: `${data.revenus_mois.toLocaleString('fr-FR')} FCFA`, trend: 'Depuis le 1er du mois' },
      { id: 'taux-occupation', label: "Taux d'occupation", value: `${data.taux_occupation}%`, trend: 'Créneaux du mois' },
      { id: 'note-moyenne', label: 'Avis moyen', value: `${data.note_moyenne}/5`, trend: 'Tous terrains confondus' },
    ];
  },

  // Évolution des revenus sur les 30 derniers jours, pour le graphique du dashboard.
  async getRevenus30Jours() {
    const { data } = await api.get('/gerant/revenus/');
    const total = data.evolution_30_jours.reduce((somme, jour) => somme + jour.montant, 0);
    return {
      total: `${total.toLocaleString('fr-FR')} FCFA`,
      data: data.evolution_30_jours.map((jour) => ({
        jour: new Date(jour.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        montant: jour.montant,
      })),
    };
  },

  // Les 5 réservations les plus récentes, toutes terrains confondus.
  async getReservationsRecentes() {
    const toutes = await this.getReservationsGerant();
    return [...toutes]
      .sort((a, b) => b.id.localeCompare(a.id, undefined, { numeric: true }))
      .slice(0, 5);
  },

  async getMesTerrains() {
    return terrainService.getMesTerrains();
  },

  async getTerrainDetail(terrainId) {
    try {
      return await terrainService.getTerrainDetailGerant(terrainId);
    } catch (error) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },

  // Toutes les réservations reçues sur les terrains du gérant connecté.
  async getReservationsGerant() {
    const { data } = await api.get('/gerant/reservations/');
    return data.map(normaliserReservationGerant);
  },

  // Prochaines réservations à venir, éventuellement filtrées sur un terrain
  // précis (page TerrainDetail.jsx).
  async getProchainesReservations(terrainId) {
    const toutes = await this.getReservationsGerant();
    const aujourdhui = new Date().toISOString().split('T')[0];

    return toutes
      .filter((r) => r.statutBrut !== 'annulee' && r.dateIso >= aujourdhui)
      .filter((r) => !terrainId || r.terrainId === terrainId)
      .sort((a, b) => a.dateIso.localeCompare(b.dateIso));
  },

  // Synthèse d'activité affichée en haut de la page "Réservations"
  // (calculée côté frontend à partir de la liste complète, pas de route dédiée).
  async getReservationsActivite() {
    const toutes = await this.getReservationsGerant();
    const maintenant = new Date();
    const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);

    const duMois = toutes.filter((r) => new Date(r.dateIso) >= debutMois);
    const confirmees = duMois.filter((r) => r.statutBrut === 'confirmee' || r.statutBrut === 'terminee');

    return {
      totalMois: duMois.length,
      tauxValidation: duMois.length ? Math.round((confirmees.length / duMois.length) * 100) : 0,
      periodeLabel: maintenant.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    };
  },

  // Avis récents laissés sur un terrain précis (page TerrainDetail.jsx).
  async getAvisRecents(terrainId) {
    const avis = await avisService.getAvisJoueurs(terrainId);
    return avis.map((a) => ({ ...a, rating: a.note }));
  },

  async getRevenusStats() {
    const { data } = await api.get('/gerant/revenus/');
    return [
      { id: 'revenus_mois', label: 'Revenus ce mois', value: `${data.revenus_mois.toLocaleString('fr-FR')} FCFA`, trend: 'Depuis le 1er du mois' },
      { id: 'revenus_hier', label: 'Revenus hier', value: `${data.revenus_hier.toLocaleString('fr-FR')} FCFA`, trend: 'Journée précédente' },
      { id: 'avances_recues', label: 'Avances reçues', value: `${data.avances_recues.toLocaleString('fr-FR')} FCFA`, trend: 'Ce mois-ci' },
      { id: 'solde_a_percevoir', label: 'Solde à percevoir', value: `${data.solde_a_percevoir.toLocaleString('fr-FR')} FCFA`, trend: 'À encaisser sur place' },
    ];
  },

  async getRevenusEvolution() {
    const { data } = await api.get('/gerant/revenus/');
    return {
      data: data.evolution_30_jours.map((jour) => ({
        jour: new Date(jour.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        montant: jour.montant,
      })),
    };
  },

  async getHistoriquePaiements() {
    const { data } = await api.get('/gerant/revenus/');
    return data.historique_paiements.map((p) => ({
      id: p.id,
      date: new Date(p.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      client: p.client,
      terrain: p.terrain,
      mode: LABELS_MOYEN_PAIEMENT[p.moyen_paiement] || p.moyen_paiement,
      montant: p.montant,
      statut: 'Payé',
    }));
  },

  // Aucune route backend ne conserve un historique des validations : la
  // liste se construit en direct pendant la session (voir ScannerTicket.jsx),
  // donc on démarre simplement sur une liste vide.
  async getDernieresValidations() {
    return [];
  },

  // Valide un ticket scanné/saisi : le marque comme utilisé côté backend et
  // enregistre au passage le solde payé sur place (par défaut en espèces).
  async verifierTicket(code) {
    try {
      const { data } = await api.post('/tickets/valider/', { code: code.trim() });
      const ticket = data.ticket;

      try {
        await api.post('/paiements/solde/', { reservation: ticket.reservation, moyen_paiement: 'cash' });
      } catch (error) {
        // Le solde a peut-être déjà été enregistré : on ne bloque pas la
        // validation du ticket pour autant, qui a déjà réussi.
        console.error('Erreur enregistrement solde:', error);
      }

      return {
        code: ticket.code,
        client: ticket.client,
        terrain: ticket.terrain,
        creneau: `${ticket.heure_debut.slice(0, 5)} - ${ticket.heure_fin.slice(0, 5)}`,
        montantRestant: ticket.montant_restant,
      };
    } catch {
      return null;
    }
  },

  async getStatistiquesKpis() {
    const [dashboard, revenus] = await Promise.all([
      api.get('/gerant/dashboard/'),
      api.get('/gerant/revenus/'),
    ]);
    const d = dashboard.data;
    const r = revenus.data;

    return [
      { id: 'reservations-jour', label: "Réservations aujourd'hui", value: d.reservations_aujourdhui, trend: 'Confirmées uniquement' },
      { id: 'taux-occupation', label: "Taux d'occupation", value: `${d.taux_occupation}%`, trend: 'Créneaux du mois' },
      { id: 'note-moyenne', label: 'Note moyenne', value: `${d.note_moyenne}/5`, trend: 'Tous terrains confondus' },
      { id: 'revenus-mois', label: 'Revenus ce mois', value: `${r.revenus_mois.toLocaleString('fr-FR')} FCFA`, trend: 'Depuis le 1er du mois' },
    ];
  },

  // Nombre de réservations confirmées par jour sur les 7 derniers jours.
  async getReservationsParJour() {
    const { data } = await api.get('/gerant/revenus/');
    return data.reservations_par_jour.map((jour) => ({
      jour: new Date(jour.date).toLocaleDateString('fr-FR', { weekday: 'short' }),
      valeur: jour.nombre,
    }));
  },

  // Répartition (en %) des paiements par moyen de paiement, pour le donut.
  async getModesPaiementStats() {
    const { data } = await api.get('/gerant/revenus/');
    const total = data.modes_paiement_stats.reduce((somme, m) => somme + m.total, 0);
    if (total === 0) return [];

    const couleurs = { wave: '#0EA5E9', orange_money: '#F97316', cash: '#9CA3AF' };

    return data.modes_paiement_stats.map((m) => ({
      name: LABELS_MOYEN_PAIEMENT[m.moyen_paiement] || m.moyen_paiement,
      value: Math.round((m.total / total) * 100),
      color: couleurs[m.moyen_paiement] || '#9CA3AF',
    }));
  },

  // Recommandations générées par le micro-service IA (pas encore déployé,
  // voir IAPredictionsView) : on tente pour le premier terrain du gérant,
  // et on renvoie simplement une liste vide si le service est indisponible.
  async getRecommandationsIA() {
    const terrains = await this.getMesTerrains();
    if (terrains.length === 0) return [];

    try {
      const { data } = await api.get(`/ia/predictions/${terrains[0].id}/`);
      return data.recommandations || [];
    } catch {
      return [];
    }
  },
};
