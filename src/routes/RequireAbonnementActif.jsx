import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { abonnementService } from '../services/abonnementService';

/**
 * Composant RequireAbonnementActif
 * Enveloppe les pages de l'espace gérant : si l'essai de 7 jours est terminé
 * et qu'aucun abonnement n'est payé, redirige vers la page de paiement
 * au lieu d'afficher le tableau de bord.
 *
 * À utiliser À L'INTÉRIEUR d'un <ProtectedRoute allowedRoles={['gerant']}>,
 * qui vérifie déjà que l'utilisateur est bien un gérant connecté.
 */
export default function RequireAbonnementActif({ children }) {
  const [statut, setStatut] = useState('chargement'); // 'chargement' | 'ok' | 'bloque'

  useEffect(() => {
    let annule = false;

    abonnementService.getAbonnement().then((abonnement) => {
      if (annule) return;
      const accesAutorise = abonnement.statutEffectif === 'essai' || abonnement.statutEffectif === 'actif';
      setStatut(accesAutorise ? 'ok' : 'bloque');
    });

    return () => {
      annule = true;
    };
  }, []);

  if (statut === 'chargement') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6f5]">
        <div className="w-10 h-10 border-4 border-vert-principal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (statut === 'bloque') {
    return <Navigate to="/gerant/abonnement" replace />;
  }

  return children;
}
