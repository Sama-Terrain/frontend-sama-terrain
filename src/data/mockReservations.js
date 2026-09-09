import { MOCK_TERRAINS } from './mockTerrains';

export const mockReservations = [
  {
    id: 'RES-001',
    terrainId: 6,
    nomTerrain: 'Stadium Mermoz - Elite Arena',
    image: MOCK_TERRAINS[5]?.image || '',
    status: 'Confirmée',
    statusBadgeClass: 'bg-emerald-100 text-emerald-700',
    acomptePaye: true,
    dateTexte: 'Vendredi 29 Novembre — 18:00 à 19:00',
    montantAcompte: 15000,
    prixTotal: 30000,
    tabCategory: 'a-venir'
  },
  {
    id: 'RES-002',
    terrainId: 1,
    nomTerrain: 'Terrain Paco Boy',
    image: MOCK_TERRAINS[0]?.image || '',
    status: 'Confirmée',
    statusBadgeClass: 'bg-emerald-100 text-emerald-700',
    acomptePaye: true,
    dateTexte: 'Samedi 07 Décembre — 19:00 à 20:00',
    montantAcompte: 15000,
    prixTotal: 30000,
    tabCategory: 'a-venir'
  },
  {
    id: 'RES-003',
    terrainId: 4,
    nomTerrain: 'Yoff Municipal Mini Foot',
    image: MOCK_TERRAINS[3]?.image || '',
    status: 'Terminée',
    statusBadgeClass: 'bg-gray-100 text-gray-700',
    acomptePaye: true,
    dateTexte: 'Lundi 15 Octobre — 20:00 à 21:00',
    montantAcompte: 10000,
    prixTotal: 25000,
    tabCategory: 'passees'
  },
  {
    id: 'RES-004',
    terrainId: 3,
    nomTerrain: 'Dakar Foot Center',
    image: MOCK_TERRAINS[2]?.image || '',
    status: 'Annulée',
    statusBadgeClass: 'bg-red-100 text-red-700',
    acomptePaye: false,
    dateTexte: 'Mardi 01 Novembre — 17:00 à 18:00',
    montantAcompte: 0,
    prixTotal: 35000,
    tabCategory: 'annulees'
  }
];
