import React from 'react';

// utils/formatPrix.js est actuellement vide dans le projet ; formatage local en attendant son implémentation.
const formatMontant = (value) => `${value.toLocaleString('fr-FR')} FCFA`;

/**
 * Composant ReservationsRecentesTable
 * Tableau des dernières réservations reçues par le gérant.
 */
export default function ReservationsRecentesTable({ reservations = [] }) {
  return (
    <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-2xs text-left space-y-5">

      <h3 className="text-base sm:text-lg font-black text-vert-principal">
        Réservations récentes
      </h3>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[720px] text-left border-collapse">
          <thead>
            <tr className="text-[12px] font-bold text-gray-500 border-b border-gray-200">
              <th className="py-3 pr-4">Référence</th>
              <th className="py-3 pr-4">Terrain</th>
              <th className="py-3 pr-4">Client</th>
              <th className="py-3 pr-4">Créneau</th>
              <th className="py-3 pr-4">Montant</th>
              <th className="py-3 pr-4">Statut</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-gray-500 font-semibold">
                  Aucune réservation récente
                </td>
              </tr>
            ) : (
              reservations.map((reservation) => (
                <tr key={reservation.id} className="border-b border-gray-100 text-[13px] text-gray-700">
                  <td className="py-3.5 pr-4 font-extrabold text-gray-900 whitespace-nowrap">
                    {reservation.id}
                  </td>
                  <td className="py-3.5 pr-4 whitespace-nowrap">{reservation.terrain}</td>
                  <td className="py-3.5 pr-4 font-semibold text-gray-900 whitespace-nowrap">
                    {reservation.client}
                  </td>
                  <td className="py-3.5 pr-4 text-gray-500 whitespace-nowrap">{reservation.creneau}</td>
                  <td className="py-3.5 pr-4 font-bold text-gray-900 whitespace-nowrap">
                    {formatMontant(reservation.montant)}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-flex rounded-[4px] px-[8px] py-[4px] text-[11px] font-bold whitespace-nowrap ${reservation.statutBadgeClass}`}
                    >
                      {reservation.statut}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
