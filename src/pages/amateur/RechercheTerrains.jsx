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
  
  // État unique synchronisé pour les filtres. Par défaut on ne filtre rien
  // (types vide, prix au maximum) pour ne pas cacher de terrains au premier
  // affichage : seule la recherche depuis le hero de l'accueil pré-remplit
  // la zone.
  const [filters, setFilters] = useState({
    localisation: initialSearch.searchZone || 'Tous les quartiers',
    date: 'Dim. 24 Novembre',
    types: [],
    surfaces: [],
    maxPrix: 50000,
    equipements: []
  });

  const [sortBy, setSortBy] = useState('Recommandé');
  const [page, setPage] = useState(1);
  const TERRAINS_PAR_PAGE = 6;

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
      maxPrix: 50000,
      equipements: []
    });
  };

  const filteredTerrains = terrains.filter((terrain) => {
    // Localisation : comparaison exacte sur la vraie ville du terrain
    // (et pas une recherche de texte fragile dans l'adresse complète).
    if (filters.localisation && filters.localisation !== 'Tous les quartiers') {
      if (terrain.ville !== filters.localisation) {
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

  // Revient à la page 1 dès que les filtres/tri changent le résultat, pour
  // ne jamais rester bloqué sur une page devenue vide.
  useEffect(() => {
    setPage(1);
  }, [filters, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedTerrains.length / TERRAINS_PAR_PAGE));
  const pageAffichee = Math.min(page, totalPages);
  const terrainsPage = sortedTerrains.slice(
    (pageAffichee - 1) * TERRAINS_PAR_PAGE,
    pageAffichee * TERRAINS_PAR_PAGE
  );

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
            <div className="bg-white rounded-2xl p-4 border border-gray-200 flex flex-row items-center justify-between gap-2 sm:gap-4">
              <div className="text-xs font-bold text-gray-800 truncate">
                <span className="text-sm font-black text-gray-900">{filteredTerrains.length}</span> terrains trouvés
                {filters.localisation !== 'Tous les quartiers' && ` à ${filters.localisation}`}
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3 text-xs shrink-0">
                <span className="text-gray-500 font-medium hidden xs:inline">Trier par :</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-bold text-gray-900 focus:outline-none cursor-pointer max-w-[140px] sm:max-w-none"
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
                {terrainsPage.map((terrain) => (
                  <TerrainCard
                    key={terrain.id}
                    terrain={terrain}
                    onSelect={() => navigate(`/terrains/${terrain.id}`)}
                  />
                ))}
              </div>
            )}

            {/* Pagination (1 2 3 >) réelle : navigue dans sortedTerrains */}
            {!loading && sortedTerrains.length > 0 && (
              <div className="flex justify-center items-center space-x-2 pt-6">
                <button
                  type="button"
                  disabled={pageAffichee === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-[8px] bg-white border border-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((numeroPage) => (
                  <button
                    key={numeroPage}
                    type="button"
                    onClick={() => setPage(numeroPage)}
                    className={`w-8 h-8 rounded-[8px] font-bold text-xs flex items-center justify-center ${
                      pageAffichee === numeroPage
                        ? 'bg-vert-principal text-white'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {numeroPage}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={pageAffichee === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="w-8 h-8 rounded-[8px] bg-white border border-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
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
