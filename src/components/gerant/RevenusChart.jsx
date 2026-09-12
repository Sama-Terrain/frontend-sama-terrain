import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

/**
 * Composant RevenusChart
 * Graphique en aire des revenus sur 30 jours (Recharts), dans le même esprit
 * visuel que CroissanceChart (carte blanche + zone graphique teintée).
 */
export default function RevenusChart({ data, total }) {
  const chartData = data?.data || [];

  const formatFcfa = (value) => `${Math.round(value / 1000)}` + ',000 F';

  return (
    <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-2xs text-left space-y-5">

      {/* EN-TÊTE */}
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-black text-vert-principal">
          Revenus des 30 derniers jours
        </h3>
        <span className="text-xs sm:text-sm font-bold text-dore">
          Total : {total || data?.total}
        </span>
      </div>

      {/* CONTENEUR GRAPHIQUE */}
      <div className="bg-[#F3F6F4] rounded-2xl p-4 h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenusGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#004030" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#004030" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#E2E8E5" />
            <XAxis
              dataKey="jour"
              axisLine={false}
              tickLine={false}
              interval={4}
              tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={formatFcfa}
              tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 600 }}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
              formatter={(val) => [`${val.toLocaleString('fr-FR')} FCFA`, 'Revenus']}
              labelFormatter={(label) => label}
            />
            <Area
              type="monotone"
              dataKey="montant"
              stroke="#004030"
              strokeWidth={2.5}
              fill="url(#revenusGradient)"
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
