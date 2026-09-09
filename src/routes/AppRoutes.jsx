import { Routes, Route, Navigate } from 'react-router-dom';

// Pages Amateurs
import Accueil from '../pages/amateur/Accueil';
import RechercheTerrains from '../pages/amateur/RechercheTerrains';
import DetailTerrain from '../pages/amateur/DetailTerrain';
import MesReservations from '../pages/amateur/MesReservations';

// Page Gérant
import DevenirGerant from '../pages/gerant/DevenirGerant';

// Pages Authentification
import Connexion from '../pages/auth/Connexion';
import Inscription from '../pages/auth/Inscription';
import VerificationEmail from '../pages/auth/VerificationEmail';

export default function AppRoutes({ currentUser, setCurrentUser, searchParams, onSelectSlot }) {
  return (
    <Routes>
      {/* Route Accueil */}
      <Route path="/" element={<Accueil />} />
      <Route path="/accueil" element={<Navigate to="/" replace />} />

      {/* Routes Terrains */}
      <Route path="/terrains" element={<RechercheTerrains initialSearch={searchParams} />} />
      <Route path="/terrains/:id" element={<DetailTerrain onSelectSlot={onSelectSlot} currentUser={currentUser} />} />

      {/* Route Mes Réservations (Protégée) */}
      <Route
        path="/reservations"
        element={
          currentUser ? (
            <MesReservations />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Route Devenir Gérant */}
      <Route path="/gerant" element={<DevenirGerant />} />

      {/* Routes Authentification */}
      <Route
        path="/login"
        element={<Connexion onLoginSuccess={(user) => setCurrentUser(user)} />}
      />
      <Route path="/register" element={<Inscription />} />
      <Route path="/verify-email" element={<VerificationEmail />} />

      {/* Fallback route inconnue -> Redirection Accueil */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
