import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminKpiCard from '../../components/admin/AdminKpiCard';
import ChartsGrid from '../../components/admin/ChartsGrid';
import TerrainTable from '../../components/admin/TerrainTable';
import { adminService } from '../../services/adminService';
import { Calendar, ChevronDown } from 'lucide-react';
import '../../styles/admin/Statistiques.css';

/**
 * Page Statistiques (Analyses et Statistiques Globales)
 *
 * Cette page permet à l'administrateur de :
 * 1. Voir les KPIs de performance
 * 2. Analyser les méthodes de paiement
 * 3. Visualiser la répartition des joueurs par ville
 * 4. Consulter le top 5 des terrains les plus réservés
 */

/* =========================
   DASHBOARD
========================= */

export default function Statistiques({ onLogout }) {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [topTerrains, setTopTerrains] = useState([]);

  // Effet pour charger les données mockées
  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const [kpiData, payment, city, terrains] = await Promise.all([
          adminService.getStatsKpi(),
          adminService.getStatsPayment(),
          adminService.getStatsCity(),
          adminService.getStatsTopTerrains(),
        ]);
        setKpis(kpiData);
        setPaymentData(payment);
        setCityData(city);
        setTopTerrains(terrains);
      } catch (error) {
        console.error('Erreur chargement statistiques:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  // Affichage pendant le chargement
  if (loading) {
    return (
      <AdminLayout title="Analyses et Statistiques Globales" onLogout={onLogout}>
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-bold">Chargement des statistiques...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Analyses et Statistiques Globales" onLogout={onLogout}>
      <main className="dashboard">
        {/* Période */}
        <section className="date-card">
          <p>Sélectionner la période d'analyse</p>
          <button className="date-selector">
            <Calendar size={16} className="text-gray-400" />
            <span>01 Janvier - 31 Décembre 2026</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </section>

        {/* KPI */}
        <section className="kpis-grid">
          {kpis.map((kpi) => (
            <AdminKpiCard
              key={kpi.title}
              label={kpi.title}
              value={kpi.value}
              trend={kpi.trend}
            />
          ))}
        </section>

        {/* Graphiques */}
        <ChartsGrid paymentData={paymentData} cityData={cityData} />

        {/* Tableau */}
        <TerrainTable terrains={topTerrains} />
      </main>
    </AdminLayout>
  );
}
