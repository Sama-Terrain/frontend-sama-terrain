import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { abonnementService } from '../services/abonnementService';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/roles';

/**
 * Composant RequireAbonnementActif
 * Enveloppe les pages de l'espace gérant : si l'essai de 7 jours est terminé
 * et qu'aucun abonnement n'est payé, redirige vers la page de paiement
 * au lieu d'afficher le tableau de bord.
 *
 * À utiliser À L'INTÉRIEUR d'un <ProtectedRoute allowedRoles={['gerant']}>,
 * qui vérifie déjà que l'utilisateur est bien un gérant connecté.
 *
 * Pour un employé, c'est l'abonnement de son employeur qui compte : il ne
 * peut pas le payer, on lui explique donc simplement la situation.
 */
export default function RequireAbonnementActif({ children }) {
  const { currentUser, logout } = useAuth();
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

  if (statut === 'bloque' && currentUser?.role === ROLES.EMPLOYE) {
    const employeur = currentUser.equipe?.proprietaire_nom || 'votre gérant';
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6f5] p-4">
        <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm max-w-md w-full p-8 text-center space-y-4">
          <span className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Lock size={22} />
          </span>
          <h1 className="text-lg font-extrabold text-vert-principal">Accès momentanément suspendu</h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            L'abonnement Sama-Terrain de <strong>{employeur}</strong> a expiré. Votre accès sera rétabli
            dès qu'il l'aura renouvelé : contactez-le.
          </p>
          <button
            type="button"
            onClick={logout}
            className="rounded-[8px] bg-vert-principal hover:bg-vert-survol text-white text-sm font-bold px-5 py-2.5 cursor-pointer"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  if (statut === 'bloque') {
    return <Navigate to="/gerant/abonnement" replace />;
  }

  return children;
}
