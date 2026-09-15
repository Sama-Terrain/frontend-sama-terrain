import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';
import { Search, Eye, Edit, Trash2, ChevronLeft } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('Joueurs');
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('Toutes les villes');
  const [page, setPage] = useState(1);
  const [profile, setProfile] = useState(null);
  const usersPerPage = 8;

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const [usersData, profileData] = await Promise.all([
          adminService.getUsers(),
          adminService.getAdminProfile(),
        ]);
        setUsers(usersData);
        setProfile(profileData);
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
    if (activeTab === 'Joueurs') return user.role === 'Amateur';
    if (activeTab === 'Gérants') return user.role === 'Gérant';
    if (activeTab === 'Admins') return user.role === 'Admin';
    return true;
  });

  // Filtrage par recherche et ville
  const filteredUsers = usersByRole.filter(user => {
    const searchValue = search.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(searchValue) ||
      user.email.toLowerCase().includes(searchValue) ||
      (user.phone && user.phone.toLowerCase().includes(searchValue));
    const matchesCity = city === 'Toutes les villes' || user.city === city;
    return matchesSearch && matchesCity;
  });

  // Pagination
  const indexOfLastUser = page * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setPage(1);
  }, [search, city, activeTab]);

  // Fonction pour obtenir l'initiale
  const getInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };

  // Fonction pour obtenir le badge de statut
  const getStatusBadge = (status) => {
    const statusStyles = {
      actif: "bg-[#def7ec] text-[#10b981]",
      suspendu: "bg-[#fee2e2] text-[#ef4444]",
      inactif: "bg-[#e5e7eb] text-[#4b5563]",
    };

    const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
    return (
      <span
        className={`inline-flex rounded-[4px] px-[8px] py-[4px] text-[11px] font-bold whitespace-nowrap ${
          statusStyles[status.toLowerCase()]
        }`}
      >
        {statusLabel}
      </span>
    );
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <AdminLayout title="Gestion des Utilisateurs" profile={profile} onLogout={onLogout}>
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-bold">Chargement des utilisateurs...</p>
        </div>
      </AdminLayout>
    );
  }

  const tabs = ["Joueurs", "Gérants", "Admins"];

  return (
    <AdminLayout title="Gestion des Utilisateurs" profile={profile} onLogout={onLogout}>
      
      {/* SECTION FILTRES */}
      <div className="flex w-full items-center gap-2 sm:gap-5 rounded-xl border border-[#e5e7eb] bg-white p-2 sm:p-5">
        {/* Tabs */}
        <div className="flex flex-1 gap-1 sm:gap-2 rounded-lg bg-[#f4f6f5] p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex flex-1 items-center justify-center rounded-md px-1.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs leading-tight text-center transition truncate ${
                activeTab === tab
                  ? "bg-vert-principal font-bold text-white"
                  : "font-semibold text-[#4b5563]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-[#e5e7eb] px-2 sm:px-3.5 py-2 sm:py-2.5 min-w-0">
          <div className="flex h-4 w-4 shrink-0 items-center justify-center">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher..."
            className="w-full min-w-0 bg-transparent text-xs sm:text-sm text-[#111827] outline-none placeholder:text-[#9ca3af]"
          />
        </div>

        {/* City */}
        <div className="relative flex flex-1 items-center">
          <select
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="w-full appearance-none rounded-[8px] border border-[#e5e7eb] bg-white px-[14px] py-[10px] text-[14px] text-[#111827] outline-none"
          >
            <option>Toutes les villes</option>
            <option>Dakar</option>
            <option>Mermoz</option>
            <option>Guédiawaye</option>
            <option>Almadies</option>
            <option>Yoff</option>
          </select>
          <ChevronLeft size={14} className="pointer-events-none absolute right-[14px] h-[14px] w-[14px] text-gray-400" />
        </div>
      </div>

      {/* TABLEAU DES UTILISATEURS */}
      <div className="w-full rounded-[12px] border border-[#e5e7eb] bg-white p-[24px]">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            {/* HEADER */}
            <div className="flex items-center gap-[16px] rounded-[6px] bg-[#ebf5f1] px-[16px] py-[12px] text-[13px] font-bold text-vert-principal">
              <div className="w-[180px] shrink-0">Nom</div>
              <div className="min-w-0 flex-1">Email</div>
              <div className="w-[150px] shrink-0">Téléphone</div>
              <div className="w-[120px] shrink-0">Ville</div>
              <div className="w-[120px] shrink-0">Date Inscr.</div>
              <div className="w-[100px] shrink-0">Statut</div>
              <div className="w-[100px] shrink-0 text-center">Actions</div>
            </div>

            {/* ROWS */}
            {currentUsers.length === 0 ? (
              <div className="px-[16px] py-[14px] text-center">
                <p className="text-sm text-gray-500 font-semibold">
                  Aucun utilisateur trouvé
                </p>
              </div>
            ) : (
              currentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-[16px] border-b border-[#e5e7eb] px-[16px] py-[14px]"
                >
                  {/* NOM */}
                  <div className="flex w-[180px] shrink-0 items-center gap-[8px]">
                    <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-dore text-[12px] font-bold text-vert-principal">
                      {getInitial(user.name)}
                    </div>
                    <span className="whitespace-nowrap text-[14px] font-semibold text-[#111827]">
                      {user.name}
                    </span>
                  </div>

                  {/* EMAIL */}
                  <div className="min-w-0 flex-1 break-words text-[14px] font-normal text-[#4b5563]">
                    {user.email}
                  </div>

                  {/* TELEPHONE */}
                  <div className="w-[150px] shrink-0 font-mono text-[13px] text-[#4b5563]">
                    {user.phone || '-'}
                  </div>

                  {/* VILLE */}
                  <div className="w-[120px] shrink-0 text-[14px] text-[#111827]">
                    {user.city || '-'}
                  </div>

                  {/* DATE */}
                  <div className="w-[120px] shrink-0 text-[13px] text-[#4b5563]">
                    {user.registeredAt}
                  </div>

                  {/* STATUS */}
                  <div className="w-[100px] shrink-0">
                    {getStatusBadge(user.status)}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex w-[100px] shrink-0 items-center justify-center gap-[8px]">
                    <button
                      type="button"
                      className="flex h-[14px] w-[14px] items-center justify-center"
                      aria-label={`Voir ${user.name}`}
                    >
                      <Eye size={14} className="text-gray-600" />
                    </button>
                    <button
                      type="button"
                      className="flex h-[14px] w-[14px] items-center justify-center"
                      aria-label={`Modifier ${user.name}`}
                    >
                      <Edit size={14} className="text-green-600" />
                    </button>
                    <button
                      type="button"
                      className="flex h-[14px] w-[14px] items-center justify-center"
                      aria-label={`Supprimer ${user.name}`}
                    >
                      <Trash2 size={14} className="text-red-600" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 pt-4">
          {/* INFORMATION */}
          <p className="hidden sm:block whitespace-nowrap text-[13px] text-[#4b5563]">
            Affichage de {indexOfFirstUser + 1} à {Math.min(indexOfLastUser, filteredUsers.length)} sur {filteredUsers.length} utilisateurs
          </p>
          <p className="sm:hidden whitespace-nowrap text-[11px] text-[#4b5563] shrink-0">
            {indexOfFirstUser + 1}–{Math.min(indexOfLastUser, filteredUsers.length)} / {filteredUsers.length}
          </p>

          {/* BUTTONS */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="shrink-0 rounded-md border border-[#e5e7eb] bg-white px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-[13px] text-[#4b5563] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="hidden sm:inline">Précédent</span>
              <span className="sm:hidden">Préc.</span>
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                type="button"
                onClick={() => setPage(i + 1)}
                className={`shrink-0 rounded-md px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-[13px] ${
                  page === i + 1
                    ? "bg-vert-principal font-bold text-white"
                    : "border border-[#e5e7eb] bg-white text-[#111827] transition hover:bg-[#f9fafb]"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              className="shrink-0 rounded-md border border-[#e5e7eb] bg-white px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-[13px] text-[#4b5563] transition hover:bg-[#f9fafb]"
            >
              <span className="hidden sm:inline">Suivant</span>
              <span className="sm:hidden">Suiv.</span>
            </button>
          </div>
        </div>
      </div>

    </AdminLayout>
  );
}
