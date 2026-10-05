import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Gabarit commun aux pages légales (CGU, confidentialité, support).
 *
 * - En-tête vert avec titre, sous-titre et date de mise à jour.
 * - Sommaire cliquable (colonne de gauche sur desktop) généré à partir
 *   de la liste des sections.
 * - Chaque section reçoit un id pour pouvoir y accéder directement via
 *   une ancre (ex : /support#contact depuis le footer).
 */
export default function PageLegale({ icone: Icone, titre, sousTitre, miseAJour, sections, children }) {
  const { hash } = useLocation();

  // Le site n'a pas de restauration de scroll globale : quand on arrive
  // depuis le footer, on serait resté tout en bas de la page. On remonte
  // donc en haut, ou directement à la section visée par l'ancre.
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="bg-gray-50">
      {/* En-tête */}
      <section className="bg-vert-principal text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Link>
          <div className="flex items-start gap-4">
            {Icone && (
              <span className="hidden sm:flex w-12 h-12 rounded-full bg-dore/15 text-dore items-center justify-center shrink-0">
                <Icone size={24} />
              </span>
            )}
            <div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{titre}</h1>
              {sousTitre && <p className="mt-3 text-gray-300 max-w-2xl leading-relaxed">{sousTitre}</p>}
              {miseAJour && (
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-dore">
                  Dernière mise à jour : {miseAJour}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
        {/* Sommaire */}
        {sections?.length > 0 && (
          <nav className="hidden lg:block" aria-label="Sommaire">
            <div className="sticky top-24">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Sommaire</p>
              <ul className="space-y-2 text-sm border-l border-gray-200">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block pl-4 -ml-px border-l-2 border-transparent text-gray-600 hover:text-vert-principal hover:border-vert-principal transition-colors"
                    >
                      {section.titre}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}

        <div className="space-y-6 min-w-0">
          {children}
          {sections?.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="bg-white rounded-[8px] border border-gray-200 shadow-2xs p-5 sm:p-8 scroll-mt-24"
            >
              <h2 className="flex items-baseline gap-3 text-lg sm:text-xl font-bold text-gray-900 mb-4">
                <span className="text-dore font-black">{String(index + 1).padStart(2, '0')}</span>
                {section.titre}
              </h2>
              <div className="space-y-3 text-sm sm:text-[15px] text-gray-600 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:text-gray-900">
                {section.contenu}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
