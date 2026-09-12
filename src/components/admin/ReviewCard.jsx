import React from 'react';
import { Star } from 'lucide-react';

/**
 * Composant RatingStars
 * Affiche les étoiles de notation
 */
function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-[4px]">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          className="flex h-[14px] w-[14px] items-center justify-center"
        >
          <Star
            size={14}
            className={star <= rating ? "fill-dore text-dore" : "text-gray-300"}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Composant ReviewCard
 * Affiche une carte d'avis pour la modération
 * 
 * @param {Object} review - Les données de l'avis
 * @param {Function} onApprove - Callback pour approuver l'avis
 * @param {Function} onDelete - Callback pour supprimer l'avis
 */
export default function ReviewCard({ review, onApprove, onDelete }) {
  return (
    <div className="w-full rounded-[12px] border border-[#e5e7eb] bg-white p-[24px]">
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-[12px]">
          {/* Avatar */}
          <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-vert-principal">
            <span className="text-[13px] font-bold text-dore">
              {review.initial}
            </span>
          </div>

          {/* User information */}
          <div className="flex flex-col gap-[2px]">
            <p className="text-[14px] font-bold leading-normal text-[#111827]">
              {review.name}
            </p>
            <p className="text-[12px] font-normal leading-normal text-[#4b5563]">
              Sur : {review.terrain}
            </p>
          </div>
        </div>

        {/* Rating */}
        <RatingStars rating={review.rating} />
      </div>

      {/* Review */}
      <div className="mt-[16px] w-full rounded-[8px] bg-[#fbfbf9] p-[16px]">
        <p className="w-full text-[14px] font-normal leading-normal text-[#111827]">
          "{review.comment}"
        </p>
      </div>

      {/* Footer */}
      <div className="mt-[16px] flex w-full items-center">
        <div className="flex flex-wrap items-center gap-[12px]">
          {/* Date */}
          <p className="text-[12px] font-normal leading-normal text-[#9ca3af]">
            {review.date}
          </p>

          {/* Approve */}
          <button
            type="button"
            onClick={() => onApprove(review)}
            className="rounded-[6px] bg-[#def7ec] px-[14px] py-[8px] text-[12px] font-bold text-[#10b981] transition-opacity hover:opacity-80"
          >
            Approuvé l'avis
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => onDelete(review)}
            className="rounded-[6px] bg-[#fee2e2] px-[14px] py-[8px] text-[12px] font-bold text-[#ef4444] transition-opacity hover:opacity-80"
          >
            Supprimer l'avis
          </button>
        </div>
      </div>
    </div>
  );
}
