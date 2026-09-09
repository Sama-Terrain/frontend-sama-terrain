import { useState, useEffect } from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import { mockUser } from './data/mockUser';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('sama_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [searchParams, setSearchParams] = useState({});
  const [reservationData, setReservationData] = useState(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('sama_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sama_current_user');
  };

  // Masquer Navbar et Footer sur les routes d'authentification
  const isAuthPage = ['/login', '/register', '/verify-email'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 font-sans">
      {!isAuthPage && (
        <Navbar 
          currentUser={currentUser} 
          onLogout={handleLogout} 
        />
      )}

      <main className="flex-1">
        <AppRoutes 
          currentUser={currentUser}
          setCurrentUser={handleLoginSuccess}
          searchParams={searchParams}
          onSelectSlot={setReservationData}
        />
      </main>

      {!isAuthPage && (
        <Footer />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
