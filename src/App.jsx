import { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Accueil from './pages/amateur/Accueil';
import RechercheTerrains from './pages/amateur/RechercheTerrains';
import DetailTerrain from './pages/amateur/DetailTerrain';
import DevenirGerant from './pages/gerant/DevenirGerant';
import Connexion from './pages/auth/Connexion';
import Inscription from './pages/auth/Inscription';
import VerificationEmail from './pages/auth/VerificationEmail';
import { mockUser } from './data/mockUser';

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

  const [currentUser, setCurrentUser] = useState(null);
  const [authEmail, setAuthEmail] = useState(mockUser.email);
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
    if (params.email) {
      setAuthEmail(params.email);
    }
    if (params) {
      setSearchParams(params);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 font-sans">
      {/* Masquer Navbar et Footer sur les pages plein écran d'authentification */}
      {currentPage !== 'login' && currentPage !== 'register' && currentPage !== 'verify-email' && (
        <Navbar 
          onNavigate={handleNavigate} 
          currentPage={currentPage} 
          currentUser={currentUser} 
          onLogout={() => setCurrentUser(null)} 
        />
      )}

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
            currentUser={currentUser}
          />
        )}

        {currentPage === 'gerant' && (
          <DevenirGerant onNavigate={handleNavigate} />
        )}

        {currentPage === 'login' && (
          <Connexion 
            onNavigate={handleNavigate} 
            onLoginSuccess={(u) => setCurrentUser(u)} 
          />
        )}

        {currentPage === 'register' && (
          <Inscription onNavigate={handleNavigate} />
        )}

        {currentPage === 'verify-email' && (
          <VerificationEmail onNavigate={handleNavigate} email={authEmail} />
        )}

        {/* Espace pour les autres pages non encore créées */}
        {currentPage !== 'accueil' && 
         currentPage !== 'terrains' && 
         currentPage !== 'detail' && 
         currentPage !== 'gerant' &&
         currentPage !== 'login' &&
         currentPage !== 'register' &&
         currentPage !== 'verify-email' && (
          <div className="max-w-4xl mx-auto py-20 px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Page "{currentPage}" bientôt prête !
            </h2>
            <p className="text-gray-600 mb-6">
              Cette étape sera intégrée à la suite du parcours.
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
      {currentPage !== 'login' && currentPage !== 'register' && currentPage !== 'verify-email' && (
        <Footer onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;
