import React from 'react';
import { Eye } from 'lucide-react';

const formatMontant = (value) => `${value.toLocaleString('fr-FR')} FCFA`;

/**
 * Composant ReservationsTable
 * Tableau complet des réservations du gérant (page "Réservations"), avec
 * colonne d'action et pagination.
 */
export default function ReservationsTable({
  reservations = [],
  totalReservations = 0,
  page = 1,
  totalPages = 1,
  onPageChange,
  onView,
}) {
  return (
    <div className="bg-white rounded-[12px] border border-gray-200/80 shadow-2xs">

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left border-collapse">
          <thead>
            <tr className="text-[12px] font-bold text-gray-500 border-b border-gray-100">
              <th className="py-4 px-6">Réf</th>
              <th className="py-4 px-4">Client</th>
              <th className="py-4 px-4">Terrain</th>
              <th className="py-4 px-4">Date</th>
              <th className="py-4 px-4">Créneau</th>
              <th className="py-4 px-4">Montant</th>
              <th className="py-4 px-4">Statut</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-sm text-gray-500 font-semibold">
                  Aucune réservation ne correspond à ces filtres
                </td>
              </tr>
            ) : (
              reservations.map((reservation) => (
                <tr key={reservation.id} className="border-b border-gray-50 text-[13px] text-gray-700">
                  <td className="py-4 px-6 font-extrabold text-gray-900 whitespace-nowrap">{reservation.id}</td>
                  <td className="py-4 px-4 font-semibold text-gray-900 whitespace-nowrap">{reservation.client}</td>
                  <td className="py-4 px-4 whitespace-nowrap">{reservation.terrain}</td>
                  <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{reservation.date}</td>
                  <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{reservation.creneau}</td>
                  <td className="py-4 px-4 font-bold text-gray-900 whitespace-nowrap">{formatMontant(reservation.montant)}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex rounded-[4px] px-[8px] py-[4px] text-[11px] font-bold whitespace-nowrap ${reservation.statutBadgeClass}`}
                    >
                      {reservation.statut}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      type="button"
                      onClick={() => onView && onView(reservation)}
                      className="w-8 h-8 rounded-[6px] hover:bg-gray-100 inline-flex items-center justify-center text-gray-500 cursor-pointer"
                      aria-label={`Voir la réservation ${reservation.id}`}
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
        <p className="text-xs text-gray-500">
          Affichage de 1 à {reservations.length} sur {totalReservations} réservations
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => onPageChange && onPageChange(Math.max(1, page - 1))}
            className="rounded-[6px] border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange && onPageChange(pageNumber)}
              className={`rounded-[6px] px-3 py-1.5 text-xs font-bold ${
                page === pageNumber
                  ? 'bg-vert-principal text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => onPageChange && onPageChange(Math.min(totalPages, page + 1))}
            className="rounded-[6px] border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      </div>

    </div>
  );
}
