import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AbonnementActivationCard from '../../components/gerant/abonnement/AbonnementActivationCard';
import AbonnementExpireCard from '../../components/gerant/abonnement/AbonnementExpireCard';
import AbonnementActiveCard from '../../components/gerant/abonnement/AbonnementActiveCard';
import { abonnementService } from '../../services/abonnementService';
import { formatDateCourte } from '../../utils/formatDate';

/**
 * Page Abonnement (Espace Gérant)
 *
 * Affiche l'un des 3 écrans selon la situation du gérant :
 * - 'essai'  : période d'essai gratuite en cours -> propose d'activer tout de suite
 * - 'expire' : essai ou abonnement terminé -> bloque et demande de renouveler
 * - après paiement : écran de confirmation avec le reçu
 *
 * Tant que le paiement n'est pas fait, RequireAbonnementActif (cf. routes/)
 * empêche l'accès à tout le reste de l'espace gérant.
 */
export default function Abonnement() {
  const navigate = useNavigate();
  const [abonnement, setAbonnement] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [recuPaiement, setRecuPaiement] = useState(null); // rempli une fois le paiement réussi

  useEffect(() => {
    abonnementService.getAbonnement().then(setAbonnement);
  }, []);

  const payer = async (moyenPaiement) => {
    setChargement(true);
    const resultat = await abonnementService.renouvelerAbonnement(moyenPaiement);
    setChargement(false);

    setRecuPaiement({
      dateActivation: formatDateCourte(new Date().toISOString()),
      dateFin: formatDateCourte(resultat.abonnement.dateFinAbonnement),
      montant: resultat.abonnement.prixMensuel,
      moyenPaiement: resultat.abonnement.moyenPaiement,
    });
  };

  if (!abonnement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6f5]">
        <div className="w-10 h-10 border-4 border-vert-principal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f5] flex items-center justify-center p-6">
      {recuPaiement ? (
        <AbonnementActiveCard
          abonnement={recuPaiement}
          onAccederDashboard={() => navigate('/gerant/dashboard')}
        />
      ) : abonnement.statutEffectif === 'expire' ? (
        <AbonnementExpireCard
          dateSuspension={formatDateCourte(abonnement.dateFinEssai)}
          chargement={chargement}
          onPayer={() => payer('Wave')}
        />
      ) : (
        <AbonnementActivationCard
          chargement={chargement}
          onPayer={() => payer('Wave')}
        />
      )}
    </div>
  );
}
