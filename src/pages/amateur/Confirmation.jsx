import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TicketQR from '../../components/reservation/TicketQR';

/**
 * Page Confirmation (Espace Amateur)
 *
 * Dernière étape du parcours de réservation : affiche le ticket numérique
 * (QR code) de la réservation qui vient d'être payée avec succès.
 * Réutilise le composant TicketQR déjà existant (utilisé aussi depuis
 * "Mes réservations") plutôt que de recréer un second visuel de ticket.
 */
export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const reservation = location.state?.reservation;

  useEffect(() => {
    if (!reservation) {
      navigate('/terrains', { replace: true });
    }
  }, [reservation, navigate]);

  if (!reservation) {
    return null;
  }

  return (
    <TicketQR
      ticket={reservation}
      onClose={() => navigate('/reservations')}
    />
  );
}
