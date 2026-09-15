import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers, Wallet, CreditCard, MapPin, Star } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';

const LABELS_STATUT_ABONNEMENT = {
  en_attente_validation: 'En attente de validation',
  essai: "Période d'essai",
  actif: 'Actif',
  expire: 'Expiré',
};

/**
 * Page Détail Gérant (Espace Admin)
 *
 * Répond à la question "pour un gérant donné, combien il gagne, où en est
 * son abonnement, quels sont ses terrains ?" : ouverte depuis le bouton
 * "Voir" de la page "Gestion des utilisateurs".
 */
export default function GerantDetail({ onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    async function loadDetail() {
      try {
        setLoading(true);
        const [detailData, profileData] = await Promise.all([
          adminService.getGerantDetail(id),
          adminService.getAdminProfile(),
        ]);
        setDetail(detailData);
        setProfile(profileData);
      } catch (error) {
        console.error('Erreur chargement détail gérant:', error);
        setErreur("Impossible de charger les informations de ce gérant.");
      } finally {
        setLoading(false);
      }
    }

    loadDetail();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout title="Détail du gérant" profile={profile} onLogout={onLogout}>
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-bold">Chargement...</p>
        </div>
      </AdminLayout>
    );
  }

  if (erreur || !detail) {
    return (
      <AdminLayout title="Détail du gérant" profile={profile} onLogout={onLogout}>
        <p className="text-sm text-red-600 font-semibold">{erreur || "Gérant introuvable."}</p>
      </AdminLayout>
    );
  }

  const { gerant, terrains, nombreTerrains, revenusTotaux, revenusMois, abonnement, paiementsRecus, paiementsAbonnement } = detail;

  return (
    <AdminLayout title="Détail du gérant" profile={profile} onLogout={onLogout}>

      <button
        type="button"
        onClick={() => navigate('/admin/utilisateurs')}
        className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-vert-principal cursor-pointer"
      >
        <ArrowLeft size={14} /> Retour aux utilisateurs
      </button>

      {/* EN-TÊTE GÉRANT */}
      <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-2xs flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-dore text-vert-principal flex items-center justify-center font-black text-lg shrink-0">
          {gerant.nom.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-lg font-black text-gray-900">{gerant.nom}</h2>
          <p className="text-sm text-gray-500">{gerant.email}</p>
        </div>
      </div>

      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-[12px] p-5 border border-gray-200/80 shadow-2xs space-y-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <Layers size={14} /> Terrains
          </span>
          <p className="text-2xl font-black text-vert-principal">{nombreTerrains}</p>
        </div>
        <div className="bg-white rounded-[12px] p-5 border border-gray-200/80 shadow-2xs space-y-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <Wallet size={14} /> Revenus ce mois
          </span>
          <p className="text-2xl font-black text-vert-principal">{revenusMois.toLocaleString('fr-FR')} FCFA</p>
        </div>
        <div className="bg-white rounded-[12px] p-5 border border-gray-200/80 shadow-2xs space-y-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <Wallet size={14} /> Revenus totaux
          </span>
          <p className="text-2xl font-black text-vert-principal">{revenusTotaux.toLocaleString('fr-FR')} FCFA</p>
        </div>
        <div className="bg-white rounded-[12px] p-5 border border-gray-200/80 shadow-2xs space-y-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <CreditCard size={14} /> Abonnement
          </span>
          {abonnement ? (
            <>
              <p className={`text-sm font-black ${abonnement.estActif ? 'text-emerald-600' : 'text-red-600'}`}>
                {LABELS_STATUT_ABONNEMENT[abonnement.statut] || abonnement.statut}
              </p>
              <p className="text-[11px] text-gray-400">
                {abonnement.estActif ? 'Accès actif' : 'Accès suspendu'}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400">Aucun abonnement</p>
          )}
        </div>
      </section>

      {/* TERRAINS */}
      <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-2xs space-y-4">
        <h3 className="text-base font-black text-gray-900">Terrains ({nombreTerrains})</h3>
        {terrains.length === 0 ? (
          <p className="text-sm text-gray-500">Ce gérant n'a encore ajouté aucun terrain.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {terrains.map((t) => (
              <div key={t.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.nom}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={12} /> {t.ville}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span className="font-bold">{t.prixHeure.toLocaleString('fr-FR')} FCFA/h</span>
                  <span className="flex items-center gap-1">
                    <Star size={12} className="fill-amber-400 text-amber-400" /> {t.noteMoyenne} ({t.nombreAvis})
                  </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full ${
                      t.actif ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {t.actif ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAIEMENTS REÇUS DES CLIENTS */}
      <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-2xs space-y-4">
        <div>
          <h3 className="text-base font-black text-gray-900">Paiements reçus des clients</h3>
          <p className="text-xs text-gray-500">Avances et soldes payés par les amateurs sur ses terrains — de l'argent qu'il encaisse.</p>
        </div>
        {paiementsRecus.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun paiement reçu pour le moment.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {paiementsRecus.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <div>
                  <p className="font-bold text-gray-900">{p.type}</p>
                  <p className="text-xs text-gray-500">{p.date} · {p.moyenPaiement}</p>
                </div>
                <span className="font-black text-emerald-600">+{p.montant.toLocaleString('fr-FR')} FCFA</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAIEMENTS D'ABONNEMENT (VERS LA PLATEFORME) */}
      <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-2xs space-y-4">
        <div>
          <h3 className="text-base font-black text-gray-900">Paiements d'abonnement</h3>
          <p className="text-xs text-gray-500">Ce que ce gérant a payé à Sama-Terrain pour son abonnement mensuel (7 500 FCFA).</p>
        </div>
        {paiementsAbonnement.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun paiement d'abonnement pour le moment (essai gratuit en cours ou pas encore renouvelé).</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {paiementsAbonnement.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <div>
                  <p className="font-bold text-gray-900">Abonnement mensuel</p>
                  <p className="text-xs text-gray-500">{p.date} · {p.moyenPaiement}</p>
                </div>
                <span className="font-black text-amber-600">−{p.montant.toLocaleString('fr-FR')} FCFA</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </AdminLayout>
  );
}
