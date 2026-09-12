import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import ToggleSwitch from '../ui/ToggleSwitch';

/**
 * Composant GerantTerrainCard
 * Carte d'un terrain dans la liste "Mes terrains" du gérant : image, statut,
 * statistiques du mois et actions rapides (modifier, créneaux, actif/inactif).
 */
export default function GerantTerrainCard({ terrain, onToggleActif }) {
  const navigate = useNavigate();
  const {
    id,
    nom,
    localisation,
    image,
    actif,
    reservationsMois,
    revenusMois,
    note,
  } = terrain;

  return (
    <div className="bg-white rounded-[12px] overflow-hidden border border-gray-200/80 shadow-2xs flex flex-col">

      {/* IMAGE */}
      <div className="relative h-44 w-full overflow-hidden bg-gray-100">
        <img src={image} alt={nom} className="w-full h-full object-cover" />
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">

        {/* NOM + STATUT */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-extrabold text-gray-900">{nom}</h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${
              actif ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-500'
            }`}
          >
            {actif ? 'Actif' : 'Inactif'}
          </span>
        </div>

        {/* LOCALISATION */}
        <p className="text-xs text-gray-500 -mt-2">{localisation}</p>

        {/* STATISTIQUES DU MOIS */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-left">
          <div className="space-y-1">
            <p className="text-[11px] text-gray-400">Ce mois</p>
            <p className="text-xs sm:text-sm font-extrabold text-gray-900">
              {reservationsMois} {reservationsMois <= 1 ? 'réservation' : 'réservations'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] text-gray-400">Revenus</p>
            <p className="text-xs sm:text-sm font-extrabold text-gray-900">{revenusMois}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] text-gray-400">Note</p>
            <p className="text-xs sm:text-sm font-extrabold text-gray-900">
              {note ? note.toFixed(1) : 'Aucune note'}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between gap-2 pt-3">
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              rounded="8px"
              onClick={() => navigate(`/gerant/terrains/${id}/modifier`)}
            >
              Modifier
            </Button>
            <Button
              variant="outline"
              size="sm"
              rounded="8px"
              onClick={() => navigate('/gerant/creneaux')}
            >
              Créneaux
            </Button>
          </div>

          <ToggleSwitch
            checked={actif}
            onChange={(next) => onToggleActif && onToggleActif(id, next)}
            label={actif ? 'Actif' : 'Inactif'}
          />
        </div>

      </div>

    </div>
  );
}
