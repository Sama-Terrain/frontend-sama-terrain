import { createContext } from 'react';

// Contexte React qui garde en mémoire l'utilisateur connecté (amateur, gérant ou admin)
// et le rend disponible partout dans l'application sans avoir à le faire passer
// de composant en composant (props drilling).
// Il est dans son propre fichier (et non dans AuthContext.jsx) car le
// rechargement à chaud de Vite exige qu'un fichier .jsx n'exporte que des composants.
export const AuthContext = createContext(null);
