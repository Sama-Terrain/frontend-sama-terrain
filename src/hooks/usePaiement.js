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

  // Démarre le paiement PayTech de la réservation donnée : redirige le
  // navigateur vers la page de paiement externe (Wave/Orange Money réels).
  async function payer(reservationId) {
    setChargement(true);
    setErreur('');

    const resultat = await paiementService.initierPaiement(reservationId, moyenPaiement);

    if (!resultat.success) {
      setChargement(false);
      setErreur(resultat.error);
      return resultat;
    }

    // Vraie sortie du site vers PayTech : pas de setChargement(false) ici,
    // la page va quitter l'application.
    window.location.href = resultat.paymentUrl;
    return resultat;
  }

  return { moyenPaiement, setMoyenPaiement, chargement, erreur, payer };
}
