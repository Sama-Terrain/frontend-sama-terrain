import React from 'react';
import { Calendar } from 'lucide-react';

const formatMontant = (value) => `${value.toLocaleString('fr-FR')} FCFA`;

/**
 * Composant ProchainesReservationsTable
 * Tableau des prochaines réservations pour un terrain donné, avec pagination.
 */
export default function ProchainesReservationsTable({
  reservations = [],
  onVoirTout,
  page = 1,
  totalPages = 1,
  totalReservations = 0,
  onPageChange,
}) {
  return (
    <div className="bg-white rounded-[12px] border border-gray-200/80 shadow-2xs">

      <div className="flex items-center justify-between p-6 sm:p-8 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-vert-clair text-vert-principal flex items-center justify-center shrink-0">
            <Calendar size={16} />
          </span>
          <h3 className="text-base font-black text-gray-900">Prochaines réservations</h3>
        </div>
        <button
          type="button"
          onClick={onVoirTout}
          className="text-xs font-bold text-vert-principal hover:underline cursor-pointer"
        >
          Voir tout
        </button>
      </div>

      <div className="px-6 sm:px-8 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left border-collapse">
          <thead>
            <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wide border-b border-gray-100">
              <th className="py-3 pr-4">Joueur</th>
              <th className="py-3 pr-4">Date</th>
              <th className="py-3 pr-4">Créneau</th>
              <th className="py-3 pr-4">Statut</th>
              <th className="py-3 pr-4 text-right">Montant</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-gray-500 font-semibold">
                  Aucune réservation à venir
                </td>
              </tr>
            ) : (
              reservations.map((reservation) => (
                <tr key={reservation.id} className="border-b border-gray-50 text-[13px] text-gray-700">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-full bg-vert-principal text-dore flex items-center justify-center text-[11px] font-bold shrink-0">
                        {reservation.initiales}
                      </span>
                      <span className="font-bold text-gray-900 whitespace-nowrap">{reservation.joueur}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 whitespace-nowrap">{reservation.date}</td>
                  <td className="py-3.5 pr-4 whitespace-nowrap">{reservation.creneau}</td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-flex rounded-[4px] px-[8px] py-[4px] text-[11px] font-bold whitespace-nowrap ${reservation.statutBadgeClass}`}
                    >
                      {reservation.statut}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-right font-extrabold text-gray-900 whitespace-nowrap">
                    {formatMontant(reservation.montant)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-6 sm:p-8 pt-5">
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
