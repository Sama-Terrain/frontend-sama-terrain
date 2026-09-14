import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, LabelList } from 'recharts';

/**
 * Composant ReservationsParJourChart
 * Répartition des réservations par jour de la semaine (barres dorées avec
 * la valeur affichée au-dessus de chaque barre).
 */
export default function ReservationsParJourChart({ data = [] }) {
  return (
    <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-2xs space-y-5">
      <h3 className="text-base font-black text-gray-900">Réservations par jour de la semaine</h3>

      <div className="h-56 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 24, right: 10, left: 10, bottom: 0 }} barCategoryGap="35%">
            <XAxis
              dataKey="jour"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 600 }}
            />
            <Bar dataKey="valeur" fill="#D4AF37" radius={[4, 4, 0, 0]} animationDuration={800}>
              <LabelList
                dataKey="valeur"
                position="top"
                style={{ fill: '#111827', fontSize: 12, fontWeight: 800 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
