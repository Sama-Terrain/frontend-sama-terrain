import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaiementMethode from '../../components/paiement/PaiementMethode';
import PaiementRecap from '../../components/paiement/PaiementRecap';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { usePaiement } from '../../hooks/usePaiement';

/**
 * Page Paiement (Espace Amateur)
 *
 * Étape entre la sélection d'un créneau (DetailTerrain.jsx) et la confirmation
 * (Confirmation.jsx) : l'amateur choisit Wave ou Orange Money, paie son avance
 * (simulée via PayDunya), puis la réservation est réellement créée.
 *
 * Les infos de la réservation à payer arrivent via la navigation (state du
 * useNavigate déclenché depuis DetailTerrain.jsx), pas par un contexte global :
 * si on arrive sur cette page sans passer par là, `reservationData` est vide
 * et on renvoie l'utilisateur vers la recherche de terrains.
 */
export default function Paiement() {
  const location = useLocation();
  const navigate = useNavigate();
  const reservationData = location.state;

  const { moyenPaiement, setMoyenPaiement, chargement, erreur, payer } = usePaiement();

  useEffect(() => {
    if (!reservationData) {
      navigate('/terrains', { replace: true });
    }
  }, [reservationData, navigate]);

  if (!reservationData) {
    return null;
  }

  // La réservation existe déjà en base (créée par DetailTerrain.jsx, ce qui
  // bloque le créneau) : il ne reste qu'à démarrer le paiement PayTech, qui
  // va rediriger l'utilisateur hors du site pour payer avec Wave/Orange Money.
  const handlePayer = async () => {
    await payer(reservationData.reservationId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-20 font-sans text-left">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-extrabold text-vert-principal">Paiement de l'avance</h1>

        <PaiementRecap reservation={reservationData} />

        <div className="bg-white rounded-[8px] p-6 border border-gray-200 space-y-5">
          <PaiementMethode value={moyenPaiement} onChange={setMoyenPaiement} />

          {erreur && <Alert type="error" message={erreur} />}

          <Button
            type="button"
            onClick={handlePayer}
            disabled={chargement}
            variant="gold"
            size="md"
            rounded="8px"
            fullWidth
            className="font-extrabold"
          >
            {chargement
              ? 'Paiement en cours...'
              : `Payer ${Number(reservationData.avance).toLocaleString('fr-FR')} FCFA`}
          </Button>
        </div>
      </div>
    </div>
  );
}
