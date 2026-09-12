import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import GerantLayout from '../../components/gerant/GerantLayout';
import CreneauxGrid from '../../components/gerant/CreneauxGrid';
import ConfigurerCreneauxPanel from '../../components/gerant/ConfigurerCreneauxPanel';
import { gerantService } from '../../services/gerantService';
import { generateCreneaux } from '../../utils/generateCreneaux';
import { JOURS_SEMAINE, JOURS_WEEKEND } from '../../data/mockGerantData';

const JOURS_SEMAINE_OUVRABLE = JOURS_SEMAINE.filter((jour) => !JOURS_WEEKEND.includes(jour));

// Construit la grille initiale {jour: {creneauLabel: prix}} à partir des tarifs
// semaine/week-end du terrain (logique par défaut : week-end plus cher).
function buildGrilleInitiale(creneaux, prixSemaine, prixWeekend) {
  const grille = {};
  JOURS_SEMAINE.forEach((jour) => {
    const prix = JOURS_WEEKEND.includes(jour) ? prixWeekend : prixSemaine;
    grille[jour] = {};
    creneaux.forEach((creneau) => {
      grille[jour][creneau.label] = prix;
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

  useEffect(() => {
    async function loadConfigs() {
      try {
        setLoading(true);
        const [configsData, profileData] = await Promise.all([
          gerantService.getCreneauxConfigs(),
          gerantService.getGerantProfile(),
        ]);
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
      prixInitiaux[creneau.label] = config.prixSemaine;
    });
    setPrixParCreneau(prixInitiaux);
    setJoursSelectionnes(JOURS_SEMAINE_OUVRABLE);
    setGrille(buildGrilleInitiale(creneaux, config.prixSemaine, config.prixWeekend));
  }, [config, creneaux]);

  const handleToggleJour = (jour) => {
    setJoursSelectionnes((current) =>
      current.includes(jour) ? current.filter((item) => item !== jour) : [...current, jour]
    );
  };

  const handleChangePrix = (creneauLabel, prix) => {
    setPrixParCreneau((current) => ({ ...current, [creneauLabel]: prix }));
  };

  // Applique le tarif de chaque créneau configuré aux jours sélectionnés
  const handleAppliquer = () => {
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
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">
          <CreneauxGrid creneaux={creneaux} grille={grille} />

          <ConfigurerCreneauxPanel
            terrainLabel={`${config.terrainNom} (${config.terrainType})`}
            creneaux={creneaux}
            joursSelectionnes={joursSelectionnes}
            onToggleJour={handleToggleJour}
            prixParCreneau={prixParCreneau}
            onChangePrix={handleChangePrix}
            onAppliquer={handleAppliquer}
          />
        </section>
      )}

    </GerantLayout>
  );
}
