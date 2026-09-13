import api from './api';

/**
 * Service pour la gestion des créneaux disponibles côté amateur (recherche + réservation).
 * Appelle désormais le vrai backend Django (voir backend/creneaux/).
 */

// Transforme un créneau reçu du backend (heure_debut/heure_fin/statut) vers
// le format déjà attendu par les pages (heure formatée + booléen disponible).
function normaliserCreneau(creneau) {
  const debut = creneau.heure_debut.slice(0, 5);
  const fin = creneau.heure_fin.slice(0, 5);

  return {
    ...creneau,
    id: creneau.id,
    heure: `${debut} - ${fin}`,
    prix: creneau.prix,
    disponible: creneau.statut === 'disponible',
  };
}

// Correspond à new Date().getDay() : 0 = Dimanche, 1 = Lundi, etc.
const JOURS_PAR_INDEX_JS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export const creneauService = {
  async getCreneauxByTerrainAndDate(terrainId, dateStr) {
    const { data } = await api.get(`/terrains/${terrainId}/creneaux`, {
      params: { date: dateStr },
    });
    return data.map(normaliserCreneau);
  },

  /**
   * Applique une grille de tarifs (créneau horaire -> prix) aux jours de la
   * semaine sélectionnés, en créant/actualisant les vrais créneaux datés du
   * backend sur les `nombreJours` prochains jours (le backend ne connaît que
   * des créneaux datés, pas de "modèle récurrent" : c'est ici qu'on transforme
   * la grille hebdomadaire du gérant en créneaux réels).
   *
   * `creneaux` : [{ debut: '08:00', fin: '09:00', label: '08:00 - 09:00' }, ...]
   * `joursSelectionnes` : ['Lun', 'Mer', ...]
   * `prixParCreneau` : { '08:00 - 09:00': 20000, ... }
   */
  async genererCreneaux({ terrainId, creneaux, joursSelectionnes, prixParCreneau, nombreJours = 28 }) {
    // On récupère les créneaux déjà existants pour ne pas créer de doublons
    // (le backend refuse deux créneaux à la même date/heure pour un terrain).
    const { data: existants } = await api.get(`/terrains/${terrainId}/creneaux`);
    const existantsParCle = new Map(
      existants.map((c) => [`${c.date}_${c.heure_debut.slice(0, 5)}`, c])
    );

    let crees = 0;
    let misAJour = 0;
    let erreurs = 0;

    for (let i = 0; i < nombreJours; i += 1) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const jourLabel = JOURS_PAR_INDEX_JS[date.getDay()];

      if (!joursSelectionnes.includes(jourLabel)) continue;

      const dateStr = date.toISOString().split('T')[0];

      for (const creneau of creneaux) {
        const prix = prixParCreneau[creneau.label];
        if (!prix) continue;

        const cle = `${dateStr}_${creneau.debut}`;
        const existant = existantsParCle.get(cle);

        try {
          if (existant) {
            // On ne touche pas au prix d'un créneau déjà réservé/confirmé.
            if (existant.statut === 'disponible' && Number(existant.prix) !== Number(prix)) {
              await api.patch(`/creneaux/${existant.id}/`, { prix });
              misAJour += 1;
            }
          } else {
            await api.post('/creneaux/', {
              terrain: terrainId,
              date: dateStr,
              heure_debut: creneau.debut,
              heure_fin: creneau.fin,
              prix,
            });
            crees += 1;
          }
        } catch (error) {
          console.error('Erreur création/mise à jour créneau:', error);
          erreurs += 1;
        }
      }
    }

    return { crees, misAJour, erreurs };
  },
};
