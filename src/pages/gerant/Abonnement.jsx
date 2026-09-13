import { useState, useEffect } from 'react';
import AbonnementActivationCard from '../../components/gerant/abonnement/AbonnementActivationCard';
import AbonnementExpireCard from '../../components/gerant/abonnement/AbonnementExpireCard';
import { abonnementService } from '../../services/abonnementService';
import { formatDateCourte } from '../../utils/formatDate';

/**
 * Page Abonnement (Espace Gérant)
 *
 * Affiche l'un des 2 écrans selon la situation du gérant :
 * - 'essai'  : période d'essai gratuite en cours -> propose d'activer tout de suite
 * - 'expire' : essai ou abonnement terminé -> bloque et demande de renouveler
 *
 * Le clic sur "Payer" redirige réellement vers PayTech (Wave/Orange Money) ;
 * la confirmation arrive de façon asynchrone via l'IPN, et l'utilisateur
 * revient sur /gerant/abonnement/succes une fois le paiement fait (voir
 * AbonnementSucces.jsx). Tant que le paiement n'est pas fait,
 * RequireAbonnementActif (cf. routes/) empêche l'accès au reste de l'espace gérant.
 */
export default function Abonnement() {
  const [abonnement, setAbonnement] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    abonnementService.getAbonnement().then(setAbonnement);
  }, []);

  const payer = async () => {
    setErreur('');
    setChargement(true);
    const resultat = await abonnementService.renouvelerAbonnement();
    // En cas de succès, la page quitte le site (redirection PayTech) : pas
    // besoin de remettre chargement à false, ni de faire quoi que ce soit d'autre.
    if (!resultat.success) {
      setChargement(false);
      setErreur(resultat.error);
    }
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
      {abonnement.statutEffectif === 'expire' ? (
        <AbonnementExpireCard
          dateSuspension={formatDateCourte(abonnement.dateFinEssai)}
          chargement={chargement}
          erreur={erreur}
          onPayer={payer}
        />
      ) : (
        <AbonnementActivationCard
          chargement={chargement}
          erreur={erreur}
          onPayer={payer}
        />
      )}
    </div>
  );
}
