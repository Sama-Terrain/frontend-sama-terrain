import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import '../../styles/admin/ChartsGrid.css';

const PAYMENT_COLORS = {
  Wave: "var(--color-vert-principal, #004030)",
  OrangeMoney: "var(--color-dore, #D4AF37)",
  Free: "#DEF7EC",
};

const CITY_COLORS = [
  "var(--color-vert-principal, #004030)",
  "var(--color-dore, #D4AF37)",
  "#DEF7EC",
];

function LegendItem({ color, label }) {
  return (
    <div className="legend-item">
      <span
        className="legend-square"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </div>
  );
}

function PaymentChart({ paymentData }) {
  const data = paymentData[0] || {};
  
  const paymentMethods = [
    {
      name: "Wave",
      label: `Wave (${data.Wave}%)`,
      percentage: data.Wave,
      color: PAYMENT_COLORS.Wave,
      textColor: "#FFFFFF",
    },
    {
      name: "Orange Money",
      label: `Orange Money (${data.OrangeMoney}%)`,
      percentage: data.OrangeMoney,
      color: PAYMENT_COLORS.OrangeMoney,
      textColor: "#004030",
    },
    {
      name: "Free Money",
      label: `Free (${data.Free}%)`,
      percentage: data.Free,
      color: PAYMENT_COLORS.Free,
      textColor: "#004030",
    },
  ];

  return (
    <div className="chart-card">
      <h2 className="chart-title">Méthodes de Paiement Utilisées</h2>
      <div className="payment-chart-wrapper">
        <div className="payment-chart">
          <ResponsiveContainer width="100%" height={24}>
            <BarChart
              data={paymentData}
              layout="vertical"
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <XAxis type="number" domain={[0, 100]} hide />
              <Bar
                dataKey="Wave"
                stackId="payment"
                fill={PAYMENT_COLORS.Wave}
                radius={[5, 0, 0, 5]}
                isAnimationActive={false}
              />
              <Bar
                dataKey="OrangeMoney"
                stackId="payment"
                fill={PAYMENT_COLORS.OrangeMoney}
                isAnimationActive={false}
              />
              <Bar
                dataKey="Free"
                stackId="payment"
                fill={PAYMENT_COLORS.Free}
                radius={[0, 5, 5, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="payment-label payment-label-wave">{paymentMethods[0].label}</div>
          <div className="payment-label payment-label-orange">{paymentMethods[1].label}</div>
          <div className="payment-label payment-label-free">{paymentMethods[2].label}</div>
        </div>
        <div className="chart-legend">
          <LegendItem color={PAYMENT_COLORS.Wave} label="Wave Senegal" />
          <LegendItem color={PAYMENT_COLORS.OrangeMoney} label="Orange Money" />
          <LegendItem color={PAYMENT_COLORS.Free} label="Free Money" />
        </div>
      </div>
    </div>
  );
}

function CityChart({ cityData }) {
  return (
    <div className="chart-card city-card">
      <h2 className="chart-title">Répartition des Joueurs par Ville</h2>
      <div className="city-chart-content">
        <div className="city-donut">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={cityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={0}
                stroke="none"
                isAnimationActive={false}
              >
                {cityData.map((entry, index) => (
                  <Cell
                    key={`city-cell-${index}`}
                    fill={entry.color || CITY_COLORS[index]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}%`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="city-list">
          {cityData.map((city) => (
            <p key={city.name}>• {city.name} : {city.value}%</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChartsGrid({ paymentData, cityData }) {
  return (
    <section className="charts-grid">
      <PaymentChart paymentData={paymentData} />
      <CityChart cityData={cityData} />
    </section>
  );
}
