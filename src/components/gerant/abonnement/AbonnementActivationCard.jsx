import React from 'react';
import { Lock } from 'lucide-react';
import Button from '../../ui/Button';
import AvantagesAbonnement from './AvantagesAbonnement';
import { PRIX_ABONNEMENT_MENSUEL, DUREE_ESSAI_JOURS } from '../../../mocks/abonnements';

/**
 * Écran affiché pendant la période d'essai gratuite : présente l'offre et
 * permet de payer tout de suite pour activer l'abonnement sans attendre la fin de l'essai.
 */
export default function AbonnementActivationCard({ chargement, onPayer }) {
  return (
    <div className="max-w-md w-full bg-white rounded-[12px] border border-gray-200/80 shadow-2xs p-8 space-y-6">

      <div className="text-center space-y-2">
        <h1 className="text-lg font-black text-gray-900">Activez votre compte gérant</h1>
        <p className="text-sm text-gray-500">Accédez à tous les outils pour gérer vos terrains</p>
      </div>

      <div className="bg-vert-clair/40 rounded-[10px] p-5 text-center space-y-1">
        <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
          {DUREE_ESSAI_JOURS} jours d'essai gratuit inclus
        </p>
        <p className="text-2xl font-black text-vert-principal">
          {PRIX_ABONNEMENT_MENSUEL.toLocaleString('fr-FR')} FCFA
          <span className="text-sm font-bold text-gray-500"> / mois</span>
        </p>
        <p className="text-xs text-gray-500">
          Puis {PRIX_ABONNEMENT_MENSUEL.toLocaleString('fr-FR')} FCFA/mois — résiliable à tout moment
        </p>
      </div>

      <div className="border-t border-gray-100 pt-5">
        <AvantagesAbonnement />
      </div>

      <div className="space-y-2 pt-2 border-t border-gray-100">
        <Button
          type="button"
          variant="primary"
          size="md"
          rounded="8px"
          fullWidth
          disabled={chargement}
          onClick={onPayer}
        >
          {chargement ? 'Paiement en cours...' : 'Payer mon abonnement'}
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
          <Lock size={12} />
          <span>Paiement sécurisé via PayDunya</span>
        </p>
      </div>

    </div>
  );
}
