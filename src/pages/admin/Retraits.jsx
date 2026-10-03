import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';

const ONGLETS = [
  { statut: 'en_attente', libelle: 'À verser' },
  { statut: 'verse', libelle: 'Versés' },
  { statut: 'echoue', libelle: 'Échoués' },
];

const fcfa = (montant) => `${(montant || 0).toLocaleString('fr-FR')} FCFA`;

/**
 * Page Retraits (Espace Admin)
 *
 * Les avances des joueurs arrivent sur le compte PayTech de la plateforme.
 * Quand un gérant demande un retrait, l'admin lui envoie l'argent depuis
 * le compte Wave / Orange Money de la plateforme, puis le marque ici comme
 * versé (avec la référence de la transaction) ou échoué (le montant revient
 * alors dans le solde du gérant).
 *
 * Étape 2 (versement automatique par API) : cette page servira seulement
 * au suivi, les versements se feront tout seuls (voir backend versements.py).
 */
export default function Retraits({ onLogout }) {
  const [onglet, setOnglet] = useState('en_attente');
  const [retraits, setRetraits] = useState([]);
  const [profile, setProfile] = useState(null);
  const [chargement, setChargement] = useState(true);

  // Retrait en cours de traitement dans la modale : { retrait, action: 'verse' | 'echec' }.
  const [traitement, setTraitement] = useState(null);
  const [saisie, setSaisie] = useState('');
  const [erreurSaisie, setErreurSaisie] = useState('');
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    adminService.getAdminProfile().then(setProfile).catch(() => {});
  }, []);

  useEffect(() => {
    adminService.getRetraits(onglet)
      .then(setRetraits)
      .catch((error) => console.error('Erreur chargement retraits:', error))
      .finally(() => setChargement(false));
  }, [onglet]);

  const changerOnglet = (statut) => {
    if (statut === onglet) return;
    setChargement(true);
    setOnglet(statut);
  };

  const ouvrir = (retrait, action) => {
    setTraitement({ retrait, action });
    setSaisie('');
    setErreurSaisie('');
  };

  const fermer = () => setTraitement(null);

  const confirmer = async () => {
    if (!saisie.trim()) {
      setErreurSaisie(traitement.action === 'verse'
        ? 'La référence de la transaction est obligatoire.'
        : "Le motif de l'échec est obligatoire.");
      return;
    }
    setEnvoi(true);
    try {
      if (traitement.action === 'verse') {
        await adminService.marquerRetraitVerse(traitement.retrait.id, saisie.trim());
      } else {
        await adminService.marquerRetraitEchoue(traitement.retrait.id, saisie.trim());
      }
      // Le retrait a changé de statut : il quitte l'onglet "À verser".
      setRetraits((liste) => liste.filter((r) => r.id !== traitement.retrait.id));
      fermer();
    } catch (error) {
      setErreurSaisie(error.response?.data?.detail || 'Impossible de mettre à jour ce retrait.');
    } finally {
      setEnvoi(false);
    }
  };

  const totalAVerser = onglet === 'en_attente' ? retraits.reduce((total, r) => total + r.montant, 0) : 0;

  return (
    <AdminLayout title="Retraits des gérants" profile={profile} onLogout={onLogout}>

      <section className="w-full bg-vert-principal rounded-xl px-4 sm:px-5 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-vert-survol shadow-2xs mb-6">
        <div className="flex items-center gap-3">
          <Send size={20} className="text-white shrink-0" />
          <p className="text-white text-sm sm:text-[16px] font-bold leading-snug">
            Versements aux gérants (Wave / Orange Money)
          </p>
        </div>
        {onglet === 'en_attente' && (
          <p className="text-white text-xs sm:text-[14px]">
            À verser : <span className="font-extrabold text-dore">{retraits.length} retrait(s) · {fcfa(totalAVerser)}</span>
          </p>
        )}
      </section>

      <div className="flex gap-2 bg-white rounded-[10px] border border-gray-200 p-1.5 w-fit mb-4">
        {ONGLETS.map((o) => (
          <button
            key={o.statut}
            type="button"
            onClick={() => changerOnglet(o.statut)}
            className={`px-4 py-2 rounded-[8px] text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              onglet === o.statut ? 'bg-vert-principal text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {o.libelle}
          </button>
        ))}
      </div>

      {chargement ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : retraits.length === 0 ? (
        <div className="bg-white rounded-[12px] p-12 border border-gray-200/80 text-center">
          <p className="text-sm text-gray-500 font-semibold">Aucun retrait dans cette catégorie.</p>
        </div>
      ) : (
        <section className="space-y-3">
          {retraits.map((retrait) => (
            <div key={retrait.id} className="bg-white border border-gray-200 rounded-[12px] p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-lg font-black text-gray-900">{fcfa(retrait.montant)}</p>
                <p className="text-sm text-gray-700">
                  <span className="font-bold">{retrait.gerant_nom}</span> · {retrait.gerant_email}
                </p>
                <p className="text-sm text-gray-700">
                  Envoyer sur <span className="font-bold">{retrait.operateur_libelle} +221 {retrait.numero.slice(3)}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Demandé le {new Date(retrait.cree_le).toLocaleString('fr-FR')}
                  {retrait.reference_transaction ? ` · Réf. ${retrait.reference_transaction}` : ''}
                  {retrait.motif_echec ? ` · ${retrait.motif_echec}` : ''}
                </p>
              </div>
              {retrait.statut === 'en_attente' && (
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => ouvrir(retrait, 'verse')}
                    className="bg-vert-principal text-white text-sm font-bold px-4 py-2.5 rounded-[8px] hover:bg-vert-survol cursor-pointer"
                  >
                    Marquer versé
                  </button>
                  <button
                    type="button"
                    onClick={() => ouvrir(retrait, 'echec')}
                    className="text-red-600 text-sm font-bold px-4 py-2.5 rounded-[8px] border border-red-200 hover:bg-red-50 cursor-pointer"
                  >
                    Échec
                  </button>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* MODALE : référence du versement ou motif de l'échec */}
      {traitement && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[12px] p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-black text-vert-principal">
              {traitement.action === 'verse' ? 'Confirmer le versement' : 'Signaler un échec'}
            </h3>
            <p className="text-sm text-gray-600">
              {traitement.action === 'verse'
                ? `Après avoir envoyé ${fcfa(traitement.retrait.montant)} sur le ${traitement.retrait.operateur_libelle} +221 ${traitement.retrait.numero.slice(3)}, indiquez la référence de la transaction.`
                : `Le montant (${fcfa(traitement.retrait.montant)}) reviendra dans le solde du gérant.`}
            </p>
            <input
              type="text"
              autoFocus
              value={saisie}
              onChange={(e) => {
                setSaisie(e.target.value);
                setErreurSaisie('');
              }}
              placeholder={traitement.action === 'verse' ? 'Ex : référence du SMS Wave' : 'Ex : numéro introuvable'}
              className={`w-full border rounded-[8px] px-3 py-2.5 text-sm outline-none ${
                erreurSaisie ? 'border-red-500' : 'border-gray-200 focus:border-vert-principal'
              }`}
            />
            {erreurSaisie && <p className="text-[11px] text-red-600 font-semibold">{erreurSaisie}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={fermer} className="px-4 py-2.5 text-sm font-bold text-gray-600 rounded-[8px] hover:bg-gray-100 cursor-pointer">
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmer}
                disabled={envoi}
                className={`px-4 py-2.5 text-sm font-bold text-white rounded-[8px] cursor-pointer disabled:opacity-50 ${
                  traitement.action === 'verse' ? 'bg-vert-principal hover:bg-vert-survol' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {envoi ? 'Enregistrement...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
