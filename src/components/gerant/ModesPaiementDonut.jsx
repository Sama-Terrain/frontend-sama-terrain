import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

/**
 * Composant ModesPaiementDonut
 * Répartition des modes de paiement utilisés par les clients (donut + légende).
 */
export default function ModesPaiementDonut({ data = [] }) {
  return (
    <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-2xs space-y-5">
      <h3 className="text-base font-black text-gray-900">Modes de paiement (%)</h3>

      <div className="flex items-center gap-6">
        <div className="w-32 h-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={60}
                paddingAngle={1}
                stroke="none"
                isAnimationActive={false}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}%`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2.5">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="font-semibold text-gray-700">{entry.name}</span>
              <span className="font-black text-gray-900">{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
