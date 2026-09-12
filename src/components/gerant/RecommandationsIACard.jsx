import React from 'react';
import { Sparkles, Lightbulb } from 'lucide-react';

/**
 * Composant RecommandationsIACard
 * Bloc de recommandations générées à partir de l'analyse de la demande
 * (données mock pour l'instant, cf. mockRecommandationsIA).
 */
export default function RecommandationsIACard({ recommandations = [] }) {
  return (
    <div className="bg-vert-clair/40 border border-emerald-200 rounded-[12px] p-6 sm:p-8 space-y-4">
      <div className="flex items-center gap-2.5">
        <Sparkles size={18} className="text-vert-principal shrink-0" />
        <h3 className="text-base font-black text-vert-principal">
          Recommandations IA — Analyse de la demande
        </h3>
      </div>

      <ul className="space-y-3">
        {recommandations.map((recommandation, index) => (
          <li key={index} className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed">
            <Lightbulb size={16} className="text-vert-principal shrink-0 mt-0.5" />
            <span>{recommandation}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
