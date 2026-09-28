import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TicketQR from '../../components/reservation/TicketQR';

/**
 * Page Confirmation (Espace Amateur)
 *
 * Dernière étape du parcours de réservation : affiche le(s) ticket(s)
 * numérique(s) (QR code) des réservations qui viennent d'être payées avec
 * succès (une par créneau, même si plusieurs créneaux ont été réservés
 * ensemble). TicketQR est une modale plein écran conçue pour UN seul
 * ticket à la fois (réutilisée telle quelle, aussi utilisée depuis "Mes
 * réservations") : on affiche donc les tickets l'un après l'autre plutôt
 * que de les empiler.
 */
export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  // `reservations` (pluriel) est la forme actuelle ; on accepte encore
  // `reservation` (singulier) au cas où un lien externe ou un historique
  // de navigation pointerait vers l'ancien format.
  const reservations = location.state?.reservations
    || (location.state?.reservation ? [location.state.reservation] : null);

  const [indexActif, setIndexActif] = useState(0);

  useEffect(() => {
    if (!reservations || reservations.length === 0) {
      navigate('/terrains', { replace: true });
    }
  }, [reservations, navigate]);

  if (!reservations || reservations.length === 0) {
    return null;
  }

  const dernierTicket = indexActif === reservations.length - 1;

  const handleFermerTicket = () => {
    if (dernierTicket) {
      navigate('/reservations');
    } else {
      setIndexActif((i) => i + 1);
    }
  };

  return (
    <>
      {reservations.length > 1 && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[60] bg-vert-principal text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
          Ticket {indexActif + 1} sur {reservations.length}
          {!dernierTicket && ' — fermez pour voir le suivant'}
        </div>
      )}
      <TicketQR
        key={reservations[indexActif].id}
        ticket={reservations[indexActif]}
        onClose={handleFermerTicket}
      />
    </>
  );
}
