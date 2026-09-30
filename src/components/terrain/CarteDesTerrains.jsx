import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import FondsDeCarte from './FondsDeCarte';
import { CENTRE_DAKAR, iconeTerrain } from '../../utils/carte';
import { terrainService } from '../../services/terrainService';

// Recadre la carte pour que tous les terrains soient visibles.
function AjusterVue({ positions }) {
  const carte = useMap();
  useEffect(() => {
    if (positions.length === 1) {
      carte.setView(positions[0], 14);
    } else if (positions.length > 1) {
      carte.fitBounds(positions, { padding: [40, 40], maxZoom: 15 });
    }
  }, [positions, carte]);
  return null;
}

/**
 * Carte de la page d'accueil : un marqueur par terrain de la plateforme.
 * Seuls les terrains dont le gérant a indiqué la position GPS y figurent.
 * Un clic sur un marqueur affiche le terrain et un bouton pour l'ouvrir.
 */
export default function CarteDesTerrains({ onVoirTerrain }) {
  const [terrains, setTerrains] = useState([]);

  useEffect(() => {
    terrainService
      .getTerrains()
      .then((liste) => setTerrains(liste.filter((t) => t.latitude !== null && t.longitude !== null)))
      .catch((erreur) => console.error('Erreur chargement des terrains pour la carte :', erreur));
  }, []);

  // Calculé seulement quand la liste change : sinon la carte se recadrerait
  // à chaque ré-affichage de la page, même pendant que l'utilisateur la déplace.
  const positions = useMemo(
    () => terrains.map((t) => [Number(t.latitude), Number(t.longitude)]),
    [terrains]
  );

  return (
    <MapContainer
      center={CENTRE_DAKAR}
      zoom={11}
      scrollWheelZoom={false}
      zoomControl={false}
      className="absolute inset-0 w-full h-full z-0"
    >
      <FondsDeCarte />
      {/* En bas à droite : le coin en haut à gauche est pris par le badge de la section */}
      <ZoomControl position="bottomright" />
      <AjusterVue positions={positions} />

      {terrains.map((terrain, index) => (
        <Marker key={terrain.id} position={positions[index]} icon={iconeTerrain}>
          <Popup>
            <div className="space-y-1">
              <p className="font-bold text-gray-900">{terrain.nom}</p>
              <p className="text-xs text-gray-500">{terrain.ville}</p>
              <p className="text-xs font-bold text-vert-principal">
                {Number(terrain.prixHeure).toLocaleString('fr-FR')} FCFA / heure
              </p>
              <button
                type="button"
                onClick={() => onVoirTerrain(terrain.id)}
                className="mt-1 px-3 py-1.5 rounded-full bg-vert-principal text-white text-[11px] font-bold cursor-pointer"
              >
                Voir le terrain →
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
