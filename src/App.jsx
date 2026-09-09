import { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Accueil from './pages/amateur/Accueil';
import RechercheTerrains from './pages/amateur/RechercheTerrains';
import DetailTerrain from './pages/amateur/DetailTerrain';

function App() {
  // Récupération de la page actuelle depuis localStorage au rechargement (F5)
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('sama_current_page') || 'accueil';
  });

  // Récupération du terrain sélectionné depuis localStorage
  const [selectedTerrain, setSelectedTerrain] = useState(() => {
    const saved = localStorage.getItem('sama_selected_terrain');
    return saved ? Number(saved) : 1;
  });

  const [searchParams, setSearchParams] = useState({});
  const [reservationData, setReservationData] = useState(null);

  // Synchronisation systématique avec localStorage pour persister la navigation
  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page);
    localStorage.setItem('sama_current_page', page);

    if (params.terrainId) {
      setSelectedTerrain(params.terrainId);
      localStorage.setItem('sama_selected_terrain', params.terrainId);
    }
    if (params) {
      setSearchParams(params);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 font-sans">
      {/* Barre de navigation supérieure */}
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

      {/* Contenu principal de la page actuelle */}
      <main className="flex-1">
        {currentPage === 'accueil' && (
          <Accueil 
            onNavigate={handleNavigate}
            onSelectTerrain={(t) => {
              setSelectedTerrain(t.id);
              localStorage.setItem('sama_selected_terrain', t.id);
            }}
          />
        )}

        {currentPage === 'terrains' && (
          <RechercheTerrains
            onNavigate={handleNavigate}
            onSelectTerrain={(t) => {
              setSelectedTerrain(t.id);
              localStorage.setItem('sama_selected_terrain', t.id);
            }}
            initialSearch={searchParams}
          />
        )}

        {currentPage === 'detail' && (
          <DetailTerrain
            terrainId={selectedTerrain || 1}
            onNavigate={handleNavigate}
            onSelectSlot={setReservationData}
          />
        )}

        {/* Espace pour les pages à venir */}
        {currentPage !== 'accueil' && currentPage !== 'terrains' && currentPage !== 'detail' && (
          <div className="max-w-4xl mx-auto py-20 px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Page "{currentPage}" bientôt prête !
            </h2>
            <p className="text-gray-600 mb-6">
              Cette étape sera intégrée juste après la validation de la page Détail.
            </p>
            <button
              onClick={() => handleNavigate('accueil')}
              className="px-6 py-2.5 bg-[#004030] text-white font-bold rounded-xl hover:bg-[#005943]"
            >
              Retour à l'accueil
            </button>
          </div>
        )}
      </main>

      {/* Pied de page */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
