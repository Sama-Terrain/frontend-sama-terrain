import React from 'react';
import { Info, Pencil, Shirt, Lightbulb, Droplet, Car, Coffee, Users } from 'lucide-react';
import Button from '../ui/Button';

const EQUIPEMENT_ICONS = {
  Vestiaires: Shirt,
  'Éclairage nocturne': Lightbulb,
  Douches: Droplet,
  Parking: Car,
  Buvette: Coffee,
  Tribune: Users,
};

function InfoField({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
  );
}

/**
 * Composant TerrainInfoCard
 * Bloc "Informations générales" de la page détail d'un terrain : caractéristiques
 * principales en grille + liste des équipements.
 */
export default function TerrainInfoCard({ terrain, onModifier }) {
  if (!terrain) return null;

  return (
    <div className="bg-white rounded-[12px] border border-gray-200/80 shadow-2xs">

      <div className="flex items-center justify-between p-6 sm:p-8 pb-0">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-vert-clair text-vert-principal flex items-center justify-center shrink-0">
            <Info size={16} />
          </span>
          <h3 className="text-base font-black text-gray-900">Informations générales</h3>
        </div>
        <Button variant="outline" size="sm" rounded="8px" onClick={onModifier} className="gap-1.5">
          <Pencil size={14} />
          <span>Modifier</span>
        </Button>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-5">
          <InfoField label="Nom du terrain" value={terrain.nom} />
          <InfoField label="Ville" value={terrain.ville} />
          <InfoField label="Adresse" value={terrain.adresse} />
          <InfoField label="Type" value={terrain.type} />
          <InfoField label="Surface" value={terrain.surface} />
          <InfoField label="Capacité" value={terrain.capacite} />
          <InfoField label="Prix par heure" value={terrain.prixHeure} />
          <InfoField label="Horaires d'ouverture" value={terrain.horaires} />
        </div>

        <div className="border-t border-gray-100 pt-5 space-y-3">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Équipements</p>
          <div className="flex flex-wrap gap-2">
            {terrain.equipements.map((equipement) => {
              const Icon = EQUIPEMENT_ICONS[equipement];
              return (
                <span
                  key={equipement}
                  className="inline-flex items-center gap-1.5 rounded-full bg-vert-clair text-vert-principal px-3.5 py-1.5 text-xs font-bold"
                >
                  {Icon && <Icon size={13} />}
                  <span>{equipement}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
