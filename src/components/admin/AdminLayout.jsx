import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

/**
 * Composant AdminLayout
 * Structuration globale de l'interface admin :
 * - Sidebar fixe à gauche avec le logo officiel (cachée sur mobile)
 * - Header en haut avec le titre et le profil super admin
 * - Zone centrale de contenu responsive
 */
export default function AdminLayout({ children, title, profile, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f5] flex font-sans antialiased text-gray-900">
      
      {/* BARRE LATÉRALE VERT FONCÉ - Desktop: sticky, Mobile: drawer */}
      <div className={`fixed lg:sticky top-0 left-0 z-40 transition-transform duration-300 lg:translate-x-0 w-[280px] h-screen ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <AdminSidebar onLogout={onLogout} onMobileClose={() => setMobileMenuOpen(false)} />
      </div>

      {/* OVERLAY MOBILE - S'affiche seulement quand le menu est ouvert sur mobile */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ZONE PRINCIPALE DE DROITE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* BARRE SUPÉRIEURE */}
        <AdminHeader title={title} profile={profile} onMenuToggle={handleMenuToggle} />

        {/* CONTENU DE LA PAGE - Responsive */}
        <main className="flex-1 p-4 sm:p-6 lg:px-10 lg:py-8 space-y-6 lg:space-y-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
