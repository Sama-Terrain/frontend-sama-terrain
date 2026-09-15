import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/roles';
import ProtectedRoute from './ProtectedRoute';
import RequireAbonnementActif from './RequireAbonnementActif';

// Pages Amateurs
import Accueil from '../pages/amateur/Accueil';
import RechercheTerrains from '../pages/amateur/RechercheTerrains';
import DetailTerrain from '../pages/amateur/DetailTerrain';
import MesReservations from '../pages/amateur/MesReservations';
import Paiement from '../pages/amateur/Paiement';
import PaiementSucces from '../pages/amateur/PaiementSucces';
import PaiementAnnule from '../pages/amateur/PaiementAnnule';
import Confirmation from '../pages/amateur/Confirmation';

// Pages Gérant
import DevenirGerant from '../pages/gerant/DevenirGerant';
import GerantDashboard from '../pages/gerant/Dashboard';
import MesTerrains from '../pages/gerant/MesTerrains';
import AjouterTerrain from '../pages/gerant/AjouterTerrain';
import TerrainDetail from '../pages/gerant/TerrainDetail';
import GererCreneaux from '../pages/gerant/GererCreneaux';
import Reservations from '../pages/gerant/Reservations';
import Revenus from '../pages/gerant/Revenus';
import ScannerTicket from '../pages/gerant/ScannerTicket';
import GerantStatistiques from '../pages/gerant/Statistiques';
import InsightsIA from '../pages/gerant/InsightsIA';
import Abonnement from '../pages/gerant/Abonnement';
import AbonnementSucces from '../pages/gerant/AbonnementSucces';
import AbonnementAnnule from '../pages/gerant/AbonnementAnnule';

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

export default function AppRoutes({ searchParams }) {
  const { currentUser, logout } = useAuth();

  // Petit helper pour éviter de répéter la même double protection sur chaque
  // page gérant : il faut être connecté EN TANT QUE gérant, ET avoir un
  // abonnement actif (essai en cours ou abonnement payé) pour y accéder.
  const pageGerant = (element) => (
    <ProtectedRoute allowedRoles={[ROLES.GERANT]}>
      <RequireAbonnementActif>{element}</RequireAbonnementActif>
    </ProtectedRoute>
  );

  return (
    <Routes>
      {/* Route Accueil */}
      <Route path="/" element={<Accueil />} />
      <Route path="/accueil" element={<Navigate to="/" replace />} />

      {/* Routes Terrains */}
      <Route path="/terrains" element={<RechercheTerrains initialSearch={searchParams} />} />
      <Route path="/terrains/:id" element={<DetailTerrain currentUser={currentUser} />} />

      {/* Routes du parcours de réservation (réservées aux amateurs connectés) */}
      <Route
        path="/reservations"
        element={
          <ProtectedRoute allowedRoles={[ROLES.AMATEUR]}>
            <MesReservations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paiement"
        element={
          <ProtectedRoute allowedRoles={[ROLES.AMATEUR]}>
            <Paiement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/confirmation"
        element={
          <ProtectedRoute allowedRoles={[ROLES.AMATEUR]}>
            <Confirmation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paiement/succes"
        element={
          <ProtectedRoute allowedRoles={[ROLES.AMATEUR]}>
            <PaiementSucces />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paiement/annule"
        element={
          <ProtectedRoute allowedRoles={[ROLES.AMATEUR]}>
            <PaiementAnnule />
          </ProtectedRoute>
        }
      />

      {/* Route Devenir Gérant (publique : formulaire d'inscription gérant) */}
      <Route path="/gerant" element={<DevenirGerant />} />

      {/* Page de paiement de l'abonnement : accessible à tout gérant connecté,
          MÊME si son abonnement est expiré (sinon il ne pourrait jamais payer !) */}
      <Route
        path="/gerant/abonnement"
        element={
          <ProtectedRoute allowedRoles={[ROLES.GERANT]}>
            <Abonnement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gerant/abonnement/succes"
        element={
          <ProtectedRoute allowedRoles={[ROLES.GERANT]}>
            <AbonnementSucces />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gerant/abonnement/annule"
        element={
          <ProtectedRoute allowedRoles={[ROLES.GERANT]}>
            <AbonnementAnnule />
          </ProtectedRoute>
        }
      />

      {/* Routes Espace Gérant : réservées aux gérants avec un abonnement actif */}
      <Route path="/gerant/dashboard" element={pageGerant(<GerantDashboard onLogout={logout} />)} />
      <Route path="/gerant/terrains" element={pageGerant(<MesTerrains onLogout={logout} />)} />
      <Route path="/gerant/terrains/ajouter" element={pageGerant(<AjouterTerrain onLogout={logout} />)} />
      <Route path="/gerant/terrains/:id" element={pageGerant(<TerrainDetail onLogout={logout} />)} />
      <Route path="/gerant/terrains/:id/modifier" element={pageGerant(<AjouterTerrain onLogout={logout} />)} />
      <Route path="/gerant/creneaux" element={pageGerant(<GererCreneaux onLogout={logout} />)} />
      <Route path="/gerant/reservations" element={pageGerant(<Reservations onLogout={logout} />)} />
      <Route path="/gerant/revenus" element={pageGerant(<Revenus onLogout={logout} />)} />
      <Route path="/gerant/scanner" element={pageGerant(<ScannerTicket onLogout={logout} />)} />
      <Route path="/gerant/statistiques" element={pageGerant(<GerantStatistiques onLogout={logout} />)} />
      <Route path="/gerant/insights" element={pageGerant(<InsightsIA onLogout={logout} />)} />

      {/* Routes Administrateur : réservées au rôle admin */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminDashboard onLogout={logout} /></ProtectedRoute>} />
      <Route path="/admin/utilisateurs" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><Utilisateurs onLogout={logout} /></ProtectedRoute>} />
      <Route path="/admin/validation-gerants" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><ValiderGerants onLogout={logout} /></ProtectedRoute>} />
      <Route path="/admin/moderation-avis" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><ModerationAvis onLogout={logout} /></ProtectedRoute>} />
      <Route path="/admin/statistiques" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><Statistiques onLogout={logout} /></ProtectedRoute>} />
      <Route path="/admin/parametres" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><Parametres onLogout={logout} /></ProtectedRoute>} />

      {/* Routes Authentification */}
      <Route path="/login" element={<Connexion />} />
      <Route path="/register" element={<Inscription />} />
      <Route path="/verify-email" element={<VerificationEmail />} />

      {/* Fallback route inconnue -> Redirection Accueil */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
