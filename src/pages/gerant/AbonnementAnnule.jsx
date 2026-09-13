import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import Button from '../../components/ui/Button';

/**
 * Page Abonnement Annulé (Espace Gérant)
 *
 * PayTech redirige ici si le gérant annule le paiement ou ferme la page
 * sans payer (voir cancel_url dans backend/paiements/views.py -> AbonnementInitierView).
 */
export default function AbonnementAnnule() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f4f6f5] flex items-center justify-center px-4 font-sans text-center">
      <div className="max-w-md w-full bg-white rounded-[12px] p-8 border border-gray-200/80 shadow-2xs space-y-4">
        <XCircle size={40} className="text-red-500 mx-auto" />
        <h1 className="text-lg font-extrabold text-gray-900">Paiement annulé</h1>
        <p className="text-xs text-gray-600">
          Votre paiement d'abonnement n'a pas été finalisé. Vous pouvez réessayer à tout moment.
        </p>
        <Button onClick={() => navigate('/gerant/abonnement')} variant="gold" size="md" rounded="8px" fullWidth>
          Réessayer le paiement
        </Button>
      </div>
    </div>
  );
}
