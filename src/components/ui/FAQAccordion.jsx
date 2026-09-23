import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

/**
 * Composant FAQAccordion
 * Liste de questions numérotées, une seule ouverte à la fois. Reprend les
 * mêmes conventions visuelles que le reste du site (cartes blanches
 * bordées, accent vert/doré) plutôt qu'un style générique.
 */
export default function FAQAccordion({ items }) {
  const [ouvertIndex, setOuvertIndex] = useState(0);

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {items.map((item, index) => {
        const estOuvert = ouvertIndex === index;
        return (
          <div
            key={item.question}
            className={`bg-white rounded-[8px] border shadow-2xs transition-colors ${
              estOuvert ? 'border-vert-principal' : 'border-gray-200'
            }`}
          >
            <button
              type="button"
              onClick={() => setOuvertIndex(estOuvert ? -1 : index)}
              aria-expanded={estOuvert}
              className="w-full flex items-center gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left cursor-pointer"
            >
              <span className="text-2xl sm:text-3xl font-black text-gray-200 shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex-1 text-sm sm:text-base font-bold text-gray-900">
                {item.question}
              </span>
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  estOuvert ? 'bg-vert-principal text-white' : 'bg-vert-clair text-vert-principal'
                }`}
              >
                {estOuvert ? <Minus size={15} /> : <Plus size={15} />}
              </span>
            </button>

            {estOuvert && (
              <div className="px-5 sm:px-6 pb-5 pl-[3.75rem] sm:pl-[4.25rem]">
                <p className="text-sm text-gray-600 leading-relaxed">{item.reponse}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
