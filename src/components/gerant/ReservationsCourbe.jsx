import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

/**
 * Composant ReservationsCourbe
 * Courbe du nombre de réservations payées reçues chaque jour sur les 30
 * derniers jours. Affichée à côté de la courbe des revenus (même période) :
 * l'une montre l'argent, l'autre le volume d'activité. Ligne dorée avec des
 * points, pour bien la distinguer de l'aire verte des revenus.
 */
export default function ReservationsCourbe({ data }) {
  const chartData = data?.data || [];
  const total = data?.total ?? 0;

  return (
    <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-2xs text-left space-y-5 h-full">

      {/* EN-TÊTE */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base sm:text-lg font-black text-vert-principal">
          Réservations des 30 derniers jours
        </h3>
        <span className="text-xs sm:text-sm font-bold text-dore whitespace-nowrap">
          Total : {total}
        </span>
      </div>

      {/* CONTENEUR GRAPHIQUE */}
      <div className="bg-[#F3F6F4] rounded-2xl p-4 h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#E2E8E5" />
            <XAxis
              dataKey="jour"
              axisLine={false}
              tickLine={false}
              interval={6}
              tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 600 }}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 600 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
              formatter={(val) => [`${val} réservation${val > 1 ? 's' : ''}`, 'Reçues']}
              labelFormatter={(label) => label}
            />
            <Line
              type="monotone"
              dataKey="nombre"
              stroke="#D4AF37"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#D4AF37', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#004030', stroke: '#ffffff', strokeWidth: 2 }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
