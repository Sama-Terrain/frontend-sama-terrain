import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ReviewCard from '../../components/admin/ReviewCard';
import { adminService } from '../../services/adminService';
import { ChevronRight } from 'lucide-react';

/**
 * Page ModerationAvis (Modération des Avis)
 *
 * Cette page permet à l'administrateur de :
 * 1. Voir les avis en attente de modération
 * 2. Approuver ou supprimer les avis
 * 3. Filtrer par statut (En attente, Approuvés)
 */
export default function ModerationAvis({ onLogout }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  // Effet pour charger les données mockées
  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        const reviewsData = await adminService.getReviews();
        setReviews(reviewsData);
      } catch (error) {
        console.error('Erreur chargement avis:', error);
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  // Filtrage par statut
  const filteredReviews = reviews.filter(review => {
    if (activeTab === "pending") return review.status === 'pending';
    if (activeTab === "approved") return review.status === 'approved';
    return true;
  });

  // Pagination
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleApprove = (review) => {
    setReviews(reviews.map(r => 
      r.id === review.id ? { ...r, status: 'approved' } : r
    ));
    console.log("Avis approuvé :", review);
  };

  const handleDelete = (review) => {
    setReviews(reviews.filter(r => r.id !== review.id));
    console.log("Avis supprimé :", review);
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <AdminLayout title="Modération des Avis" onLogout={onLogout}>
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-bold">Chargement des avis...</p>
        </div>
      </AdminLayout>
    );
  }

  const pendingCount = reviews.filter(r => r.status === 'pending').length;

  return (
    <AdminLayout title="Modération des Avis" onLogout={onLogout}>
      
      {/* TABS */}
      <div className="flex w-full gap-[4px] rounded-[8px] border border-[#e5e7eb] bg-white p-[4px]">
        {/* En attente */}
        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={`flex flex-1 items-center justify-center rounded-[6px] px-[16px] py-[10px] text-[12px] font-bold transition-colors ${
            activeTab === "pending"
              ? "bg-vert-principal text-white"
              : "bg-transparent text-[#4b5563]"
          }`}
        >
          En attente ({pendingCount})
        </button>

        {/* Approuvés */}
        <button
          type="button"
          onClick={() => setActiveTab("approved")}
          className={`flex flex-1 items-center justify-center rounded-[6px] px-[16px] py-[10px] text-[12px] font-bold transition-colors ${
            activeTab === "approved"
              ? "bg-vert-principal text-white"
              : "bg-transparent text-[#4b5563]"
          }`}
        >
          Approuvés
        </button>
      </div>

      {/* REVIEWS */}
      <div className="mt-[32px] flex w-full flex-col gap-[20px]">
        {currentReviews.length === 0 ? (
          <div className="bg-white rounded-[12px] p-12 border border-gray-200/80 shadow-2xs text-center">
            <p className="text-sm text-gray-500 font-semibold">
              Aucun avis trouvé
            </p>
          </div>
        ) : (
          currentReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onApprove={handleApprove}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-[20px] px-[20px] py-[18px]">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              type="button"
              onClick={() => setCurrentPage(i + 1)}
              className={`flex h-[40px] w-[40px] items-center justify-center rounded-[4px] border border-[#e8edeb] text-[14px] font-bold ${
                currentPage === i + 1
                  ? "bg-vert-principal text-white"
                  : "bg-white text-[#0f1a17]"
              }`}
            >
              {i + 1}
            </button>
          ))}

          {/* Next */}
          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.min(page + 1, totalPages))
            }
            className="flex h-[40px] w-[36px] items-center justify-center rounded-[6px] border border-[#e5e7eb] bg-white"
          >
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div>
      )}

    </AdminLayout>
  );
}
