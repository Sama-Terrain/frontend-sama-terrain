import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import Button from '../../components/ui/Button';
import { reservationService } from '../../services/reservationService';

const NB_TENTATIVES_MAX = 6;
const DELAI_ENTRE_TENTATIVES_MS = 2000;

/**
 * Page Paiement Succès (Espace Amateur)
 *
 * PayTech redirige ici après un paiement réussi (voir success_url dans
 * backend/paiements/views.py). La confirmation réelle de la réservation
 * arrive de façon ASYNCHRONE via l'IPN (webhook serveur-à-serveur de
 * PayTech vers notre backend) : elle peut donc ne pas être encore arrivée
 * au moment où l'utilisateur revient sur le site. On "poll" (revérifie)
 * quelques secondes avant d'abandonner et de proposer un lien de secours.
 */
export default function PaiementSucces() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reservationId = searchParams.get('reservation');

  const [statut, setStatut] = useState('verification'); // 'verification' | 'confirmee' | 'en_attente'

  useEffect(() => {
    if (!reservationId) {
      navigate('/terrains', { replace: true });
      return;
    }

    let annule = false;

    async function verifier(tentative) {
      try {
        const reservation = await reservationService.getReservationById(reservationId);

        if (annule) return;

        if (reservation.statut === 'confirmee') {
          setStatut('confirmee');
          navigate('/confirmation', { state: { reservation }, replace: true });
          return;
        }

        if (tentative < NB_TENTATIVES_MAX) {
          setTimeout(() => verifier(tentative + 1), DELAI_ENTRE_TENTATIVES_MS);
        } else {
          setStatut('en_attente');
        }
      } catch (error) {
        console.error('Erreur vérification paiement :', error);
        if (!annule) setStatut('en_attente');
      }
    }

    verifier(1);

    return () => {
      annule = true;
    };
  }, [reservationId, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-sans text-center">
      <div className="max-w-md w-full bg-white rounded-[8px] p-8 border border-gray-200 space-y-4">
        {statut === 'en_attente' ? (
          <>
            <AlertTriangle size={40} className="text-amber-500 mx-auto" />
            <h1 className="text-lg font-extrabold text-gray-900">Paiement en cours de confirmation</h1>
            <p className="text-xs text-gray-600">
              Votre paiement a bien été reçu par PayTech, mais sa confirmation prend un peu plus de temps
              que prévu. Vérifiez "Mes réservations" dans quelques instants : elle y apparaîtra dès que
              confirmée.
            </p>
            <Button onClick={() => navigate('/reservations')} variant="primary" size="md" rounded="8px" fullWidth>
              Voir mes réservations
            </Button>
          </>
        ) : (
          <>
            <CheckCircle2 size={40} className="text-vert-principal mx-auto animate-pulse" />
            <h1 className="text-lg font-extrabold text-gray-900">Vérification de votre paiement...</h1>
            <p className="text-xs text-gray-600">
              Merci ! Nous confirmons votre réservation avec PayTech, cela ne prendra que quelques secondes.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
