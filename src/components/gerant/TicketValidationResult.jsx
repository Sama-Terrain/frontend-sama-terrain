import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

function InfoRow({ label, value, valueClassName = 'text-gray-900' }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`font-extrabold ${valueClassName}`}>{value}</span>
    </div>
  );
}

/**
 * Composant TicketValidationResult
 * Affiche le résultat de la dernière vérification de ticket : succès (avec le
 * détail de la réservation et le solde restant) ou échec (code introuvable).
 */
export default function TicketValidationResult({ result }) {
  if (!result) {
    return (
      <div className="bg-white rounded-[12px] border border-gray-200/80 shadow-2xs p-6 text-center">
        <p className="text-sm text-gray-500 font-semibold">
          Scannez un ticket ou saisissez un code pour voir le résultat de la validation
        </p>
      </div>
    );
  }

  if (result.status === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-[12px] p-6 space-y-2">
        <div className="flex items-center gap-2.5">
          <XCircle size={20} className="text-red-500 shrink-0" />
          <h3 className="text-base font-black text-red-700">Ticket introuvable</h3>
        </div>
        <p className="text-sm text-red-600">
          Le code « {result.code} » ne correspond à aucune réservation valide.
        </p>
      </div>
    );
  }

  const { ticket, montantSaisi } = result;

  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-[12px] p-6 space-y-4">
      <div className="flex items-center gap-2.5">
        <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
        <h3 className="text-base font-black text-emerald-700">Ticket Validé avec Succès !</h3>
      </div>

      <div className="space-y-2.5">
        <InfoRow label="Client" value={ticket.client} />
        <InfoRow label="Terrain" value={ticket.terrain} />
        <InfoRow label="Créneau" value={ticket.creneau} />
        <InfoRow
          label="Montant Restant"
          value={`${montantSaisi.toLocaleString('fr-FR')} FCFA (À payer)`}
          valueClassName="text-red-600"
        />
      </div>
    </div>
  );
}
