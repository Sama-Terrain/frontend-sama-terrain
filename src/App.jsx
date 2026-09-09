import { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Accueil from './pages/amateur/Accueil';

function App() {
  const [currentPage, setCurrentPage] = useState('accueil');
  const [selectedTerrain, setSelectedTerrain] = useState(null);

  // Fonction simple de navigation
  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page);
    if (params.terrainId) {
      console.log('Navigation vers le terrain :', params.terrainId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
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

        {/* Espace pour les pages à venir dans les prochaines étapes */}
        {currentPage !== 'accueil' && (
          <div className="max-w-4xl mx-auto py-20 px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Page "{currentPage}" bientôt prête !
            </h2>
            <p className="text-gray-600 mb-6">
              Page indisponible pour le moment.
            </p>
            <button
              onClick={() => handleNavigate('accueil')}
              className="px-6 py-2.5 bg-[#1b4332] text-white font-bold rounded-xl hover:bg-[#2d6a4f]"
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
