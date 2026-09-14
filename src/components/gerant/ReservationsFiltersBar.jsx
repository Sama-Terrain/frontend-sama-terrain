import React from 'react';
import { Calendar } from 'lucide-react';

const STATUTS = ['Toutes', 'Confirmées', 'Annulées'];

/**
 * Composant ReservationsFiltersBar
 * Barre de filtres de la page "Réservations" : période, terrain et statut.
 */
export default function ReservationsFiltersBar({
  periodeLabel,
  terrains,
  terrainSelectionne,
  onChangeTerrain,
  statutSelectionne,
  onChangeStatut,
}) {
  return (
    <div className="bg-white rounded-[12px] border border-gray-200/80 shadow-2xs p-5 grid grid-cols-1 md:grid-cols-3 gap-5">

      {/* PÉRIODE */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Période</label>
        <div className="flex items-center gap-2 border border-gray-200 rounded-[8px] px-4 py-2.5 text-sm font-semibold text-gray-700">
          <Calendar size={16} className="text-gray-400 shrink-0" />
          <span>{periodeLabel}</span>
        </div>
      </div>

      {/* TERRAIN */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Terrain</label>
        <select
          value={terrainSelectionne}
          onChange={(e) => onChangeTerrain(e.target.value)}
          className="w-full border border-gray-200 rounded-[8px] px-4 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-vert-principal cursor-pointer"
        >
          <option value="Tous les terrains">Tous les terrains</option>
          {terrains.map((terrain) => (
            <option key={terrain} value={terrain}>{terrain}</option>
          ))}
        </select>
      </div>

      {/* STATUT */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Statut de réservation</label>
        <div className="flex items-center gap-1 rounded-[8px] border border-gray-200 p-1">
          {STATUTS.map((statut) => (
            <button
              key={statut}
              type="button"
              onClick={() => onChangeStatut(statut)}
              className={`flex-1 rounded-[6px] px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                statutSelectionne === statut
                  ? 'bg-vert-principal text-white'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {statut}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
