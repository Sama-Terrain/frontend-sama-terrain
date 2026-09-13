// Liste des équipements possibles pour un terrain. Centralisée ici pour que
// le formulaire du gérant (AjouterTerrain.jsx) et le filtre de recherche de
// l'amateur (TerrainFilters.jsx) utilisent toujours exactement les mêmes
// libellés (sinon le filtre ne peut jamais matcher un vrai terrain).
export const EQUIPEMENTS_DISPONIBLES = ['Vestiaires', 'Éclairage nocturne', 'Parking', 'Douches', 'Buvette', 'Tribune'];
