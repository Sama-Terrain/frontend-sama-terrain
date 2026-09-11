import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Cell,
} from 'recharts';

/**
 * Composant ReservationsVilleChart
 * Graphique en barres représentant la répartition des réservations par ville.
 */
export default function ReservationsVilleChart({ data }) {
  const citiesData = data || [
    { ville: 'Dakar (6.2k)', rawValue: 6200, hexColor: '#004030' },
    { ville: 'Thiès (3.1k)', rawValue: 3100, hexColor: '#D4AF37' },
    { ville: 'Mbour (2.1k)', rawValue: 2100, hexColor: '#A7F3D0' },
    { ville: 'Saint-Louis (0.9k)', rawValue: 900, hexColor: '#CBD5E1' },
  ];

  return (
    <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-2xs text-left space-y-5 flex flex-col justify-between">
      
      {/* TITRE DU GRAPHIQUE */}
      <h3 className="text-base sm:text-lg font-black text-vert-principal">
        Réservations par Ville
      </h3>

      {/* CONTENEUR GRAPHIQUE RECHARTS */}
      <div className="bg-[#F3F6F4] rounded-2xl p-4 h-52 sm:h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={citiesData} margin={{ top: 20, right: 15, left: 15, bottom: 0 }}>
            <XAxis
              dataKey="ville"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#374151', fontSize: 11, fontWeight: 700 }}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
              formatter={(val) => [`${val.toLocaleString()} réservations`, 'Réservations']}
              labelStyle={{ color: '#D4AF37', fontWeight: 'bold' }}
            />
            <Bar dataKey="rawValue" radius={[8, 8, 0, 0]} animationDuration={1000}>
              {citiesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.hexColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
