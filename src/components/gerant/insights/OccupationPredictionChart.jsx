import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, LabelList } from 'recharts';

/**
 * Composant OccupationPredictionChart
 * Taux de réservation réel des créneaux des 7 prochains jours, tous
 * terrains du gérant confondus (créneaux déjà confirmés / total).
 */
export default function OccupationPredictionChart({ data = [] }) {
  return (
    <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-2xs space-y-5">
      <h3 className="text-base font-black text-gray-900">
        Occupation prévue des créneaux (7 prochains jours)
      </h3>

      <div className="h-56 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 24, right: 10, left: 10, bottom: 0 }} barCategoryGap="35%">
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 600 }}
            />
            <Bar dataKey="taux" fill="#0B4D3B" radius={[4, 4, 0, 0]} animationDuration={800}>
              <LabelList
                dataKey="taux"
                position="top"
                formatter={(v) => `${v}%`}
                style={{ fill: '#111827', fontSize: 12, fontWeight: 800 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
