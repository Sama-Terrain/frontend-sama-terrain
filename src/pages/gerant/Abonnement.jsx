import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Wallet } from 'lucide-react';
import Button from '../../components/ui/Button';
import { abonnementService } from '../../services/abonnementService';
import { PRIX_ABONNEMENT_MENSUEL } from '../../mocks/abonnements';

/**
 * Page Abonnement (Espace Gérant)
 *
 * Affichée quand l'essai gratuit de 7 jours est terminé et qu'aucun abonnement
 * n'est actif : le gérant doit payer 7 500 FCFA/mois (via PayDunya, qui agrège
 * Wave et Orange Money) pour retrouver l'accès à son tableau de bord.
 * Tant qu'il n'a pas payé, il ne peut voir aucune autre page de l'espace gérant
 * (cf. src/routes/RequireAbonnementActif.jsx).
 */
export default function Abonnement() {
  const navigate = useNavigate();
  const [paiementEnCours, setPaiementEnCours] = useState(null); // 'Wave' | 'Orange Money' | null

  const payer = async (moyenPaiement) => {
    setPaiementEnCours(moyenPaiement);
    await abonnementService.renouvelerAbonnement(moyenPaiement);
    setPaiementEnCours(null);
    navigate('/gerant/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f4f6f5] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[12px] border border-gray-200/80 shadow-2xs p-8 text-center space-y-6">

        <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
          <Lock size={24} />
        </div>

        <div className="space-y-2">
          <h1 className="text-lg font-black text-gray-900">Abonnement requis</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Votre période d'essai gratuite est terminée. Pour continuer à utiliser votre
            tableau de bord Sama-Terrain, activez votre abonnement mensuel.
          </p>
        </div>

        <div className="bg-vert-clair/40 rounded-[10px] p-4">
          <p className="text-2xl font-black text-vert-principal">
            {PRIX_ABONNEMENT_MENSUEL.toLocaleString('fr-FR')} FCFA
            <span className="text-sm font-bold text-gray-500"> / mois</span>
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-500">Payer via PayDunya avec :</p>
          <Button
            type="button"
            variant="primary"
            size="md"
            rounded="8px"
            fullWidth
            disabled={paiementEnCours !== null}
            onClick={() => payer('Wave')}
            className="gap-2"
          >
            <Wallet size={16} />
            <span>{paiementEnCours === 'Wave' ? 'Paiement en cours...' : 'Payer avec Wave'}</span>
          </Button>
          <Button
            type="button"
            variant="gold"
            size="md"
            rounded="8px"
            fullWidth
            disabled={paiementEnCours !== null}
            onClick={() => payer('Orange Money')}
            className="gap-2"
          >
            <Wallet size={16} />
            <span>{paiementEnCours === 'Orange Money' ? 'Paiement en cours...' : 'Payer avec Orange Money'}</span>
          </Button>
        </div>

      </div>
    </div>
  );
}
