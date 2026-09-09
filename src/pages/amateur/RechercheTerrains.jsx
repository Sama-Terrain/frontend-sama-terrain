import { useState, useEffect } from 'react';
import { ChevronRight, Filter, SlidersHorizontal } from 'lucide-react';
import TerrainCard from '../../components/terrain/TerrainCard';
import TerrainFilters from '../../components/terrain/TerrainFilters';
import { terrainService } from '../../services/terrainService';

export default function RechercheTerrains({ onNavigate, onSelectTerrain, initialSearch = {} }) {
  const [terrains, setTerrains] = useState([]);
  const [loading, setLoading] = useState(true);

  // État des filtres
  const [filters, setFilters] = useState({
    localisation: initialSearch.searchZone || 'Tous les quartiers',
    date: initialSearch.searchDate || 'Dim. 24 Novembre',
    types: ['5v5'],
    surfaces: [],
    maxPrix: 30000,
    equipements: []
  });

  // État de tri
  const [sortBy, setSortBy] = useState('recommande');

  // État pagination
  const [currentPage, setCurrentPage] = useState(1);

  // État tiroir mobile filtres
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Chargement des terrains via le service
  useEffect(() => {
    async function fetchTerrains() {
      try {
        setLoading(true);
        const data = await terrainService.getTerrains();
        setTerrains(data);
      } catch (error) {
        console.error('Erreur chargement terrains :', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTerrains();
  }, []);

  // Filtrage des terrains
  const filteredTerrains = terrains.filter((terrain) => {
    // Filtre Localisation
    if (
      filters.localisation &&
      filters.localisation !== 'Tous les quartiers' &&
      !terrain.localisation.toLowerCase().includes(filters.localisation.toLowerCase())
    ) {
      return false;
    }

    // Filtre Type (ex: 5v5, 6v6, 7v7)
    if (filters.types && filters.types.length > 0) {
      if (!filters.types.includes(terrain.type)) {
        return false;
      }
    }

    // Filtre Prix Max
    if (filters.maxPrix && terrain.prixHeure > filters.maxPrix) {
      return false;
    }

    // Filtre Surface
    if (filters.surfaces && filters.surfaces.length > 0) {
      if (!filters.surfaces.includes(terrain.surface)) {
        return false;
      }
    }

    // Filtre Équipements
    if (filters.equipements && filters.equipements.length > 0) {
      const hasAllEq = filters.equipements.every((eq) =>
        (terrain.equipements || []).includes(eq)
      );
      if (!hasAllEq) return false;
    }

    return true;
  });

  // Réinitialiser tous les filtres
  const handleResetFilters = () => {
    setFilters({
      localisation: 'Tous les quartiers',
      date: 'Dim. 24 Novembre',
      types: [],
      surfaces: [],
      maxPrix: 35000,
      equipements: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-20 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Grille principale Layout (Filtres à gauche, Terrains à droite) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Sidebar des Filtres Desktop */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-24">
            <TerrainFilters
              filters={filters}
              setFilters={setFilters}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Bouton d'affichage des filtres sur Mobile */}
          <div className="lg:hidden flex items-center justify-between mb-4 bg-white p-4 rounded-xl border border-gray-200">
            <span className="text-sm font-bold text-gray-800">
              {filteredTerrains.length} terrains trouvés
            </span>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="px-3.5 py-2 bg-emerald-50 text-[#004030] font-bold text-xs rounded-lg flex items-center gap-2"
            >
              <SlidersHorizontal size={16} />
              <span>Filtres</span>
            </button>
          </div>

          {/* Tiroir Filtres Mobile */}
          {showMobileFilters && (
            <div className="lg:hidden mb-6">
              <TerrainFilters
                filters={filters}
                setFilters={setFilters}
                onReset={handleResetFilters}
              />
            </div>
          )}

          {/* Zone Principale des Terrains */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Barre Supérieure d'Information & Tri */}
            <div className="bg-white rounded-2xl p-4 sm:px-6 sm:py-3.5 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-sm font-extrabold text-gray-900">
                {filteredTerrains.length} terrains trouvés à Dakar
              </h2>

              <div className="flex items-center space-x-2 text-xs text-gray-600 self-end sm:self-auto">
                <label htmlFor="sortBy" className="font-semibold text-gray-500">
                  Trier par :
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-bold text-gray-900 focus:outline-none cursor-pointer"
                >
                  <option value="recommande">Recommandé</option>
                  <option value="prix_croissant">Prix : croissant</option>
                  <option value="prix_decroissant">Prix : décroissant</option>
                  <option value="note">Meilleurs avis</option>
                </select>
              </div>
            </div>

            {/* Grille des Terrains */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-80 bg-gray-200 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredTerrains.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-4">
                <p className="text-gray-500 text-sm">
                  Aucun terrain ne correspond à vos critères de recherche actuels.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-[#004030] text-white font-bold text-xs rounded-xl hover:bg-[#005943]"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredTerrains.map((terrain) => (
                  <TerrainCard
                    key={terrain.id}
                    terrain={terrain}
                    onSelect={(t) => {
                      if (onSelectTerrain) onSelectTerrain(t);
                      if (onNavigate) onNavigate('detail', { terrainId: t.id });
                    }}
                  />
                ))}
              </div>
            )}

            {/* Pagination au bas de page (Fidèle à la maquette Figma) */}
            <div className="pt-8 flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(1)}
                className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${
                  currentPage === 1
                    ? 'bg-[#004030] text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                1
              </button>
              <button
                onClick={() => setCurrentPage(2)}
                className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${
                  currentPage === 2
                    ? 'bg-[#004030] text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                2
              </button>
              <button
                onClick={() => setCurrentPage(3)}
                className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${
                  currentPage === 3
                    ? 'bg-[#004030] text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                3
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, 3))}
                className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-50"
                title="Page suivante"
              >
                <ChevronRight size={16} />
              </button>
            </div>

          </main>

        </div>

      </div>
    </div>
  );
}
