import { CheckCircle2, Wallet, FileDown } from 'lucide-react';
import Button from '../../ui/Button';

function LigneRecu({ label, value, valueNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      {valueNode || <span className="font-bold text-gray-900">{value}</span>}
    </div>
  );
}

/**
 * Écran affiché juste après le paiement réussi de l'abonnement : confirme
 * l'activation et récapitule le reçu avant de renvoyer vers le tableau de bord.
 */
export default function AbonnementActiveCard({ abonnement, onAccederDashboard }) {
  return (
    <div className="max-w-md w-full bg-white rounded-[12px] border border-gray-200/80 shadow-2xs p-8 space-y-6 text-center">

      <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
        <CheckCircle2 size={30} />
      </div>

      <div className="space-y-2">
        <h1 className="text-lg font-black text-gray-900">Abonnement activé !</h1>
        <p className="text-sm text-gray-500">
          Votre compte est maintenant actif. Bienvenue sur Sama-Terrain.
        </p>
      </div>

      <div className="border-t border-gray-100" />

      <div className="bg-vert-clair/40 rounded-[10px] p-5 space-y-3 text-left">
        <LigneRecu label="Date d'activation :" value={abonnement.dateActivation} />
        <LigneRecu label="Valable jusqu'au :" value={abonnement.dateFin} />
        <LigneRecu label="Montant payé :" value={`${abonnement.montant.toLocaleString('fr-FR')} FCFA`} />
        <LigneRecu
          label="Moyen de paiement :"
          valueNode={
            <span className="inline-flex items-center gap-1.5 font-bold text-gray-900">
              {abonnement.moyenPaiement}
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                <Wallet size={11} />
              </span>
            </span>
          }
        />
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="primary"
          size="md"
          rounded="8px"
          fullWidth
          onClick={onAccederDashboard}
        >
          Accéder à mon tableau de bord
        </Button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-vert-principal hover:underline cursor-pointer"
        >
          <FileDown size={14} />
          <span>Télécharger le reçu</span>
        </button>
      </div>

    </div>
  );
}
