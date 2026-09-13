import api from './api';
import { authService } from './authService';
import { terrainService } from './terrainService';
import { MOCK_RESERVATIONS_RECENTES_GERANT } from '../mocks/reservations';
import { MOCK_AVIS_GERANT } from '../mocks/avis';
import { MOCK_HISTORIQUE_PAIEMENTS, MOCK_TICKETS_SCANNABLES, MOCK_DERNIERES_VALIDATIONS } from '../mocks/paiements';
import {
  MOCK_GERANT_STATS,
  MOCK_REVENUS_30_JOURS,
  MOCK_REVENUS_STATS,
  MOCK_REVENUS_EVOLUTION,
  MOCK_STATISTIQUES_KPIS_GERANT,
  MOCK_RESERVATIONS_PAR_JOUR,
  MOCK_MODES_PAIEMENT_STATS,
  MOCK_RECOMMANDATIONS_IA,
} from '../mocks/statistiques';
import { delaiReseau } from '../utils/delaiReseau';

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

  async getGerantStats() {
    await delaiReseau();
    return MOCK_GERANT_STATS;
  },

  async getRevenus30Jours() {
    await delaiReseau();
    return MOCK_REVENUS_30_JOURS;
  },

  async getReservationsRecentes() {
    await delaiReseau();
    return MOCK_RESERVATIONS_RECENTES_GERANT;
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

  async getAvisRecents() {
    await delaiReseau();
    return MOCK_AVIS_GERANT;
  },

  async getRevenusStats() {
    await delaiReseau();
    return MOCK_REVENUS_STATS;
  },

  async getRevenusEvolution() {
    await delaiReseau();
    return MOCK_REVENUS_EVOLUTION;
  },

  async getHistoriquePaiements() {
    await delaiReseau();
    return MOCK_HISTORIQUE_PAIEMENTS;
  },

  async getDernieresValidations() {
    await delaiReseau();
    return MOCK_DERNIERES_VALIDATIONS;
  },

  // Recherche un ticket par son code (scan caméra ou saisie manuelle)
  async verifierTicket(code) {
    await delaiReseau();
    return MOCK_TICKETS_SCANNABLES[code.trim().toUpperCase()] || null;
  },

  async getStatistiquesKpis() {
    await delaiReseau();
    return MOCK_STATISTIQUES_KPIS_GERANT;
  },

  async getReservationsParJour() {
    await delaiReseau();
    return MOCK_RESERVATIONS_PAR_JOUR;
  },

  async getModesPaiementStats() {
    await delaiReseau();
    return MOCK_MODES_PAIEMENT_STATS;
  },

  async getRecommandationsIA() {
    await delaiReseau();
    return MOCK_RECOMMANDATIONS_IA;
  },
};
