import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import GerantLayout from '../../components/gerant/GerantLayout';
import AdminKpiCard from '../../components/admin/AdminKpiCard';
import RevenusChart from '../../components/gerant/RevenusChart';
import ReservationsRecentesTable from '../../components/gerant/ReservationsRecentesTable';
import { gerantService } from '../../services/gerantService';

/**
 * Page GerantDashboard (Tableau de bord Gérant)
 *
 * Rassemble :
 * 1. Les 4 cartes de KPI (Réservations du jour, Revenus du mois, Taux d'occupation, Avis moyen).
 * 2. Le graphique des revenus des 30 derniers jours.
 * 3. Le tableau des réservations récentes.
 * + un rappel tant que le numéro Wave / Orange Money de retrait n'est pas renseigné.
 */
export default function GerantDashboard({ onLogout }) {
  const [stats, setStats] = useState([]);
  const [revenus, setRevenus] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [numeroRetraitManquant, setNumeroRetraitManquant] = useState(false);

  // Chargé à part : une erreur ici ne doit pas empêcher d'afficher le tableau de bord.
  useEffect(() => {
    gerantService.getPortefeuille()
      .then((portefeuille) => setNumeroRetraitManquant(!portefeuille.numero_retrait))
      .catch(() => {});
  }, []);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [statsData, revenusData, reservationsData, profileData] = await Promise.all([
          gerantService.getGerantStats(),
          gerantService.getRevenus30Jours(),
          gerantService.getReservationsRecentes(),
          gerantService.getGerantProfile(),
        ]);

        setStats(statsData);
        setRevenus(revenusData);
        setReservations(reservationsData);
        setProfile(profileData);
      } catch (error) {
        console.error('Erreur chargement tableau de bord gérant:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <GerantLayout title="Tableau de bord" profile={profile} onLogout={onLogout}>
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-bold">Chargement du tableau de bord...</p>
        </div>
      </GerantLayout>
    );
  }

  return (
    <GerantLayout title="Tableau de bord" profile={profile} onLogout={onLogout}>

      {numeroRetraitManquant && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-[10px] bg-amber-50 border border-amber-200">
          <Wallet size={20} className="text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800 flex-1">
            <span className="font-bold">Recevez votre argent :</span> indiquez votre numéro Wave ou
            Orange Money pour retirer les avances payées par les joueurs.
          </p>
          <Link
            to="/gerant/portefeuille"
            className="text-sm font-bold text-white bg-vert-principal px-4 py-2 rounded-[8px] hover:bg-vert-survol transition-colors text-center"
          >
            Ajouter mon numéro
          </Link>
        </div>
      )}

      {/* SECTION 1 : CARTES DES 4 KPIs */}
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

      {/* SECTION 2 : GRAPHIQUE DES REVENUS */}
      <section>
        <RevenusChart data={revenus} total={revenus?.total} />
      </section>

      {/* SECTION 3 : RÉSERVATIONS RÉCENTES */}
      <section>
        <ReservationsRecentesTable reservations={reservations} />
      </section>

    </GerantLayout>
  );
}
