import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminKpiCard from '../../components/admin/AdminKpiCard';
import CroissanceChart from '../../components/admin/CroissanceChart';
import ReservationsVilleChart from '../../components/admin/ReservationsVilleChart';
import ActiviteRecenteList from '../../components/admin/ActiviteRecenteList';
import { adminService } from '../../services/adminService';

/**
 * Page AdminDashboard (Tableau de Bord Admin)
 * 
 * Cette page rassemble :
 * 1. Les 5 cartes de KPI principales (Utilisateurs, Gérants Actifs, Terrains, Réservations, Revenus Global).
 * 2. Le graphique de croissance des inscriptions (30j) basé sur Recharts.
 * 3. Le graphique de répartition des réservations par ville basé sur Recharts.
 * 4. La liste du flux d'activités récentes du système.
 */
export default function AdminDashboard({ onLogout }) {
  // États locaux pour stocker les données mockées récupérées via le service
  const [stats, setStats] = useState([]);
  const [croissanceData, setCroissanceData] = useState(null);
  const [villesData, setVillesData] = useState([]);
  const [activites, setActivites] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Effet pour simuler le chargement réseau depuis l'API backend
  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [statsData, croissanceRes, villesRes, activitesRes, profileRes] = await Promise.all([
          adminService.getAdminStats(),
          adminService.getCroissanceInscriptions(),
          adminService.getReservationsParVille(),
          adminService.getActiviteRecente(),
          adminService.getAdminProfile(),
        ]);

        setStats(statsData);
        setCroissanceData(croissanceRes);
        setVillesData(villesRes);
        setActivites(activitesRes);
        setProfile(profileRes);
      } catch (error) {
        console.error('Erreur chargement dashboard admin:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Affichage d'un spinner pendant le chargement
  if (loading) {
    return (
      <AdminLayout title="Tableau de Bord Admin" profile={profile} onLogout={onLogout}>
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#004030] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-bold">Chargement du tableau de bord admin...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Tableau de Bord Admin" profile={profile} onLogout={onLogout}>
      
      {/* SECTION 1 : CARTES DES 5 KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {stats.map((kpi) => (
          <AdminKpiCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
          />
        ))}
      </section>

      {/* SECTION 2 : GRAPHIQUES AVEC RECHARTS (CROISSANCE & VILLES) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CroissanceChart data={croissanceData} totalMois={croissanceData?.totalMois} />
        <ReservationsVilleChart data={villesData} />
      </section>

      {/* SECTION 3 : ACTIVITÉ RÉCENTE DU SYSTÈME */}
      <section>
        <ActiviteRecenteList items={activites} />
      </section>

    </AdminLayout>
  );
}
