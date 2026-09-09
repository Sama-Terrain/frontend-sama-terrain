import { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Accueil from './pages/amateur/Accueil';
import RechercheTerrains from './pages/amateur/RechercheTerrains';

function App() {
  const [currentPage, setCurrentPage] = useState('accueil');
  const [selectedTerrain, setSelectedTerrain] = useState(null);
  const [searchParams, setSearchParams] = useState({});

  // Fonction simple de navigation
  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page);
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
            onSelectTerrain={setSelectedTerrain}
          />
        )}

        {currentPage === 'terrains' && (
          <RechercheTerrains
            onNavigate={handleNavigate}
            onSelectTerrain={setSelectedTerrain}
            initialSearch={searchParams}
          />
        )}

        {/* Espace pour les pages des prochaines étapes */}
        {currentPage !== 'accueil' && currentPage !== 'terrains' && (
          <div className="max-w-4xl mx-auto py-20 px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Page "{currentPage}" bientôt prête !
            </h2>
            <p className="text-gray-600 mb-6">
              Cette page sera intégrée à l'étape suivante.
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
