import keurMadiorImg from '../assets/keur_madior.jpg';
import samaStadiumImg from '../assets/sama_stadium.jpg';
import dakarFootImg from '../assets/dakar_foot.jpg';
import ngorArenaImg from '../assets/ngor_arena.jpg';
import footDorImg from '../assets/foot_dor.jpg';
import yoffMunicipalImg from '../assets/yoff_municipal.jpg';

export const MOCK_TERRAINS = [
  {
    id: 1,
    nom: 'Dakar Foot Center',
    localisation: 'Fann, Dakar',
    type: '5v5',
    prixHeure: 22000,
    avance: 5000,
    note: 4.7,
    nombreAvis: 18,
    disponible: true,
    surface: 'Synthétique',
    equipements: ['Vestiaires', 'Éclairage nocturne'],
    image: dakarFootImg,
    description: 'Centre de foot en salle / indoor ultra moderne. Idéal pour jouer à l’abri du soleil ou des intempéries.'
  },
  {
    id: 2,
    nom: 'Ngor Arena',
    localisation: 'Ngor, Dakar',
    type: '6v6',
    prixHeure: 25000,
    avance: 5000,
    note: 4.8,
    nombreAvis: 32,
    disponible: true,
    surface: 'Synthétique',
    equipements: ['Vestiaires', 'Éclairage nocturne', 'Parking sécurisé'],
    image: ngorArenaImg,
    description: 'Nouveau terrain synthétique bord de mer avec brise marine rafraîchissante et installation d’éclairage pro.'
  },
  {
    id: 3,
    nom: 'Foot d\'Or',
    localisation: 'Zone B, Dakar',
    type: '5v5',
    prixHeure: 20000,
    avance: 5000,
    note: 4.6,
    nombreAvis: 15,
    disponible: true,
    surface: 'Synthétique',
    equipements: ['Vestiaires', 'Éclairage nocturne'],
    image: footDorImg,
    description: 'Complexe indoor cosy avec vestiaires privés, bar de rafraîchissements et diffusion des grands matchs.'
  },
  {
    id: 4,
    nom: 'Terrain Municipal de Yoff',
    localisation: 'Yoff, Dakar',
    type: '7v7',
    prixHeure: 18000,
    avance: 5000,
    note: 4.5,
    nombreAvis: 28,
    disponible: true,
    surface: 'Synthétique',
    equipements: ['Éclairage nocturne'],
    image: yoffMunicipalImg,
    description: 'Grand terrain synthétique adapté aux matchs à 7 contre 7. Ambiance sportive et conviviale.'
  },
  {
    id: 5,
    nom: 'Complexe Keur Madior',
    localisation: 'Almadies, Dakar',
    type: '5v5',
    prixHeure: 25000,
    avance: 5000,
    note: 4.9,
    nombreAvis: 24,
    disponible: true,
    surface: 'Synthétique',
    equipements: ['Vestiaires', 'Éclairage nocturne', 'Parking sécurisé'],
    image: keurMadiorImg,
    description: 'Terrain synthétique de dernière génération avec éclairage LED nocturne, vestiaires climatisés et parking sécurisé.'
  },
  {
    id: 6,
    nom: 'Sama-Terrain Stadium',
    localisation: 'Mermoz, Dakar',
    type: '5v5',
    prixHeure: 30000,
    avance: 5000,
    note: 4.9,
    nombreAvis: 42,
    disponible: true,
    surface: 'Synthétique',
    equipements: ['Vestiaires', 'Éclairage nocturne', 'Parking sécurisé'],
    image: samaStadiumImg,
    description: 'Complexe sportif haut de gamme situé au cœur de Mermoz. Gazon synthétique premium et service de rafraîchissement.'
  }
];
