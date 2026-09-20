import { useState, useEffect, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import GerantLayout from '../../components/gerant/GerantLayout';
import CreneauxGrid from '../../components/gerant/CreneauxGrid';
import ConfigurerCreneauxPanel from '../../components/gerant/ConfigurerCreneauxPanel';
import { gerantService } from '../../services/gerantService';
import { creneauService } from '../../services/creneauService';
import { generateCreneaux } from '../../utils/generateCreneaux';
import { JOURS_SEMAINE, JOURS_WEEKEND } from '../../utils/jours';

const JOURS_SEMAINE_OUVRABLE = JOURS_SEMAINE.filter((jour) => !JOURS_WEEKEND.includes(jour));

// Construit la grille initiale {jour: {creneauLabel: prix}}, avec le prix par
// défaut du terrain partout (le gérant personnalise ensuite via le panneau).
function buildGrilleInitiale(creneaux, prixParDefaut) {
  const grille = {};
  JOURS_SEMAINE.forEach((jour) => {
    grille[jour] = {};
    creneaux.forEach((creneau) => {
      grille[jour][creneau.label] = prixParDefaut;
    });
  });
  return grille;
}

/**
 * Page GererCreneaux (Espace Gérant)
 *
 * Les créneaux horaires d'un terrain sont générés automatiquement à partir de
 * son heure d'ouverture/fermeture (renseignées à la création du terrain).
 * Le gérant fixe ensuite un tarif par créneau puis l'applique aux jours de
 * son choix — ce qui permet des tarifs différents en semaine et le week-end.
 */
export default function GererCreneaux({ onLogout }) {
  const [configs, setConfigs] = useState([]);
  const [terrainId, setTerrainId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [joursSelectionnes, setJoursSelectionnes] = useState(JOURS_SEMAINE_OUVRABLE);
  const [prixParCreneau, setPrixParCreneau] = useState({});
  const [grille, setGrille] = useState({});
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [messageApplication, setMessageApplication] = useState('');

  useEffect(() => {
    async function loadConfigs() {
      try {
        setLoading(true);
        const [terrains, profileData] = await Promise.all([
          gerantService.getMesTerrains(),
          gerantService.getGerantProfile(),
        ]);
        // On dérive la "config" de chaque terrain directement depuis ses
        // horaires d'ouverture/fermeture et son prix par heure (pas de
        // modèle récurrent séparé côté backend).
        const configsData = terrains.map((terrain) => ({
          terrainId: terrain.id,
          terrainNom: terrain.nom,
          terrainType: terrain.type,
          ouverture: terrain.heure_ouverture.slice(0, 5),
          fermeture: terrain.heure_fermeture.slice(0, 5),
          prixParDefaut: terrain.prix_heure,
        }));
        setConfigs(configsData);
        setProfile(profileData);
        if (configsData.length > 0) {
          setTerrainId(configsData[0].terrainId);
        }
      } catch (error) {
        console.error('Erreur chargement des créneaux gérant:', error);
      } finally {
        setLoading(false);
      }
    }

    loadConfigs();
  }, []);

  const config = configs.find((item) => item.terrainId === terrainId);

  // Créneaux générés automatiquement depuis l'heure d'ouverture/fermeture du terrain sélectionné
  const creneaux = useMemo(() => {
    if (!config) return [];
    return generateCreneaux(config.ouverture, config.fermeture);
  }, [config]);

  // Ré-initialise le formulaire (tarifs & grille) à chaque changement de terrain
  useEffect(() => {
    if (!config || creneaux.length === 0) return;

    const prixInitiaux = {};
    creneaux.forEach((creneau) => {
      prixInitiaux[creneau.label] = config.prixParDefaut;
    });
    setPrixParCreneau(prixInitiaux);
    setJoursSelectionnes(JOURS_SEMAINE_OUVRABLE);
    setGrille(buildGrilleInitiale(creneaux, config.prixParDefaut));
  }, [config, creneaux]);

  const handleToggleJour = (jour) => {
    setJoursSelectionnes((current) =>
      current.includes(jour) ? current.filter((item) => item !== jour) : [...current, jour]
    );
  };

  const handleChangePrix = (creneauLabel, prix) => {
    // Jamais de prix négatif/invalide envoyé au backend, même si l'attribut
    // HTML `min` de l'input est contourné (saisie clavier, collage...).
    const prixValide = Number.isFinite(prix) && prix > 0 ? prix : 0;
    setPrixParCreneau((current) => ({ ...current, [creneauLabel]: prixValide }));
  };

  // Applique le tarif de chaque créneau configuré aux jours sélectionnés :
  // crée/actualise réellement les créneaux datés du backend sur le mois à venir.
  const handleAppliquer = async () => {
    setEnvoiEnCours(true);
    setMessageApplication('');

    const resultat = await creneauService.genererCreneaux({
      terrainId,
      creneaux,
      joursSelectionnes,
      prixParCreneau,
    });

    setEnvoiEnCours(false);
    setMessageApplication(
      `${resultat.crees} créneau(x) créé(s), ${resultat.misAJour} mis à jour` +
      (resultat.erreurs > 0 ? `, ${resultat.erreurs} erreur(s).` : '.')
    );

    setGrille((current) => {
      const next = { ...current };
      joursSelectionnes.forEach((jour) => {
        next[jour] = { ...next[jour], ...prixParCreneau };
      });
      return next;
    });
  };

  if (loading) {
    return (
      <GerantLayout title="Créneaux & Tarifs" profile={profile} onLogout={onLogout}>
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-bold">Chargement des créneaux...</p>
        </div>
      </GerantLayout>
    );
  }

  return (
    <GerantLayout title="Créneaux & Tarifs" profile={profile} onLogout={onLogout}>

      {/* SÉLECTEUR DE TERRAIN */}
      <div className="bg-white rounded-[12px] border border-gray-200/80 shadow-2xs p-5 flex items-center gap-4">
        <label className="text-sm font-semibold text-gray-700 shrink-0">Sélectionner Terrain :</label>
        <div className="relative w-full sm:w-72">
          <select
            value={terrainId ?? ''}
            onChange={(e) => setTerrainId(Number(e.target.value))}
            className="w-full appearance-none border border-gray-200 rounded-[8px] px-4 py-2.5 text-sm font-bold text-gray-900 outline-none focus:border-vert-principal cursor-pointer"
          >
            {configs.map((item) => (
              <option key={item.terrainId} value={item.terrainId}>
                {item.terrainNom} ({item.terrainType})
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* GRILLE + PANNEAU DE CONFIGURATION */}
      {config && (
        <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-5 items-start">
          <CreneauxGrid creneaux={creneaux} grille={grille} />

          <ConfigurerCreneauxPanel
            terrainLabel={`${config.terrainNom} (${config.terrainType})`}
            creneaux={creneaux}
            joursSelectionnes={joursSelectionnes}
            onToggleJour={handleToggleJour}
            prixParCreneau={prixParCreneau}
            onChangePrix={handleChangePrix}
            onAppliquer={handleAppliquer}
            envoiEnCours={envoiEnCours}
            message={messageApplication}
          />
        </section>
      )}

    </GerantLayout>
  );
}
