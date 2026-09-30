import { useEffect, useState } from 'react';
import { MapContainer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { LocateFixed, X } from 'lucide-react';
import FondsDeCarte from './FondsDeCarte';
import { CENTRE_DAKAR, iconeTerrain } from '../../utils/carte';

// Un clic sur la carte = le terrain est ici.
function ClicSurLaCarte({ onChoisir }) {
  useMapEvents({
    click(evenement) {
      onChoisir(evenement.latlng.lat, evenement.latlng.lng);
    },
  });
  return null;
}

// Si la position choisie sort de la zone visible (ex: après "Utiliser ma
// position"), on déplace la carte dessus. Un simple clic ne fait pas bouger la carte.
function SuivrePosition({ position }) {
  const carte = useMap();
  useEffect(() => {
    if (position && !carte.getBounds().contains(position)) {
      carte.setView(position, 17);
    }
  }, [position, carte]);
  return null;
}

/**
 * Carte interactive pour que le gérant indique où se trouve son terrain :
 * il clique sur la carte (ou déplace le marqueur), ou utilise le GPS de
 * son appareil. Renvoie la position choisie via onChange(latitude, longitude),
 * arrondie à 6 décimales (environ 10 cm de précision).
 */
export default function ChoixPositionCarte({ latitude, longitude, onChange }) {
  const [gpsEnCours, setGpsEnCours] = useState(false);
  const [erreurGps, setErreurGps] = useState('');

  const aUnePosition = latitude !== '' && latitude !== null && latitude !== undefined;
  const position = aUnePosition ? [Number(latitude), Number(longitude)] : null;

  const choisir = (lat, lon) => onChange(lat.toFixed(6), lon.toFixed(6));

  // Le GPS de l'appareil : le plus précis quand le gérant est sur place.
  const utiliserMaPosition = () => {
    if (!navigator.geolocation) {
      setErreurGps('Votre navigateur ne permet pas la géolocalisation : cliquez sur la carte.');
      return;
    }
    setErreurGps('');
    setGpsEnCours(true);
    navigator.geolocation.getCurrentPosition(
      (resultat) => {
        choisir(resultat.coords.latitude, resultat.coords.longitude);
        setGpsEnCours(false);
      },
      () => {
        setErreurGps('Position introuvable : autorisez la localisation dans votre navigateur, ou cliquez sur la carte.');
        setGpsEnCours(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={utiliserMaPosition}
          disabled={gpsEnCours}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[8px] border border-vert-principal text-vert-principal text-xs font-bold hover:bg-vert-clair transition-colors cursor-pointer disabled:opacity-60"
        >
          <LocateFixed size={14} />
          {gpsEnCours ? 'Localisation en cours...' : 'Utiliser ma position actuelle'}
        </button>
        {aUnePosition && (
          <button
            type="button"
            onClick={() => onChange('', '')}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-gray-500 hover:text-red-600 cursor-pointer"
          >
            <X size={14} /> Retirer la position
          </button>
        )}
      </div>

      {erreurGps && <p className="text-sm text-red-600">{erreurGps}</p>}

      <MapContainer
        center={position || CENTRE_DAKAR}
        zoom={position ? 17 : 12}
        className="w-full h-72 rounded-[8px] border border-gray-200 z-0"
      >
        <FondsDeCarte />
        <ClicSurLaCarte onChoisir={choisir} />
        <SuivrePosition position={position} />
        {position && (
          <Marker
            position={position}
            icon={iconeTerrain}
            draggable
            eventHandlers={{
              dragend: (evenement) => {
                const { lat, lng } = evenement.target.getLatLng();
                choisir(lat, lng);
              },
            }}
          />
        )}
      </MapContainer>

      <p className="text-xs text-gray-500">
        {aUnePosition
          ? 'Position enregistrée. Déplacez le marqueur ou cliquez ailleurs pour la corriger.'
          : 'Cliquez sur la carte à l\'emplacement exact du terrain. Astuce : passez en vue « Satellite » (en haut à droite) pour voir le terrain.'}
      </p>
    </div>
  );
}
