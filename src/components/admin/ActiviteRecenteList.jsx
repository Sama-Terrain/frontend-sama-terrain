import React from 'react';

/**
 * Composant ActiviteRecenteList
 * Affiche la liste du flux d'activités récents du système avec badges colorés.
 */
export default function ActiviteRecenteList({ items }) {
  const defaultItems = [
    {
      id: 1,
      time: 'Il y a 5 min',
      description: "Nouveau terrain 'Saly Foot Arena' créé par le gérant Ibrahima Fall",
      category: 'Terrain',
      badgeClass: 'bg-vert-clair text-vert-principal',
    },
    {
      id: 2,
      time: 'Il y a 15 min',
      description: "Avis signalé sur le terrain 'Dakar Soccer' par l'utilisateur Omar Sy",
      category: 'Modération',
      badgeClass: 'bg-red-100 text-red-700',
    },
    {
      id: 3,
      time: 'Il y a 1 heure',
      description: 'Demande de validation soumise par le gérant Amadou Diouf (Elite Arena)',
      category: 'Gérant',
      badgeClass: 'bg-amber-100 text-amber-800',
    },
    {
      id: 4,
      time: 'Il y a 3 heures',
      description: 'Nouveau joueur inscrit : Fatoumata Sarr (Saint-Louis)',
      category: 'Inscription',
      badgeClass: 'bg-sky-100 text-sky-700',
    },
    {
      id: 5,
      time: 'Il y a 5 heures',
      description: 'Réservation confirmée pour RES-1092 - Montant : 30 000 FCFA',
      category: 'Paiement',
      badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
    },
  ];

  const list = items || defaultItems;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs text-left space-y-6">
      
      {/* TITRE DE LA SECTION */}
      <h2 className="text-lg sm:text-xl font-black text-vert-principal tracking-tight">
        Activité Récente du Système
      </h2>

      {/* LISTE DES ACTIVITÉS */}
      <div className="divide-y divide-gray-100">
        {list.map((item) => (
          <div
            key={item.id}
            className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm hover:bg-gray-50/60 px-2 rounded-xl transition-colors"
          >
            {/* TEMPS & DESCRIPTION */}
            <div className="flex items-start sm:items-center space-x-4 sm:space-x-8">
              <span className="text-gray-400 font-medium w-24 shrink-0">
                {item.time}
              </span>
              <span className="font-regular text-gray-700 leading-relaxed">
                {item.description}
              </span>
            </div>

            {/* BADGE CATEGORIE */}
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 self-start sm:self-auto shadow-2xs ${item.badgeClass}`}
            >
              {item.category}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
