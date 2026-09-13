import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Composant ProtectedRoute
 * Enveloppe une page qui ne doit être accessible qu'à un utilisateur connecté
 * ayant l'un des rôles autorisés. Sinon, redirige :
 * - vers /login si personne n'est connecté
 * - vers l'accueil si l'utilisateur est connecté mais avec le mauvais rôle
 *
 * Exemple d'utilisation dans AppRoutes.jsx :
 * <Route path="/admin/dashboard" element={
 *   <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
 * } />
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
