import React from 'react';
import { Check } from 'lucide-react';

// Liste des avantages inclus dans l'abonnement, réutilisée sur les écrans
// "activation" et "expiré" pour ne pas dupliquer la liste à deux endroits.
const AVANTAGES = [
  'Tableau de bord centralisé',
  'Gestion des créneaux et des tarifs',
  'Suivi des revenus et statistiques',
  'Prédictions de demande par IA',
];

export default function AvantagesAbonnement() {
  return (
    <ul className="space-y-3">
      {AVANTAGES.map((avantage) => (
        <li key={avantage} className="flex items-center gap-2.5 text-sm text-gray-700">
          <Check size={16} className="text-emerald-600 shrink-0" strokeWidth={3} />
          <span>{avantage}</span>
        </li>
      ))}
    </ul>
  );
}
