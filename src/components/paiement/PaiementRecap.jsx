import { MapPin, Calendar, Clock } from 'lucide-react';

// Affiche le récapitulatif de la réservation avant paiement (terrain, date, créneau(x), montants).
// `reservation` vient du formulaire de la page détail terrain :
// { terrain, date, creneaux, avance, resteSurPlace }
export default function PaiementRecap({ reservation }) {
  const { terrain, date, creneaux, avance, resteSurPlace } = reservation;

  return (
    <div className="bg-white rounded-[8px] p-6 border border-gray-200 space-y-4">
      <h3 className="text-sm font-bold text-gray-900">Récapitulatif</h3>

      <div className="space-y-2 text-xs text-gray-700">
        <div className="flex items-center gap-2">
          <MapPin size={15} className="text-vert-principal shrink-0" />
          <span className="font-bold">{terrain?.nom}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-vert-principal shrink-0" />
          <span>{date}</span>
        </div>
        {/* Un ou plusieurs créneaux réservés ensemble (ex: 18h ET 19h) */}
        {creneaux?.map((creneau) => (
          <div key={creneau.id} className="flex items-center gap-2">
            <Clock size={15} className="text-vert-principal shrink-0" />
            <span>{creneau.heure}{creneaux.length > 1 && ` — ${creneau.prix.toLocaleString('fr-FR')} FCFA`}</span>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
        <div className="flex justify-between p-2.5 bg-vert-clair rounded-[8px] text-vert-principal font-bold">
          <span>Avance à payer maintenant</span>
          <span>{Number(avance).toLocaleString('fr-FR')} FCFA</span>
        </div>
        <div className="flex justify-between text-gray-600 px-1">
          <span>Reste à payer sur place</span>
          <span className="font-bold text-gray-900">{Number(resteSurPlace).toLocaleString('fr-FR')} FCFA</span>
        </div>
      </div>
    </div>
  );
}
