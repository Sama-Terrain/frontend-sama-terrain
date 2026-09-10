import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

/**
 * Composant AdminLayout
 * Structuration globale de l'interface admin :
 * - Sidebar fixe à gauche avec le logo officiel
 * - Header en haut avec le titre et le profil super admin
 * - Zone centrale de contenu
 */
export default function AdminLayout({ children, title, profile, onLogout }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-gray-900">
      
      {/* BARRE LATÉRALE VERT FONCÉ */}
      <AdminSidebar onLogout={onLogout} />

      {/* ZONE PRINCIPALE DE DROITE */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* BARRE SUPÉRIEURE */}
        <AdminHeader title={title} profile={profile} />

        {/* CONTENU DE LA PAGE */}
        <main className="flex-1 p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
