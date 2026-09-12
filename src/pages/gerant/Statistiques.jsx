import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import GerantLayout from '../../components/gerant/GerantLayout';
import AdminKpiCard from '../../components/admin/AdminKpiCard';
import ReservationsParJourChart from '../../components/gerant/ReservationsParJourChart';
import ModesPaiementDonut from '../../components/gerant/ModesPaiementDonut';
import RecommandationsIACard from '../../components/gerant/RecommandationsIACard';
import { gerantService } from '../../services/gerantService';

const PERIODES = ['7 Derniers Jours', '30 Derniers Jours', '90 Derniers Jours'];

/**
 * Page Statistiques (Espace Gérant)
 *
 * Rapport d'activité général du gérant : KPIs, répartition des réservations
 * par jour, modes de paiement utilisés et recommandations générées par IA.
 */
export default function Statistiques({ onLogout }) {
  const [kpis, setKpis] = useState([]);
  const [reservationsParJour, setReservationsParJour] = useState([]);
  const [modesPaiement, setModesPaiement] = useState([]);
  const [recommandations, setRecommandations] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periode, setPeriode] = useState(PERIODES[1]);

  useEffect(() => {
    async function loadStatistiques() {
      try {
        setLoading(true);
        const [kpisData, reservationsData, paiementData, recommandationsData, profileData] = await Promise.all([
          gerantService.getStatistiquesKpis(),
          gerantService.getReservationsParJour(),
          gerantService.getModesPaiementStats(),
          gerantService.getRecommandationsIA(),
          gerantService.getGerantProfile(),
        ]);
        setKpis(kpisData);
        setReservationsParJour(reservationsData);
        setModesPaiement(paiementData);
        setRecommandations(recommandationsData);
        setProfile(profileData);
      } catch (error) {
        console.error('Erreur chargement statistiques gérant:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStatistiques();
  }, []);

  if (loading) {
    return (
      <GerantLayout title="Statistiques & Recommandations IA" profile={profile} onLogout={onLogout}>
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-bold">Chargement des statistiques...</p>
        </div>
      </GerantLayout>
    );
  }

  return (
    <GerantLayout title="Statistiques &  IA" profile={profile} onLogout={onLogout}>

      {/* EN-TÊTE + SÉLECTEUR DE PÉRIODE */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-black text-vert-principal">Rapport d'activité général</h2>
        <div className="relative">
          <select
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            className="appearance-none border border-gray-200 rounded-[8px] pl-9 pr-8 py-2.5 text-sm font-bold text-gray-900 bg-white outline-none focus:border-vert-principal cursor-pointer"
          >
            {PERIODES.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <Calendar size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {kpis.map((kpi) => (
          <AdminKpiCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            trendDirection={kpi.trendDirection}
          />
        ))}
      </section>

      {/* GRAPHIQUES */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <ReservationsParJourChart data={reservationsParJour} />
        <ModesPaiementDonut data={modesPaiement} />
      </section>

      {/* RECOMMANDATIONS IA */}
      <RecommandationsIACard recommandations={recommandations} />

    </GerantLayout>
  );
}
