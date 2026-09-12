import React from 'react';
import '../../styles/admin/TerrainTable.css';

/**
 * Composant TerrainTable
 * Affiche le tableau des terrains les plus réservés
 * 
 * @param {Array} terrains - La liste des terrains avec leurs données
 */
export default function TerrainTable({ terrains }) {
  return (
    <div className="terrain-card">
      <h2>Top 5 des Terrains les Plus Réservés</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Rang</th>
              <th>Terrain</th>
              <th>Ville</th>
              <th>Réservations</th>
              <th>Chiffre d'Affaires</th>
            </tr>
          </thead>
          <tbody>
            {terrains.map((terrain) => (
              <tr key={terrain.rank}>
                <td className="rank">#{terrain.rank}</td>
                <td className="terrain-name">{terrain.terrain}</td>
                <td className="city-name">{terrain.ville}</td>
                <td className="reservations">{terrain.reservations}</td>
                <td className="revenue">{terrain.chiffre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
