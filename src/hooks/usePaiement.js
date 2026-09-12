import { useState } from 'react';
import { paiementService } from '../services/paiementService';

/**
 * Hook usePaiement
 * Regroupe l'état d'un paiement (moyen choisi, chargement, erreur) pour que
 * la page Paiement.jsx reste simple à lire.
 */
export function usePaiement() {
  const [moyenPaiement, setMoyenPaiement] = useState('Wave');
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');

  // Lance le paiement du montant donné avec le moyen de paiement sélectionné
  async function payer(montant) {
    setChargement(true);
    setErreur('');

    const resultat = await paiementService.effectuerPaiement({ montant, moyenPaiement });

    setChargement(false);
    if (!resultat.success) {
      setErreur('Le paiement a échoué. Veuillez réessayer.');
    }
    return resultat;
  }

  return { moyenPaiement, setMoyenPaiement, chargement, erreur, payer };
}
