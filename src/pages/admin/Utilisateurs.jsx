import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Page Utilisateurs (Gestion des Utilisateurs)
 *
 * Cette page permet à l'administrateur de :
 * 1. Lister les utilisateurs par rôle (Joueurs, Gérants, Admins)
 * 2. Rechercher des utilisateurs par nom, email, téléphone
 * 3. Filtrer par ville
 * 4. Effectuer des actions sur les utilisateurs (voir, éditer, supprimer)
 */
export default function Utilisateurs({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('joueurs');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  // Effet pour charger les données mockées
  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const usersData = await adminService.getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Erreur chargement utilisateurs:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  // Filtrage des utilisateurs par rôle
  const usersByRole = users.filter(user => {
    if (activeTab === 'joueurs') return user.role === 'Amateur';
    if (activeTab === 'gerants') return user.role === 'Gérant';
    if (activeTab === 'admins') return user.role === 'Admin';
    return true;
  });

  // Filtrage par recherche et ville
  const filteredUsers = usersByRole.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCity = filterCity === 'all' || user.city === filterCity;
    return matchesSearch && matchesCity;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCity, activeTab]);

  // Fonction pour obtenir le badge de statut
  const getStatusBadge = (status) => {
    switch (status) {
      case 'actif':
        return <Badge statut="disponible">{status}</Badge>;
      case 'inactif':
        return <Badge statut="complet">{status}</Badge>;
      case 'suspendu':
        return <Badge statut="en_attente">{status}</Badge>;
      default:
        return <Badge statut="disponible">{status}</Badge>;
    }
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <AdminLayout title="Gestion des Utilisateurs" onLogout={onLogout}>
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-bold">Chargement des utilisateurs...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestion des Utilisateurs" onLogout={onLogout}>
      
      {/* SECTION FILTRES - UNIE */}
      <section className="bg-white rounded-[12px] p-4 sm:p-6 border border-gray-200/80 shadow-2xs">
        
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          
          {/* ONGETS - GAUCHE */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('joueurs')}
              className={`px-4 py-2 rounded-[8px] text-xs font-bold transition-colors ${
                activeTab === 'joueurs'
                  ? 'bg-vert-principal text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Joueurs
            </button>
            <button
              onClick={() => setActiveTab('gerants')}
              className={`px-4 py-2 rounded-[8px] text-xs font-bold transition-colors ${
                activeTab === 'gerants'
                  ? 'bg-vert-principal text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Gérants
            </button>
            <button
              onClick={() => setActiveTab('admins')}
              className={`px-4 py-2 rounded-[8px] text-xs font-bold transition-colors ${
                activeTab === 'admins'
                  ? 'bg-vert-principal text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Admins
            </button>
          </div>

          {/* BARRE DE RECHERCHE - CENTRE */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Rechercher par nom, email, téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* FILTRE VILLE - DROITE */}
          <div className="flex gap-2 shrink-0">
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="border border-gray-200 rounded-[8px] px-4 py-3 text-xs font-bold focus:outline-none focus:border-vert-principal bg-white"
            >
              <option value="all">Toutes les villes</option>
              <option value="Dakar">Dakar</option>
              <option value="Mermoz">Mermoz</option>
              <option value="Guédiawaye">Guédiawaye</option>
              <option value="Almadies">Almadies</option>
              <option value="Yoff">Yoff</option>
            </select>

          </div>

        </div>

      </section>

      {/* TABLEAU DES UTILISATEURS */}
      <section className="bg-white rounded-[12px] border border-gray-200/80 shadow-2xs overflow-hidden">
        
        {/* EN-TÊTE DU TABLEAU */}
        <div className="hidden sm:grid grid-cols-8 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 items-center">
          <div className="col-span-1 text-xs font-bold text-gray-500 uppercase tracking-wide">
            Nom
          </div>
          <div className="col-span-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
            Email
          </div>
          <div className="col-span-1 text-xs font-bold text-gray-500 uppercase tracking-wide">
            Téléphone
          </div>
          <div className="col-span-1 text-xs font-bold text-gray-500 uppercase tracking-wide">
            Ville
          </div>
          <div className="col-span-1 text-xs font-bold text-gray-500 uppercase tracking-wide">
            Date Inscr.
          </div>
          <div className="col-span-1 text-xs font-bold text-gray-500 uppercase tracking-wide">
            Statut
          </div>
          <div className="col-span-1 text-xs font-bold text-gray-500 uppercase tracking-wide text-right">
            Actions
          </div>
        </div>

        {/* LISTE DES UTILISATEURS */}
        <div className="divide-y divide-gray-100">
          {currentUsers.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-gray-500 font-semibold">
                Aucun utilisateur trouvé
              </p>
            </div>
          ) : (
            currentUsers.map((user) => (
              <div
                key={user.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                {/* MOBILE: CARTE FORMAT */}
                <div className="sm:hidden space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    {getStatusBadge(user.status)}
                  </div>
                  <div className="space-y-1 text-xs text-gray-600 font-semibold">
                    <p>{user.email}</p>
                    <p>{user.phone || '-'}</p>
                    <p>{user.city || '-'}</p>
                    <p>{user.registeredAt}</p>
                  </div>
                  <div className="flex justify-end gap-1 pt-2">
                    <button className="p-1.5 hover:bg-green-50 rounded transition-colors text-green-600" title="Éditer">
                      <Edit size={16} />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 rounded transition-colors text-red-600" title="Supprimer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* DESKTOP: TABLEAU FORMAT */}
                <div className="hidden sm:grid sm:grid-cols-8 gap-4 items-center">
                  {/* NOM */}
                  <div className="col-span-1">
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                  </div>

                  {/* EMAIL */}
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 font-semibold truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* TÉLÉPHONE */}
                  <div className="col-span-1">
                    <p className="text-[12px] text-gray-600 font-semibold">
                      {user.phone || '-'}
                    </p>
                  </div>

                  {/* VILLE */}
                  <div className="col-span-1">
                    <p className="text-sm text-gray-600 font-semibold">
                      {user.city || '-'}
                    </p>
                  </div>

                  {/* DATE D'INSCRIPTION */}
                  <div className="col-span-1">
                    <p className="text-sm text-gray-600 font-semibold">
                      {user.registeredAt}
                    </p>
                  </div>

                  {/* STATUT */}
                  <div className="col-span-1">
                    {getStatusBadge(user.status)}
                  </div>

                  {/* ACTIONS */}
                  <div className="col-span-1 flex justify-end gap-1">
                    <button className="p-1.5 hover:bg-green-50 rounded transition-colors text-green-600" title="Éditer">
                      <Edit size={16} />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 rounded transition-colors text-red-600" title="Supprimer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs text-gray-500 font-semibold">
            Affichage de {indexOfFirstUser + 1} à {Math.min(indexOfLastUser, filteredUsers.length)} sur {filteredUsers.length} utilisateurs
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg text-xs font-bold border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft size={14} />
              Précédent
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  currentPage === i + 1
                    ? 'bg-vert-principal text-white'
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg text-xs font-bold border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Suivant
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </section>

    </AdminLayout>
  );
}
