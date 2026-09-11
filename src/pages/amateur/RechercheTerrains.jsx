import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TerrainFilters from '../../components/terrain/TerrainFilters';
import TerrainCard from '../../components/terrain/TerrainCard';
import Button from '../../components/ui/Button';
import { terrainService } from '../../services/terrainService';

export default function RechercheTerrains() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialSearch = location.state || {};

  const [terrains, setTerrains] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // État unique synchronisé pour les filtres
  const [filters, setFilters] = useState({
    localisation: initialSearch.searchZone || 'Tous les quartiers',
    date: 'Dim. 24 Novembre',
    types: ['5v5'],
    surfaces: [],
    maxPrix: 20000,
    equipements: []
  });

  const [sortBy, setSortBy] = useState('Recommandé');

  useEffect(() => {
    async function fetchTerrains() {
      try {
        setLoading(true);
        const data = await terrainService.getAllTerrains();
        setTerrains(data);
      } catch (err) {
        console.error('Erreur chargement terrains:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTerrains();
  }, []);

  const handleReset = () => {
    setFilters({
      localisation: 'Tous les quartiers',
      date: 'Dim. 24 Novembre',
      types: [],
      surfaces: [],
      maxPrix: 35000,
      equipements: []
    });
  };

  const filteredTerrains = terrains.filter((terrain) => {
    // Localisation
    if (filters.localisation && filters.localisation !== 'Tous les quartiers') {
      if (!terrain.localisation.toLowerCase().includes(filters.localisation.toLowerCase())) {
        return false;
      }
    }
    // Type (5v5, 6v6, 7v7)
    if (filters.types && filters.types.length > 0) {
      if (!filters.types.includes(terrain.type)) {
        return false;
      }
    }
    // Surface
    if (filters.surfaces && filters.surfaces.length > 0) {
      if (!filters.surfaces.includes(terrain.surface)) {
        return false;
      }
    }
    // Prix max
    if (filters.maxPrix && terrain.prixHeure > filters.maxPrix) {
      return false;
    }
    // Équipements
    if (filters.equipements && filters.equipements.length > 0) {
      const hasAllEquipments = filters.equipements.every((eq) =>
        (terrain.equipements || []).includes(eq)
      );
      if (!hasAllEquipments) return false;
    }

    return true;
  });

  const sortedTerrains = [...filteredTerrains].sort((a, b) => {
    if (sortBy === 'prixAsc') return a.prixHeure - b.prixHeure;
    if (sortBy === 'prixDesc') return b.prixHeure - a.prixHeure;
    if (sortBy === 'note') return b.note - a.note;
    return b.nombreAvis - a.nombreAvis;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-20 font-sans text-left">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Layout : Filtres à gauche, Grille terrains à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Panneau latéral de filtres */}
          <div className="lg:col-span-1">
            <TerrainFilters
              filters={filters}
              setFilters={setFilters}
              onReset={handleReset}
            />
          </div>

          {/* Zone principale : En-tête + Liste des cartes */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* En-tête de la liste avec compteur "12 terrains trouvés à Dakar" & Tri */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs font-bold text-gray-800">
                <span className="text-sm font-black text-gray-900">{filteredTerrains.length}</span> terrains trouvés à Dakar
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <span className="text-gray-500 font-medium">Trier par :</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-bold text-gray-900 focus:outline-none cursor-pointer"
                >
                  <option value="Recommandé">Recommandé</option>
                  <option value="note">Meilleures notes</option>
                  <option value="prixAsc">Prix croissant</option>
                  <option value="prixDesc">Prix décroissant</option>
                </select>
              </div>
            </div>

            {/* Grille de cartes de terrains (SANS toucher au composant TerrainCard) */}
            {loading ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-[#004030] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-gray-500 font-semibold">Chargement des terrains...</p>
              </div>
            ) : sortedTerrains.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-3">
                <p className="text-base font-bold text-gray-700">Aucun terrain ne correspond à vos critères</p>
                <p className="text-xs text-gray-500">Essayez d'élargir le prix max ou d'effacer les filtres.</p>
                <Button
                  onClick={handleReset}
                  variant="primary"
                  size="sm"
                  rounded="8px"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {sortedTerrains.map((terrain) => (
                  <TerrainCard
                    key={terrain.id}
                    terrain={terrain}
                    onSelect={() => navigate(`/terrains/${terrain.id}`)}
                  />
                ))}
              </div>
            )}

            {/* Pagination (1 2 3 >) identique Figma */}
            {!loading && sortedTerrains.length > 0 && (
              <div className="flex justify-center items-center space-x-2 pt-6">
                <button className="w-8 h-8 rounded-[8px] bg-[#004030] text-white font-bold text-xs flex items-center justify-center">
                  1
                </button>
                <button className="w-8 h-8 rounded-[8px] bg-white border border-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center hover:bg-gray-50">
                  2
                </button>
                <button className="w-8 h-8 rounded-[8px] bg-white border border-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center hover:bg-gray-50">
                  3
                </button>
                <button className="w-8 h-8 rounded-[8px] bg-white border border-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center hover:bg-gray-50">
                  ›
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
