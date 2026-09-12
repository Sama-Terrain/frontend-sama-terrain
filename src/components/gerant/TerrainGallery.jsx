import React from 'react';

/**
 * Composant TerrainGallery
 * Grande photo principale + grille de 4 miniatures (la dernière affichant
 * "+N photos" en overlay s'il reste des photos supplémentaires).
 */
export default function TerrainGallery({ photos = [] }) {
  if (photos.length === 0) return null;

  const [main, ...rest] = photos;
  const thumbnails = rest.slice(0, 4);
  const remaining = rest.length - thumbnails.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-3 h-[260px] sm:h-[420px]">
      {/* PHOTO PRINCIPALE */}
      <div className="rounded-[12px] overflow-hidden bg-gray-100">
        <img src={main} alt="Photo principale du terrain" className="w-full h-full object-cover" />
      </div>

      {/* MINIATURES */}
      <div className="grid grid-cols-2 gap-3">
        {thumbnails.map((photo, index) => {
          const isLast = index === thumbnails.length - 1 && remaining > 0;
          return (
            <div key={index} className="relative rounded-[12px] overflow-hidden bg-gray-100">
              <img src={photo} alt={`Photo du terrain ${index + 2}`} className="w-full h-full object-cover" />
              {isLast && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">+{remaining} photos</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
