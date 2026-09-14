import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { abonnementService, joursRestantsEssai } from '../../services/abonnementService';
import Button from '../ui/Button';

/**
 * Composant AbonnementTrialBanner
 * Affiché en haut du contenu de l'espace gérant tant que la période d'essai
 * de 7 jours est en cours, pour rappeler au gérant combien de jours il lui reste
 * avant de devoir payer son abonnement. N'affiche rien si l'abonnement est déjà payé.
 */
export default function AbonnementTrialBanner() {
  const navigate = useNavigate();
  const [abonnement, setAbonnement] = useState(null);

  useEffect(() => {
    abonnementService.getAbonnement().then(setAbonnement);
  }, []);

  if (!abonnement || abonnement.statutEffectif !== 'essai') {
    return null;
  }

  const joursRestants = joursRestantsEssai(abonnement);

  return (
    <div className="w-full bg-amber-50 border border-amber-200 rounded-[10px] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 text-amber-800">
        <Clock size={16} className="shrink-0" />
        <p className="text-sm font-semibold">
          Essai gratuit : il vous reste {joursRestants} jour{joursRestants > 1 ? 's' : ''} avant l'activation de l'abonnement (7 500 FCFA/mois).
        </p>
      </div>
      <Button
        type="button"
        variant="gold"
        size="sm"
        rounded="8px"
        onClick={() => navigate('/gerant/abonnement')}
      >
        Activer maintenant
      </Button>
    </div>
  );
}
