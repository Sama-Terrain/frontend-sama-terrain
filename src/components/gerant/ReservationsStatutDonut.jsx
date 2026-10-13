import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

/**
 * Composant ReservationsStatutDonut
 * Diagramme circulaire (donut) des réservations du mois par statut
 * (confirmées, terminées, en attente, annulées), avec le total au centre.
 * Affiché à côté de la courbe des revenus sur le tableau de bord.
 */
export default function ReservationsStatutDonut({ data }) {
  const segments = data?.data || [];
  const total = data?.total ?? 0;

  return (
    <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-2xs text-left space-y-5 h-full">

      {/* EN-TÊTE */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base sm:text-lg font-black text-vert-principal">
          Réservations du mois
        </h3>
        {data?.periodeLabel && (
          <span className="text-xs sm:text-sm font-bold text-dore whitespace-nowrap first-letter:uppercase">
            {data.periodeLabel}
          </span>
        )}
      </div>

      {/* DONUT + LÉGENDE */}
      <div className="bg-[#F3F6F4] rounded-2xl p-4 h-64 sm:h-72 w-full flex flex-col">
        {total === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <p className="text-xs font-semibold text-gray-500 max-w-[200px]">
              Aucune réservation ce mois-ci pour le moment.
            </p>
          </div>
        ) : (
          <>
            <div className="relative flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segments}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="62%"
                    outerRadius="92%"
                    paddingAngle={segments.length > 1 ? 2 : 0}
                    stroke="none"
                    animationDuration={800}
                  >
                    {segments.map((segment) => (
                      <Cell key={segment.statut} fill={segment.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                    formatter={(value, name) => [`${value} (${Math.round((value / total) * 100)}%)`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* TOTAL AU CENTRE DU DONUT */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-gray-900 leading-none">{total}</span>
                <span className="text-[11px] font-semibold text-gray-500 mt-1">réservation{total > 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-3">
              {segments.map((segment) => (
                <div key={segment.statut} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ backgroundColor: segment.color }} />
                  <span className="font-semibold text-gray-700 truncate">{segment.name}</span>
                  <span className="font-black text-gray-900 ml-auto">{segment.value}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
