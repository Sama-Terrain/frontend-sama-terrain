import { MapContainer, Marker } from 'react-leaflet';
import { Navigation } from 'lucide-react';
import FondsDeCarte from './FondsDeCarte';
import { iconeTerrain } from '../../utils/carte';

/**
 * Carte de localisation d'un terrain.
 *
 * - Si le gérant a renseigné la position GPS : carte (Plan ou Satellite,
 *   voir FondsDeCarte) avec un marqueur + bouton d'itinéraire vers Google Maps.
 * - Sinon : carte Google Maps à partir de l'adresse écrite (l'affichage
 *   d'origine de la fiche terrain, moins précis, d'où l'intérêt du GPS).
 */
export default function CarteTerrain({ latitude, longitude, adresse, ville }) {
  const lat = Number(latitude);
  const lon = Number(longitude);
  const aUnePositionGps = latitude !== null && latitude !== undefined && latitude !== '' && Number.isFinite(lat) && Number.isFinite(lon);

  if (!aUnePositionGps) {
    const adresseComplete = encodeURIComponent([adresse, ville, 'Sénégal'].filter(Boolean).join(', '));
    return (
      <div className="h-44 rounded-[8px] border border-gray-200 overflow-hidden">
        <iframe
          title="Localisation du terrain"
          src={`https://maps.google.com/maps?q=${adresseComplete}&z=14&output=embed`}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* scrollWheelZoom désactivé : la molette fait défiler la page, pas
          la carte (on zoome avec les boutons + / -). */}
      <MapContainer
        center={[lat, lon]}
        zoom={16}
        scrollWheelZoom={false}
        className="w-full h-56 rounded-[8px] border border-gray-200 z-0"
      >
        <FondsDeCarte />
        <Marker position={[lat, lon]} icon={iconeTerrain} />
      </MapContainer>
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] bg-vert-principal text-white text-xs font-bold hover:bg-vert-survol transition-colors"
      >
        <Navigation size={14} /> Itinéraire vers le terrain
      </a>
    </div>
  );
}
