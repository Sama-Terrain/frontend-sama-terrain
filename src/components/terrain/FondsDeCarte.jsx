import { LayersControl, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FONDS_DE_CARTE } from '../../utils/carte';

/**
 * Fonds de carte (Plan / Satellite) avec le bouton pour passer de l'un à
 * l'autre. À placer à l'intérieur d'un <MapContainer>.
 */
export default function FondsDeCarte() {
  return (
    <LayersControl position="topright">
      {FONDS_DE_CARTE.map((fond, index) => (
        <LayersControl.BaseLayer key={fond.nom} name={fond.nom} checked={index === 0}>
          <TileLayer url={fond.url} attribution={fond.attribution} maxZoom={fond.maxZoom} />
        </LayersControl.BaseLayer>
      ))}
    </LayersControl>
  );
}
