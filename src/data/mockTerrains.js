import keurMadiorImg from '../assets/keur_madior.jpg';
import samaStadiumImg from '../assets/sama_stadium.jpg';
import dakarFootImg from '../assets/dakar_foot.jpg';

export const MOCK_TERRAINS = [
  {
    id: 1,
    nom: 'Complexe Keur Madior',
    localisation: 'Almadies, Dakar',
    type: '5v5',
    prixHeure: 25000,
    avance: 5000,
    note: 4.8,
    nombreAvis: 24,
    disponible: true,
    image: keurMadiorImg,
    description: 'Terrain synthétique de dernière génération avec éclairage LED nocturne, vestiaires climatisés et parking sécurisé.'
  },
  {
    id: 2,
    nom: 'Sama-Terrain Stadium',
    localisation: 'Mermoz, Dakar',
    type: '5v5',
    prixHeure: 30000,
    avance: 5000,
    note: 4.9,
    nombreAvis: 42,
    disponible: true,
    image: samaStadiumImg,
    description: 'Complexe sportif haut de gamme situé au cœur de Mermoz. Gazon synthétique premium et service de rafraîchissement.'
  },
  {
    id: 3,
    nom: 'Dakar Foot Center',
    localisation: 'Fann, Dakar',
    type: '5v5',
    prixHeure: 22000,
    avance: 5000,
    note: 4.7,
    nombreAvis: 18,
    disponible: true,
    image: dakarFootImg,
    description: 'Centre de foot en salle / indoor ultra moderne. Idéal pour jouer à l’abri du soleil ou des intempéries.'
  }
];
