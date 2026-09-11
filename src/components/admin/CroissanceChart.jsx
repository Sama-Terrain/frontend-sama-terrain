import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from 'recharts';

/**
 * Composant CroissanceChart
 * Graphique de croissance des inscriptions sur 30 jours utilisant la bibliothèque 'recharts'.
 */
export default function CroissanceChart({ data, totalMois = '+18% vs mois dernier' }) {
  // Données de secours si aucune donnée n'est passée
  const chartData = data?.data || [];

  return (
    <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-2xs text-left space-y-5 flex flex-col justify-between">
      
      {/* EN-TÊTE DU GRAPHIQUE */}
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-black text-vert-principal">
          Évolution des Réservations
        </h3>
        <span className="text-xs sm:text-sm font-bold text-dore  px-3 py-1 rounded-full">
          {totalMois}
        </span>
      </div>

      {/* CONTENEUR GRAPHIQUE RECHARTS */}
      <div className="bg-[#F3F6F4] rounded-2xl p-4 h-52 sm:h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <XAxis
              dataKey="period"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 600 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0, 64, 48, 0.05)' }}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
              formatter={(val) => [`${val} réservations`, 'Réservations']}
              labelStyle={{ display: 'none' }}
            />
            <Bar
              dataKey="value"
              fill="#004030"
              radius={[6, 6, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
