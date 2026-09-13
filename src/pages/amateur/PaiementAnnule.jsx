import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import Button from '../../components/ui/Button';

/**
 * Page Paiement Annulé (Espace Amateur)
 *
 * PayTech redirige ici si l'utilisateur annule le paiement ou ferme la
 * page de paiement sans payer (voir cancel_url dans backend/paiements/views.py).
 * La réservation reste "en_attente" côté backend : le créneau sera libéré
 * automatiquement au bout de 15 minutes si aucun paiement n'arrive.
 */
export default function PaiementAnnule() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reservationId = searchParams.get('reservation');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-sans text-center">
      <div className="max-w-md w-full bg-white rounded-[8px] p-8 border border-gray-200 space-y-4">
        <XCircle size={40} className="text-red-500 mx-auto" />
        <h1 className="text-lg font-extrabold text-gray-900">Paiement annulé</h1>
        <p className="text-xs text-gray-600">
          Votre paiement n'a pas été finalisé. Votre créneau reste réservé encore quelques minutes,
          le temps de réessayer si vous le souhaitez.
        </p>
        <div className="space-y-2">
          {reservationId && (
            <Button
              onClick={() => navigate('/paiement', { state: { reservationId } })}
              variant="gold"
              size="md"
              rounded="8px"
              fullWidth
            >
              Réessayer le paiement
            </Button>
          )}
          <Button onClick={() => navigate('/terrains')} variant="outline" size="md" rounded="8px" fullWidth>
            Retour aux terrains
          </Button>
        </div>
      </div>
    </div>
  );
}
