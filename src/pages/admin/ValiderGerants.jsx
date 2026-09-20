import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';
import { FileText, CheckCircle, XCircle, Download } from 'lucide-react';

/**
 * Page ValiderGerants (Validation des Gérants)
 *
 * Cette page permet à l'administrateur de :
 * 1. Voir les demandes de validation de gérants
 * 2. Approuver ou rejeter les demandes
 * 3. Consulter les statistiques de validation
 */
export default function ValiderGerants({ onLogout }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  // Id de la demande pour laquelle on est en train de saisir un motif de rejet.
  const [demandeARejeter, setDemandeARejeter] = useState(null);
  const [motifRejet, setMotifRejet] = useState('');
  const [erreurRejet, setErreurRejet] = useState('');

  const calculerStats = (liste) => ({
    pending: liste.filter(r => r.status === 'pending').length,
    approved: liste.filter(r => r.status === 'approved').length,
    rejected: liste.filter(r => r.status === 'rejected').length,
  });

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        const [requestsData, profileData] = await Promise.all([
          adminService.getValidationRequests(),
          adminService.getAdminProfile(),
        ]);
        setRequests(requestsData);
        setStats(calculerStats(requestsData));
        setProfile(profileData);
      } catch (error) {
        console.error('Erreur chargement demandes:', error);
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

  // Approuve la demande : active le compte du gérant et démarre son essai gratuit.
  const handleApprove = async (requestId) => {
    await adminService.approuverGerant(requestId);
    const updated = requests.map(req =>
      req.id === requestId ? { ...req, status: 'approved' } : req
    );
    setRequests(updated);
    setStats(calculerStats(updated));
  };

  // Le motif est obligatoire (envoyé par email à la personne), donc on
  // ouvre d'abord une petite modale de saisie plutôt que de rejeter direct.
  const ouvrirModalRejet = (requestId) => {
    setDemandeARejeter(requestId);
    setMotifRejet('');
    setErreurRejet('');
  };

  const fermerModalRejet = () => {
    setDemandeARejeter(null);
    setMotifRejet('');
    setErreurRejet('');
  };

  const confirmerRejet = async () => {
    if (!motifRejet.trim()) {
      setErreurRejet('Le motif du rejet est obligatoire.');
      return;
    }

    await adminService.rejeterGerant(demandeARejeter, motifRejet.trim());
    const updated = requests.map(req =>
      req.id === demandeARejeter ? { ...req, status: 'rejected' } : req
    );
    setRequests(updated);
    setStats(calculerStats(updated));
    fermerModalRejet();
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <AdminLayout title="Validation des Gérants" profile={profile} onLogout={onLogout}>
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-bold">Chargement des demandes...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Validation des Gérants" profile={profile} onLogout={onLogout}>
      
  
      {/* BARRE D'INFORMATION */}
      <section className="w-full bg-vert-principal rounded-xl px-4 sm:px-5 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 border border-vert-survol shadow-2xs mb-6">
        
        {/* Titre */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-5 h-5 flex items-center justify-center shrink-0">
            <FileText size={20} className="text-white" />
          </div>
          <p className="text-white text-sm sm:text-[16px] font-bold leading-snug">
            Validation des professionnels
          </p>
        </div>

        {/* Statistiques */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 sm:gap-6 text-white text-xs sm:text-[14px] whitespace-nowrap">
          <p>
            En attente :{" "}
            <span className="font-extrabold text-dore">
              {stats.pending} demandes
            </span>
          </p>
          <p>
            Approuvés :{" "}
            <span className="font-extrabold">
              {stats.approved} gérants
            </span>
          </p>
          {/* <p>
            Rejetés :{" "}
            <span className="font-extrabold">
              {stats.rejected} rejets
            </span>
          </p> */}
        </div>
      </section>

      {/* LISTE DES DEMANDES */}
      <section className="space-y-4">
        {requests.length === 0 ? (
          <div className="bg-white rounded-[12px] p-12 border border-gray-200/80 shadow-2xs text-center">
            <p className="text-sm text-gray-500 font-semibold">
              Aucune demande de validation en attente
            </p>
          </div>
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className="w-full bg-white border border-[#e5e7eb] rounded-[12px] p-6 flex flex-col gap-5"
            >
              {/* En-tête */}
              <div className="w-full flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 shrink-0 rounded-full bg-dore flex items-center justify-center">
                    <span className="text-vert-principal text-[18px] font-extrabold">
                      {request.initials}
                    </span>
                  </div>
                  {/* Informations */}
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-900 text-[16px] font-extrabold leading-normal">
                      {request.name}
                    </p>
                    <p className="text-gray-600 text-[13px] font-normal leading-normal">
                      {request.phone} • {request.city}
                    </p>
                  </div>
                </div>
                {/* Statut */}
                {request.status === 'pending' && (
                  <div className="bg-[#fed7aa] px-3 py-1.5 rounded-[20px]">
                    <span className="text-[#92400e] text-[12px] font-bold whitespace-nowrap">
                      En attente d'approbation
                    </span>
                  </div>
                )}
                {request.status === 'approved' && (
                  <div className="bg-[#d1fae5] px-3 py-1.5 rounded-[20px]">
                    <span className="text-[#065f46] text-[12px] font-bold whitespace-nowrap">
                      Approuvé
                    </span>
                  </div>
                )}
                {request.status === 'rejected' && (
                  <div className="bg-gray-100 px-3 py-1.5 rounded-[20px]">
                    <span className="text-gray-700 text-[12px] font-bold whitespace-nowrap">
                      Rejeté
                    </span>
                  </div>
                )}
              </div>

              {/* Informations centrales */}
              <div className="w-full border-t border-b border-[#e5e7eb] py-4 flex items-start gap-12">
                {/* Terrain */}
                <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                  <p className="text-gray-500 text-[11px] font-bold uppercase leading-normal">
                    Terrain à Enregistrer
                  </p>
                  <p className="text-vert-principal text-[15px] font-bold leading-normal">
                    {request.terrainName}
                  </p>
                  <p className="text-gray-600 text-[13px] font-normal leading-normal">
                    Ville : {request.terrainCity}
                  </p>
                </div>
                {/* Document */}
                <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                  <p className="text-gray-500 text-[11px] font-bold uppercase leading-normal">
                    Document d'identité ou RCCM
                  </p>
                  {request.documentUrl ? (
                    <a
                      href={request.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-fit bg-[#f4f6f5] hover:bg-[#e8ece9] border border-[#e5e7eb] rounded-[6px] p-2 flex items-center gap-2 transition-colors cursor-pointer"
                      title="Ouvrir le document dans un nouvel onglet"
                    >
                      <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                        <FileText size={16} className="text-gray-600" />
                      </div>
                      <span className="text-vert-principal text-[12px] font-bold underline whitespace-nowrap">
                        {request.documentName}
                      </span>
                      <Download size={13} className="text-gray-500 shrink-0" />
                    </a>
                  ) : (
                    <div className="w-fit bg-[#f4f6f5] border border-[#e5e7eb] rounded-[6px] p-2 flex items-center gap-2">
                      <FileText size={16} className="text-gray-600" />
                      <span className="text-gray-900 text-[12px] font-bold whitespace-nowrap">
                        {request.documentName}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Pied de carte */}
              <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Date */}
                <p className="text-gray-500 text-[11px] sm:text-[12px] font-normal whitespace-nowrap order-2 sm:order-1">
                  Soumis le : {request.submittedAt}
                </p>
                {/* Actions */}
                {request.status === 'pending' && (
                  <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2">
                    <button
                      type="button"
                      className="flex-1 sm:flex-initial bg-[#fee2e2] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-red-600 text-xs sm:text-[13px] font-bold whitespace-nowrap"
                      onClick={() => ouvrirModalRejet(request.id)}
                    >
                      Rejeter
                    </button>
                    <button
                      type="button"
                      className="flex-1 sm:flex-initial bg-vert-principal px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-white text-xs sm:text-[13px] font-bold whitespace-nowrap"
                      onClick={() => handleApprove(request.id)}
                    >
                      Approuver & Activer
                    </button>
                  </div>
                )}
                {request.status === 'approved' && (
                  <div className="flex items-center gap-2 text-emerald-600 order-1 sm:order-2">
                    <CheckCircle size={16} />
                    <span className="text-xs font-bold">Demande approuvée</span>
                  </div>
                )}
                {request.status === 'rejected' && (
                  <div className="flex items-center gap-2 text-red-600 order-1 sm:order-2">
                    <XCircle size={16} />
                    <span className="text-xs font-bold">Demande rejetée</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </section>

      {/* MODAL : motif du rejet (obligatoire, envoyé par email à la personne) */}
      {demandeARejeter !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-5 sm:p-6 max-w-md w-full space-y-4">
            <h3 className="text-gray-900 text-sm sm:text-[16px] font-extrabold">
              Motif du rejet
            </h3>
            <textarea
              value={motifRejet}
              onChange={(e) => setMotifRejet(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="Ex : le document fourni n'est pas lisible, merci de le renvoyer."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-vert-principal focus:ring-1 focus:ring-vert-principal"
            />
            <p className="text-[11px] text-gray-400 text-right">{motifRejet.length}/500</p>
            {erreurRejet && (
              <p className="text-red-600 text-xs font-bold">{erreurRejet}</p>
            )}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={fermerModalRejet}
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-gray-600 text-xs sm:text-[13px] font-bold whitespace-nowrap"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmerRejet}
                className="bg-red-600 hover:bg-red-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-white text-xs sm:text-[13px] font-bold whitespace-nowrap"
              >
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
