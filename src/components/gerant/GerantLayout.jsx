import React, { useState } from 'react';
import GerantSidebar from './GerantSidebar';
import GerantHeader from './GerantHeader';
import AbonnementTrialBanner from './AbonnementTrialBanner';

/**
 * Composant GerantLayout
 * Structuration globale de l'espace gérant (identique dans l'esprit à AdminLayout) :
 * - Sidebar fixe à gauche (drawer sur mobile)
 * - Header en haut avec titre, date, actions rapides et profil
 * - Zone centrale de contenu responsive
 */
export default function GerantLayout({ children, title, profile, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f5] flex font-sans antialiased text-gray-900">

      {/* BARRE LATÉRALE - Desktop: sticky, Mobile: drawer */}
      <div className={`fixed lg:sticky top-0 left-0 z-40 transition-transform duration-300 lg:translate-x-0 w-[280px] h-screen ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <GerantSidebar onLogout={onLogout} onMobileClose={() => setMobileMenuOpen(false)} />
      </div>

      {/* OVERLAY MOBILE */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ZONE PRINCIPALE DE DROITE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        <GerantHeader title={title} profile={profile} onMenuToggle={handleMenuToggle} onLogout={onLogout} />

        <main className="flex-1 p-4 sm:p-6 lg:px-10 lg:py-8 space-y-6 lg:space-y-8 max-w-7xl w-full mx-auto overflow-y-auto">
          <AbonnementTrialBanner />
          {children}
        </main>

      </div>

    </div>
  );
}
