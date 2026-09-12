import React, { createContext, useState } from 'react';

// Contexte React qui garde en mémoire l'utilisateur connecté (amateur, gérant ou admin)
// et le rend disponible partout dans l'application sans avoir à le faire passer
// de composant en composant (props drilling).
export const AuthContext = createContext(null);

const CLE_STOCKAGE = 'sama_current_user';

// Relit l'utilisateur sauvegardé dans le navigateur (pour rester connecté après un rafraîchissement)
function lireUtilisateurStocke() {
  try {
    const donnees = localStorage.getItem(CLE_STOCKAGE);
    return donnees ? JSON.parse(donnees) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(lireUtilisateurStocke);

  // Appelé après une connexion réussie : mémorise l'utilisateur en mémoire + navigateur
  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(user));
  };

  // Déconnexion : on oublie l'utilisateur partout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CLE_STOCKAGE);
  };

  const value = { currentUser, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
