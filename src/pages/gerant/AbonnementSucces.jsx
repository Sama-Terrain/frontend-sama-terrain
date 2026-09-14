import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import Button from '../../components/ui/Button';
import AbonnementActiveCard from '../../components/gerant/abonnement/AbonnementActiveCard';
import { abonnementService } from '../../services/abonnementService';
import { formatDateCourte } from '../../utils/formatDate';

const NB_TENTATIVES_MAX = 6;
const DELAI_ENTRE_TENTATIVES_MS = 2000;

/**
 * Page Abonnement Succès (Espace Gérant)
 *
 * PayTech redirige ici après un paiement réussi (voir success_url dans
 * backend/paiements/views.py -> AbonnementInitierView). La confirmation
 * réelle arrive de façon asynchrone via l'IPN : on "poll" quelques secondes
 * avant d'abandonner et de proposer un lien de secours.
 */
export default function AbonnementSucces() {
  const navigate = useNavigate();
  const [statut, setStatut] = useState('verification'); // 'verification' | 'actif' | 'en_attente'
  const [abonnement, setAbonnement] = useState(null);

  useEffect(() => {
    let annule = false;

    async function verifier(tentative) {
      try {
        const data = await abonnementService.getAbonnement();
        if (annule) return;

        if (data.statutEffectif === 'actif') {
          setAbonnement(data);
          setStatut('actif');
          return;
        }

        if (tentative < NB_TENTATIVES_MAX) {
          setTimeout(() => verifier(tentative + 1), DELAI_ENTRE_TENTATIVES_MS);
        } else {
          setStatut('en_attente');
        }
      } catch (error) {
        console.error('Erreur vérification abonnement :', error);
        if (!annule) setStatut('en_attente');
      }
    }

    verifier(1);

    return () => {
      annule = true;
    };
  }, []);

  if (statut === 'actif' && abonnement) {
    return (
      <div className="min-h-screen bg-[#f4f6f5] flex items-center justify-center p-6">
        <AbonnementActiveCard
          abonnement={{
            dateActivation: formatDateCourte(new Date().toISOString()),
            dateFin: formatDateCourte(abonnement.dateFinAbonnement),
            montant: abonnement.prixMensuel,
            moyenPaiement: 'PayTech',
          }}
          onAccederDashboard={() => navigate('/gerant/dashboard')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f5] flex items-center justify-center px-4 font-sans text-center">
      <div className="max-w-md w-full bg-white rounded-[12px] p-8 border border-gray-200/80 shadow-2xs space-y-4">
        {statut === 'en_attente' ? (
          <>
            <AlertTriangle size={40} className="text-amber-500 mx-auto" />
            <h1 className="text-lg font-extrabold text-gray-900">Paiement en cours de confirmation</h1>
            <p className="text-xs text-gray-600">
              Votre paiement a bien été reçu par PayTech, mais sa confirmation prend un peu plus de temps
              que prévu. Réessayez dans quelques instants.
            </p>
            <Button onClick={() => navigate('/gerant/abonnement')} variant="primary" size="md" rounded="8px" fullWidth>
              Retour à l'abonnement
            </Button>
          </>
        ) : (
          <>
            <CheckCircle2 size={40} className="text-vert-principal mx-auto animate-pulse" />
            <h1 className="text-lg font-extrabold text-gray-900">Vérification de votre paiement...</h1>
            <p className="text-xs text-gray-600">
              Merci ! Nous confirmons votre abonnement avec PayTech, cela ne prendra que quelques secondes.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
