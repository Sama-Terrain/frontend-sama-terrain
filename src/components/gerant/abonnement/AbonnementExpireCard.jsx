import React from 'react';
import { AlertTriangle, Lock } from 'lucide-react';
import Button from '../../ui/Button';
import AvantagesAbonnement from './AvantagesAbonnement';
import { PRIX_ABONNEMENT_MENSUEL } from '../../../mocks/abonnements';

/**
 * Écran affiché quand l'essai (ou l'abonnement) est terminé : bloque l'accès
 * au tableau de bord tant que le gérant n'a pas renouvelé son abonnement.
 */
export default function AbonnementExpireCard({ dateSuspension, chargement, onPayer }) {
  return (
    <div className="max-w-md w-full bg-white rounded-[12px] border border-gray-200/80 shadow-2xs p-8 space-y-6 text-center">

      <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
        <AlertTriangle size={24} />
      </div>

      <div className="space-y-2">
        <h1 className="text-lg font-black text-gray-900">Votre abonnement a expiré</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Renouvelez votre abonnement pour continuer à gérer vos terrains et recevoir des réservations.
        </p>
        {dateSuspension && (
          <p className="text-xs font-bold text-amber-600">
            Votre accès a été suspendu le {dateSuspension}
          </p>
        )}
      </div>

      <div className="border-t border-gray-100 pt-5 text-left space-y-5">
        <p className="text-2xl font-black text-vert-principal text-center">
          {PRIX_ABONNEMENT_MENSUEL.toLocaleString('fr-FR')} FCFA
          <span className="text-sm font-bold text-gray-500"> / mois</span>
        </p>
        <AvantagesAbonnement />
      </div>

      <div className="space-y-3 pt-2 border-t border-gray-100">
        <Button
          type="button"
          variant="primary"
          size="md"
          rounded="8px"
          fullWidth
          disabled={chargement}
          onClick={onPayer}
        >
          {chargement ? 'Paiement en cours...' : 'Renouveler mon abonnement'}
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
          <Lock size={12} />
          <span>Paiement sécurisé via PayDunya</span>
        </p>
        <button
          type="button"
          className="text-xs font-bold text-vert-principal hover:underline cursor-pointer"
        >
          Contacter le support
        </button>
      </div>

    </div>
  );
}
