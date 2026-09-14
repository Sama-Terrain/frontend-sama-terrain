import React from 'react';
import { Star } from 'lucide-react';

// Props du composant :
// - rating : note sur 5 (peut être décimale, arrondie à l'entier le plus proche pour l'affichage)
// - size : taille des icônes étoile (px)
export default function RatingStars({ rating = 0, size = 14 }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-[3px]">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rounded ? 'fill-dore text-dore' : 'text-gray-300'}
        />
      ))}
    </div>
  );
}
