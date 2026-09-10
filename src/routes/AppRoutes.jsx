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

// Pages Admin
import AdminDashboard from '../pages/admin/Dashboard';
import Utilisateurs from '../pages/admin/Utilisateurs';
import ValiderGerants from '../pages/admin/ValiderGerants';
import ModerationAvis from '../pages/admin/ModerationAvis';
import Statistiques from '../pages/admin/Statistiques';
import Parametres from '../pages/admin/Parametres';

export default function AppRoutes({ currentUser, setCurrentUser, searchParams, onSelectSlot, onLogout }) {
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

      {/* Routes Administrateur (avec transmission du handler de déconnexion) */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<AdminDashboard onLogout={onLogout} />} />
      <Route path="/admin/utilisateurs" element={<Utilisateurs onLogout={onLogout} />} />
      <Route path="/admin/validation-gerants" element={<ValiderGerants onLogout={onLogout} />} />
      <Route path="/admin/moderation-avis" element={<ModerationAvis onLogout={onLogout} />} />
      <Route path="/admin/statistiques" element={<Statistiques onLogout={onLogout} />} />
      <Route path="/admin/parametres" element={<Parametres onLogout={onLogout} />} />

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
