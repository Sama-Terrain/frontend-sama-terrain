import { useState, useEffect } from 'react';
import GerantLayout from '../../components/gerant/GerantLayout';
import AdminKpiCard from '../../components/admin/AdminKpiCard';
import RevenusNetChart from '../../components/gerant/RevenusNetChart';
import HistoriquePaiementsTable from '../../components/gerant/HistoriquePaiementsTable';
import { gerantService } from '../../services/gerantService';

/**
 * Page Revenus (Espace Gérant)
 *
 * Suivi des revenus du gérant : KPIs (revenus du mois, d'hier, avances reçues,
 * solde à percevoir), évolution quotidienne et historique des paiements.
 */
export default function Revenus({ onLogout }) {
  const [stats, setStats] = useState([]);
  const [evolution, setEvolution] = useState(null);
  const [paiements, setPaiements] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRevenus() {
      try {
        setLoading(true);
        const [statsData, evolutionData, paiementsData, profileData] = await Promise.all([
          gerantService.getRevenusStats(),
          gerantService.getRevenusEvolution(),
          gerantService.getHistoriquePaiements(),
          gerantService.getGerantProfile(),
        ]);
        setStats(statsData);
        setEvolution(evolutionData);
        setPaiements(paiementsData);
        setProfile(profileData);
      } catch (error) {
        console.error('Erreur chargement revenus gérant:', error);
      } finally {
        setLoading(false);
      }
    }

    loadRevenus();
  }, []);

  if (loading) {
    return (
      <GerantLayout title="Suivi des Revenus" profile={profile} onLogout={onLogout}>
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-bold">Chargement des revenus...</p>
        </div>
      </GerantLayout>
    );
  }

  return (
    <GerantLayout title="Suivi des Revenus" profile={profile} onLogout={onLogout}>

      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {stats.map((kpi) => (
          <AdminKpiCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            trendDirection={kpi.trendDirection}
          />
        ))}
      </section>

      {/* ÉVOLUTION QUOTIDIENNE */}
      <RevenusNetChart data={evolution} ville={evolution?.ville} />

      {/* HISTORIQUE DES PAIEMENTS */}
      <HistoriquePaiementsTable
        paiements={paiements}
        onExportCsv={() => console.log('Export CSV (à brancher sur le futur endpoint API)')}
        onExportPdf={() => console.log('Export PDF (à brancher sur le futur endpoint API)')}
      />

    </GerantLayout>
  );
}
