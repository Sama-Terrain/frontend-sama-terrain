import { Check } from 'lucide-react';
import Button from '../ui/Button';
import JourToggle from './JourToggle';
import { JOURS_SEMAINE } from '../../utils/jours';

/**
 * Composant ConfigurerCreneauxPanel
 * Panneau latéral permettant de définir le tarif de chaque créneau puis de
 * l'appliquer aux jours de la semaine sélectionnés (ex : tarifs différents
 * en semaine et le week-end).
 */
export default function ConfigurerCreneauxPanel({
  terrainLabel,
  creneaux,
  joursSelectionnes,
  onToggleJour,
  prixParCreneau,
  onChangePrix,
  onAppliquer,
  envoiEnCours = false,
  message = '',
}) {
  return (
    <div className="bg-white rounded-[12px] border border-gray-200/80 shadow-2xs p-6 space-y-6 lg:sticky lg:top-24">

      <h3 className="text-base font-black text-gray-900">Configurer les créneaux</h3>

      {/* TERRAIN (lecture seule, dépend du sélecteur en haut de page) */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700">Terrain</label>
        <div className="w-full border border-gray-200 rounded-[8px] px-4 py-3 text-xs font-bold text-gray-600 bg-gray-50">
          {terrainLabel}
        </div>
      </div>

      {/* JOURS D'APPLICATION */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-700">Jours d'application</label>
        <div className="flex items-center gap-2 flex-wrap">
          {JOURS_SEMAINE.map((jour) => (
            <JourToggle
              key={jour}
              jour={jour}
              selected={joursSelectionnes.includes(jour)}
              onToggle={onToggleJour}
            />
          ))}
        </div>
      </div>

      {/* CRÉNEAUX & TARIFS */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-700">Créneaux & tarifs</label>
        <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
          {creneaux.map((creneau) => (
            <div key={creneau.label} className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-gray-600 shrink-0 w-24">
                {creneau.label}
              </span>
              <div className="flex items-center gap-2 flex-1 border border-gray-200 rounded-[8px] px-3 py-2">
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={prixParCreneau[creneau.label] ?? 0}
                  onChange={(e) => onChangePrix(creneau.label, Number(e.target.value))}
                  className="w-full text-xs font-bold text-gray-900 outline-none"
                />
                <span className="text-[11px] font-semibold text-gray-400 shrink-0">FCFA</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        type="button"
        variant="primary"
        size="md"
        rounded="8px"
        fullWidth
        onClick={onAppliquer}
        disabled={envoiEnCours}
        className="gap-2"
      >
        <Check size={16} />
        <span>{envoiEnCours ? 'Application en cours...' : 'Appliquer les créneaux'}</span>
      </Button>

      {message && (
        <p className="text-xs font-semibold text-vert-principal text-center">{message}</p>
      )}

    </div>
  );
}
