import { JOURS_SEMAINE } from '../../utils/jours';

const formatPrix = (value) => `${value.toLocaleString('fr-FR')} F`;

/**
 * Composant CreneauxGrid
 * Grille des créneaux horaires avec le tarif appliqué pour chaque jour
 * de la semaine (générée automatiquement à partir des horaires du terrain).
 */
export default function CreneauxGrid({ creneaux, grille }) {
  return (
    <div className="bg-white rounded-[12px] border border-gray-200/80 shadow-2xs p-6 sm:p-8 space-y-5">
      <h3 className="text-base sm:text-lg font-black text-gray-900">
        Grille des créneaux avec prix
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="w-[130px]" />
              {JOURS_SEMAINE.map((jour) => (
                <th
                  key={jour}
                  className="bg-gray-50 rounded-[6px] py-2.5 text-xs font-bold text-gray-600"
                >
                  {jour}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {creneaux.map((creneau) => (
              <tr key={creneau.label}>
                <td className="pr-4 text-xs font-bold text-gray-900 whitespace-nowrap">
                  {creneau.label}
                </td>
                {JOURS_SEMAINE.map((jour) => (
                  <td key={jour} className="px-1">
                    <div className="rounded-[6px] bg-vert-clair text-vert-principal text-xs font-bold text-center py-2.5">
                      {formatPrix(grille[jour]?.[creneau.label] ?? 0)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
