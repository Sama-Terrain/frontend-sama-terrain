import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Hook pratique pour lire l'utilisateur connecté et se connecter/déconnecter
// depuis n'importe quel composant : const { currentUser, login, logout } = useAuth();
export function useAuth() {
  const contexte = useContext(AuthContext);
  if (!contexte) {
    throw new Error('useAuth() doit être utilisé à l\'intérieur d\'un <AuthProvider>');
  }
  return contexte;
}
