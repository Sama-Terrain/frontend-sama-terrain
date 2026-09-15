import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import GerantLayout from '../../components/gerant/GerantLayout';
import OccupationPredictionChart from '../../components/gerant/insights/OccupationPredictionChart';
import RecommandationsTarifairesCards from '../../components/gerant/insights/RecommandationsTarifairesCards';
import AlertesIA from '../../components/gerant/insights/AlertesIA';
import RecommandationsIACard from '../../components/gerant/RecommandationsIACard';
import { gerantService } from '../../services/gerantService';
import { creneauService } from '../../services/creneauService';

/**
 * Page Insights IA (Espace Gérant)
 *
 * Vue d'ensemble générée à partir des vraies statistiques de réservation
 * (via le micro-service IA) : occupation prévue, recommandations
 * tarifaires et alertes concrètes, sur tous les terrains du gérant.
 */
export default function InsightsIA({ onLogout }) {
  const [insights, setInsights] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicationEnCours, setApplicationEnCours] = useState(null);

  useEffect(() => {
    async function loadInsights() {
      try {
        setLoading(true);
        const [insightsData, profileData] = await Promise.all([
          gerantService.getInsightsIA(),
          gerantService.getGerantProfile(),
        ]);
        setInsights(insightsData);
        setProfile(profileData);
      } catch (error) {
        console.error('Erreur chargement insights IA:', error);
      } finally {
        setLoading(false);
      }
    }

    loadInsights();
  }, []);

  const ignorerAlerte = (index) => {
    setInsights((precedent) => ({
      ...precedent,
      alertes: precedent.alertes.filter((_, i) => i !== index),
    }));
  };

  const appliquerPrixRecommande = async (creneauId) => {
    setApplicationEnCours(creneauId);
    try {
      await creneauService.appliquerPrixRecommande(creneauId);
      setInsights((precedent) => ({
        ...precedent,
        alertes: precedent.alertes.filter((a) => a.creneau_id !== creneauId),
        recommandations_tarifaires: precedent.recommandations_tarifaires.filter(
          (r) => r.id !== creneauId
        ),
      }));
    } catch (error) {
      console.error('Erreur application du prix recommandé:', error);
    } finally {
      setApplicationEnCours(null);
    }
  };

  if (loading || !insights) {
    return (
      <GerantLayout title="Intelligence Artificielle — Insights" profile={profile} onLogout={onLogout}>
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-bold">Analyse de vos terrains en cours...</p>
        </div>
      </GerantLayout>
    );
  }

  return (
    <GerantLayout title="Intelligence Artificielle — Insights" profile={profile} onLogout={onLogout}>

      {/* BANNIÈRE */}
      <div className="bg-vert-principal rounded-[12px] p-6 sm:p-8 text-white space-y-2">
        <h2 className="text-lg sm:text-xl font-black flex items-center gap-2">
          <Sparkles size={20} className="text-dore" />
          Optimisez Sama-Terrain avec l'Intelligence Artificielle
        </h2>
        <p className="text-sm text-emerald-100 max-w-2xl">
          Analysez la demande réelle sur vos créneaux et ajustez vos tarifs pour maximiser le
          rendement financier de vos terrains.
        </p>
      </div>

      {/* OCCUPATION PRÉVUE */}
      <OccupationPredictionChart data={insights.occupation_7_jours} />

      {/* RECOMMANDATIONS TARIFAIRES */}
      <RecommandationsTarifairesCards recommandations={insights.recommandations_tarifaires} />

      {/* ALERTES */}
      <AlertesIA
        alertes={insights.alertes}
        onAppliquer={appliquerPrixRecommande}
        onIgnorer={ignorerAlerte}
        applicationEnCours={applicationEnCours}
      />

      {/* RECOMMANDATIONS TEXTUELLES (LLM) */}
      {insights.recommandations_ia.length > 0 && (
        <RecommandationsIACard recommandations={insights.recommandations_ia} />
      )}

    </GerantLayout>
  );
}
