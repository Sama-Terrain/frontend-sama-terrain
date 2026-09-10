import { useState } from 'react';
import { Calendar, RotateCcw } from 'lucide-react';

export default function TerrainFilters({ filters = {}, setFilters, onReset, initialFilters, onFilterChange }) {
  // Support both (filters, setFilters) and (initialFilters, onFilterChange) props gracefully
  const [internalFilters, setInternalFilters] = useState({
    localisation: 'Tous les quartiers',
    date: 'Dim. 24 Novembre',
    types: [],
    surfaces: [],
    maxPrix: 35000,
    equipements: [],
    ...(filters || initialFilters || {})
  });

  const activeFilters = filters && Object.keys(filters).length > 0 ? filters : internalFilters;

  const updateFilters = (updater) => {
    if (typeof setFilters === 'function') {
      setFilters(updater);
    } else {
      setInternalFilters((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        if (typeof onFilterChange === 'function') {
          onFilterChange(next);
        }
        return next;
      });
    }
  };

  const handleTypeChange = (type) => {
    updateFilters((prev) => {
      const currentTypes = prev?.types || [];
      const newTypes = currentTypes.includes(type)
        ? currentTypes.filter((t) => t !== type)
        : [...currentTypes, type];
      return { ...prev, types: newTypes };
    });
  };

  const handleSurfaceChange = (surface) => {
    updateFilters((prev) => {
      const currentSurfaces = prev?.surfaces || [];
      const newSurfaces = currentSurfaces.includes(surface)
        ? currentSurfaces.filter((s) => s !== surface)
        : [...currentSurfaces, surface];
      return { ...prev, surfaces: newSurfaces };
    });
  };

  const handleEquipementChange = (eq) => {
    updateFilters((prev) => {
      const currentEqs = prev?.equipements || [];
      const newEqs = currentEqs.includes(eq)
        ? currentEqs.filter((item) => item !== eq)
        : [...currentEqs, eq];
      return { ...prev, equipements: newEqs };
    });
  };

  const handleResetFilters = () => {
    const defaultState = {
      localisation: 'Tous les quartiers',
      date: 'Dim. 24 Novembre',
      types: [],
      surfaces: [],
      maxPrix: 35000,
      equipements: []
    };
    if (onReset) onReset();
    updateFilters(defaultState);
  };

  return (
    <div className="bg-white rounded-[8px] p-6 border border-gray-200 space-y-6 text-left">
      
      {/* En-tête Filtres */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h3 className="text-lg font-extrabold text-gray-900">Filtres</h3>
        <button
          onClick={handleResetFilters}
          className="text-xs font-bold text-[#D4AF37] hover:text-[#b08d25] transition-colors cursor-pointer flex items-center gap-1"
        >
          <RotateCcw size={12} />
          <span>Effacer</span>
        </button>
      </div>

      {/* 1. Localisation */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
          Localisation
        </label>
        <select
          value={activeFilters?.localisation || activeFilters?.quartier || 'Tous les quartiers'}
          onChange={(e) => updateFilters((prev) => ({ ...prev, localisation: e.target.value, quartier: e.target.value }))}
          className="w-full bg-gray-50 border border-gray-200 rounded-[4px] px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#004030] cursor-pointer"
        >
          <option value="Tous les quartiers">Tous les quartiers</option>
          <option value="Almadies">Almadies</option>
          <option value="Fann">Fann</option>
          <option value="Mermoz">Mermoz</option>
          <option value="Ngor">Ngor</option>
          <option value="Yoff">Yoff</option>
          <option value="Zone B">Zone B</option>
          <option value="Guédiawaye">Guédiawaye</option>
        </select>
      </div>

      {/* 2. Date */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
          Date
        </label>

        <div className="relative">
          <input
            type="date"
            value={activeFilters?.date || ''}
            onChange={(e) =>
              updateFilters((prev) => ({
                ...prev,
                date: e.target.value,
              }))
            }
            className="w-full bg-gray-50 border border-gray-200 rounded-[4px] pl-3.5 pr-9 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#004030]"
          />
        </div>
      </div>

      {/* 3. Type de terrain */}
      <div className="space-y-2.5 pt-2 border-t border-gray-100">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
          Type de terrain
        </label>
        <div className="space-y-2 text-xs font-semibold text-gray-700">
          {[
            { id: '5v5', label: '5 contre 5' },
            { id: '6v6', label: '6 contre 6' },
            { id: '7v7', label: '7 contre 7' }
          ].map((item) => (
            <label key={item.id} className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={(activeFilters?.types || []).includes(item.id)}
                onChange={() => handleTypeChange(item.id)}
                className="w-4 h-4 rounded text-[#004030] focus:ring-[#004030] border-gray-300 accent-[#004030]"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. Surface */}
      <div className="space-y-2.5 pt-2 border-t border-gray-100">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
          Surface
        </label>
        <div className="space-y-2 text-xs font-semibold text-gray-700">
          {['Synthétique', 'Gazon Naturel', 'Sable'].map((surf) => (
            <label key={surf} className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={(activeFilters?.surfaces || []).includes(surf)}
                onChange={() => handleSurfaceChange(surf)}
                className="w-4 h-4 rounded text-[#004030] focus:ring-[#004030] border-gray-300 accent-[#004030]"
              />
              <span>{surf}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 5. Tarif Max (FCFA / H) */}
      <div className="space-y-3 pt-2 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
            Tarif Max (FCFA / H)
          </label>
        </div>
        
        {/* Curseur de prix */}
        <input
          type="range"
          min="5000"
          max="50000"
          step="1000"
          value={activeFilters?.maxPrix || activeFilters?.prixMax || 35000}
          onChange={(e) => updateFilters((prev) => ({ ...prev, maxPrix: Number(e.target.value), prixMax: Number(e.target.value) }))}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#004030]"
        />

        <div className="flex justify-between text-xs font-bold text-gray-600">
          <span>5 000</span>
          <span className="text-[#004030] font-black">{(activeFilters?.maxPrix || activeFilters?.prixMax || 35000).toLocaleString()}</span>
          <span>50 000</span>
        </div>
      </div>

      {/* 6. Équipements */}
      <div className="space-y-2.5 pt-2 border-t border-gray-100">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
          Équipements
        </label>
        <div className="space-y-2 text-xs font-semibold text-gray-700">
          {['Vestiaires', 'Éclairage nocturne', 'Parking sécurisé'].map((eq) => (
            <label key={eq} className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={(activeFilters?.equipements || []).includes(eq)}
                onChange={() => handleEquipementChange(eq)}
                className="w-4 h-4 rounded text-[#004030] focus:ring-[#004030] border-gray-300 accent-[#004030]"
              />
              <span>{eq}</span>
            </label>
          ))}
        </div>
      </div>

    </div>
  );
}
