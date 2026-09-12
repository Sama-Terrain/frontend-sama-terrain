import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../services/adminService';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { FileText, CheckCircle, XCircle } from 'lucide-react';

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
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

  // Effet pour charger les données mockées
  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        const requestsData = await adminService.getValidationRequests();
        setRequests(requestsData);
        
        // Calculer les statistiques
        const pending = requestsData.filter(r => r.status === 'pending').length;
        const approved = requestsData.filter(r => r.status === 'approved').length;
        const rejected = requestsData.filter(r => r.status === 'rejected').length;
        setStats({ pending, approved, rejected });
      } catch (error) {
        console.error('Erreur chargement demandes:', error);
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

  // Fonction pour approuver une demande
  const handleApprove = (requestId) => {
    setRequests(requests.map(req => 
      req.id === requestId ? { ...req, status: 'approved' } : req
    ));
    setStats(prev => ({ ...prev, pending: prev.pending - 1, approved: prev.approved + 1 }));
  };

  // Fonction pour rejeter une demande
  const handleReject = (requestId) => {
    setRequests(requests.map(req => 
      req.id === requestId ? { ...req, status: 'rejected' } : req
    ));
    setStats(prev => ({ ...prev, pending: prev.pending - 1, rejected: prev.rejected + 1 }));
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <AdminLayout title="Validation des Gérants" onLogout={onLogout}>
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-bold">Chargement des demandes...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Validation des Gérants" onLogout={onLogout}>
      
      {/* BARRE D'INFORMATION */}
      <section className="w-full bg-vert-principal rounded-[12px] px-5 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border border-vert-survol shadow-2xs mb-6">
        
        {/* Titre */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-5 h-5 flex items-center justify-center shrink-0">
            <FileText size={20} className="text-white" />
          </div>
          <p className="text-white text-[16px] font-bold leading-normal whitespace-nowrap">
            Validation des professionnels : Sécurisez l'accès aux terrains
          </p>
        </div>

        {/* Statistiques */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-white text-[14px] whitespace-nowrap">
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
          <p>
            Rejetés :{" "}
            <span className="font-extrabold">
              {stats.rejected} rejets
            </span>
          </p>
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
                  <div className="w-fit bg-[#f4f6f5] border border-[#e5e7eb] rounded-[6px] p-2 flex items-center gap-2">
                    <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                      <FileText size={16} className="text-gray-600" />
                    </div>
                    <span className="text-gray-900 text-[12px] font-bold whitespace-nowrap">
                      {request.documentName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pied de carte */}
              <div className="w-full flex items-center justify-between">
                {/* Date */}
                <p className="text-gray-500 text-[12px] font-normal whitespace-nowrap">
                  Soumis le : {request.submittedAt}
                </p>
                {/* Actions */}
                {request.status === 'pending' && (
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      className="bg-[#fee2e2] px-4 py-2.5 rounded-[8px] text-red-600 text-[13px] font-bold whitespace-nowrap"
                      onClick={() => handleReject(request.id)}
                    >
                      Rejeter la demande
                    </button>
                    <button
                      type="button"
                      className="bg-vert-principal px-4 py-2.5 rounded-[8px] text-white text-[13px] font-bold whitespace-nowrap"
                      onClick={() => handleApprove(request.id)}
                    >
                      Approuver & Activer
                    </button>
                  </div>
                )}
                {request.status === 'approved' && (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle size={16} />
                    <span className="text-xs font-bold">Demande approuvée</span>
                  </div>
                )}
                {request.status === 'rejected' && (
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle size={16} />
                    <span className="text-xs font-bold">Demande rejetée</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </section>

    </AdminLayout>
  );
}
