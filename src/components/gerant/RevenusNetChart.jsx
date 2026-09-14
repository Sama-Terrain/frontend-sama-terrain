import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

/**
 * Composant RevenusNetChart
 * Graphique en barres minimaliste de l'évolution quotidienne des revenus nets
 * (pas de grille ni d'axe des valeurs, dans l'esprit épuré de la maquette).
 */
export default function RevenusNetChart({ data, ville }) {
  const chartData = data?.data || [];

  return (
    <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-2xs text-left space-y-5">
      <h3 className="text-base sm:text-lg font-black text-gray-900">
        Évolution quotidienne des revenus net{ville ? ` (${ville})` : ''}
      </h3>

      <div className="h-56 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barCategoryGap="45%">
            <XAxis
              dataKey="jour"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 600 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0, 64, 48, 0.05)' }}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
              formatter={(val) => [`${val.toLocaleString('fr-FR')} FCFA`, 'Revenus nets']}
            />
            <Bar dataKey="montant" fill="#004030" radius={[4, 4, 4, 4]} animationDuration={800} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
