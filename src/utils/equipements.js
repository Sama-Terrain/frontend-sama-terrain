import { Shirt, Lightbulb, Droplet, Car, Coffee, Users } from 'lucide-react';

// Liste des équipements possibles pour un terrain. Centralisée ici pour que
// le formulaire du gérant (AjouterTerrain.jsx) et le filtre de recherche de
// l'amateur (TerrainFilters.jsx) utilisent toujours exactement les mêmes
// libellés (sinon le filtre ne peut jamais matcher un vrai terrain).
export const EQUIPEMENTS_DISPONIBLES = ['Vestiaires', 'Éclairage nocturne', 'Parking', 'Douches', 'Buvette', 'Tribune'];

// Icône affichée à côté de chaque équipement (fiche terrain côté gérant et
// côté joueur). Un équipement sans icône s'affiche simplement sans icône.
export const ICONES_EQUIPEMENTS = {
  Vestiaires: Shirt,
  'Éclairage nocturne': Lightbulb,
  Douches: Droplet,
  Parking: Car,
  Buvette: Coffee,
  Tribune: Users,
};
