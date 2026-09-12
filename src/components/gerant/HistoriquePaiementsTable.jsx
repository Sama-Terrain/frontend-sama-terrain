import React from 'react';
import Button from '../ui/Button';

const MODE_BADGE_CLASS = {
  Wave: 'bg-sky-100 text-sky-700',
  'Orange Money': 'bg-orange-100 text-orange-700',
  'Carte Bancaire': 'bg-gray-100 text-gray-700',
};

const formatMontant = (value) => `${value.toLocaleString('fr-FR')} FCFA`;

/**
 * Composant HistoriquePaiementsTable
 * Historique des paiements reçus par le gérant, avec export CSV/PDF.
 */
export default function HistoriquePaiementsTable({ paiements = [], onExportCsv, onExportPdf }) {
  return (
    <div className="bg-white rounded-[12px] border border-gray-200/80 shadow-2xs">

      <div className="flex items-center justify-between p-6 sm:p-8 pb-4 flex-wrap gap-3">
        <h3 className="text-base sm:text-lg font-black text-gray-900">Historique des paiements</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" rounded="8px" onClick={onExportCsv}>
            Exporter CSV
          </Button>
          <Button variant="outline" size="sm" rounded="8px" onClick={onExportPdf}>
            Exporter PDF
          </Button>
        </div>
      </div>

      <div className="px-6 sm:px-8 pb-6 sm:pb-8 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-[12px] font-bold text-gray-500">
              <th className="py-3 px-4 rounded-l-[6px]">Date</th>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Terrain</th>
              <th className="py-3 px-4">Mode de paiement</th>
              <th className="py-3 px-4">Montant</th>
              <th className="py-3 px-4 rounded-r-[6px]">Statut</th>
            </tr>
          </thead>
          <tbody>
            {paiements.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-gray-500 font-semibold">
                  Aucun paiement enregistré
                </td>
              </tr>
            ) : (
              paiements.map((paiement) => (
                <tr key={paiement.id} className="border-b border-gray-50 text-[13px] text-gray-700">
                  <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">{paiement.date}</td>
                  <td className="py-3.5 px-4 font-bold text-gray-900 whitespace-nowrap">{paiement.client}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap">{paiement.terrain}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex rounded-[4px] px-[8px] py-[4px] text-[11px] font-bold whitespace-nowrap ${MODE_BADGE_CLASS[paiement.mode] || 'bg-gray-100 text-gray-700'}`}
                    >
                      {paiement.mode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-900 whitespace-nowrap">{formatMontant(paiement.montant)}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex rounded-[4px] px-[8px] py-[4px] text-[11px] font-bold whitespace-nowrap bg-emerald-100 text-emerald-700">
                      {paiement.statut}
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
