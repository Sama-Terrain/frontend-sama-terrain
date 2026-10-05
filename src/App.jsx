import { useState } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import Navbar, { BarreNavigationBasse } from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Splash from './pages/Splash';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

// Ne montrer le splash qu'une fois par session de navigation (pas à chaque
// changement de page, seulement au tout premier chargement de l'app).
const SPLASH_DEJA_VU = 'sama_splash_vu';

function AppContent() {
    // Récupère les informations sur l'URL et la page actuellement visitée.
    // useLocation() est un hook fourni par React Router.
    const location = useLocation();

    // Récupère l'utilisateur actuellement connecté ainsi que la fonction
    // permettant de le déconnecter depuis le contexte d'authentification.
    const { currentUser, logout } = useAuth();

    // Crée une variable d'état "splashTermine" qui indique si l'écran
    // de démarrage (Splash Screen) a déjà été affiché.
    const [splashTermine, setSplashTermine] = useState(
      // Récupère dans le sessionStorage la valeur associée à
      // SPLASH_DEJA_VU et vérifie si elle vaut "true".
      () => sessionStorage.getItem(SPLASH_DEJA_VU) === 'true'
    );

    if (!splashTermine) {
      return (
        <Splash
          onTermine={() => {
            sessionStorage.setItem(SPLASH_DEJA_VU, 'true');
            setSplashTermine(true);
          }}
        />
      );
    }

  // Masquer la Navbar et le Footer grand public sur les pages auth, les pages
  // légales (qui ont leur propre en-tête avec retour à l'accueil) et les espaces
  // admin / gérant connectés (qui ont leur propre sidebar + header dédiés).
  // Note : '/gerant' seul (page publique "Devenir Gérant") garde la Navbar ;
  // seul '/gerant/...' (espace connecté) la masque.
  const isAuthOrAdminPage =
    ['/login', '/register', '/verify-email', '/mot-de-passe-oublie',
      '/support', '/conditions-utilisation', '/confidentialite'].includes(location.pathname) ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/gerant/');

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 font-sans">
      {!isAuthOrAdminPage && (
        <Navbar
          currentUser={currentUser}
          onLogout={logout}
        />
      )}

      <main className={`flex-1 ${!isAuthOrAdminPage ? 'pb-16 md:pb-0' : ''}`}>
        <AppRoutes />
      </main>

      {!isAuthOrAdminPage && (
        <>
          <Footer />
          <BarreNavigationBasse currentUser={currentUser} />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
