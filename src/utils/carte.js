import L from 'leaflet';
import iconeMarqueur from 'leaflet/dist/images/marker-icon.png';
import iconeMarqueur2x from 'leaflet/dist/images/marker-icon-2x.png';
import ombreMarqueur from 'leaflet/dist/images/marker-shadow.png';

// Réglages communs à toutes les cartes du site (Leaflet).

// Centre par défaut quand aucune position n'est connue : Dakar.
export const CENTRE_DAKAR = [14.7167, -17.4677];

// Fonds de carte gratuits, sans clé d'API. Le premier est affiché par défaut ;
// l'utilisateur peut passer de l'un à l'autre avec le bouton en haut à droite.
export const FONDS_DE_CARTE = [
  {
    // Plan clair et lisible avec le nom des lieux (données OpenStreetMap,
    // style "Humanitaire", hébergé gratuitement par OpenStreetMap France).
    // NB : CARTO, testé avant, exige maintenant une clé d'API.
    nom: 'Plan',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, style Humanitarian OSM Team, hébergé par OpenStreetMap France',
    maxZoom: 20,
  },
  {
    // Vue satellite : on voit le terrain de foot lui-même, idéal pour
    // placer le marqueur au bon endroit.
    nom: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Images &copy; Esri',
    maxZoom: 19,
  },
];

// Avec Vite, Leaflet ne trouve pas tout seul les images de son marqueur :
// on lui indique explicitement où elles sont.
export const iconeTerrain = L.icon({
  iconUrl: iconeMarqueur,
  iconRetinaUrl: iconeMarqueur2x,
  shadowUrl: ombreMarqueur,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
