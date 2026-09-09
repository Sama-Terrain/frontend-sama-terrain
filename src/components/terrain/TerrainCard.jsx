import { MapPin, Star } from 'lucide-react';

export default function TerrainCard({ terrain, onSelect }) {
  if (!terrain) return null;

  const {
    id,
    nom,
    localisation,
    type = '5v5',
    note = 4.8,
    disponible = true,
    image
  } = terrain;

  return (
    <div className="bg-white rounded-[8px] overflow-hidden border border-gray-200 flex flex-col group">
      
      {/* Image du terrain à la une */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={nom}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Contenu de la carte (conforme exactement au Figma) */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Badges : Type (gauche) et Disponibilité (droite) sous l'image */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 bg-[#e6f4ea] text-[#004030] font-bold text-xs rounded-full">
            {type}
          </span>
          <span className="px-3 py-1 bg-[#e6f4ea] text-[#004030] font-medium text-xs rounded-full">
            {disponible ? 'Disponible' : 'Indisponible'}
          </span>
        </div>

        {/* Nom du terrain */}
        <h3 className="text-base font-extrabold text-gray-900 group-hover:text-[#004030] transition-colors">
          {nom}
        </h3>

        {/* Localisation & Note Étoiles */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <MapPin size={14} className="text-gray-400 shrink-0" />
            <span>{localisation}</span>
          </div>

          <div className="flex items-center space-x-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(note) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
              />
            ))}
          </div>
        </div>

        {/* Bouton "Voir détails" pleine largeur en vert clair */}
        <button
          onClick={() => onSelect && onSelect(terrain)}
          className="w-full py-2.5 px-4 bg-[#e6f4ea] hover:bg-[#004030] text-[#004030] hover:text-white font-bold text-xs rounded-[8px] transition-colors duration-200 cursor-pointer text-center"
        >
          Voir détails
        </button>

      </div>

    </div>
  );
}
