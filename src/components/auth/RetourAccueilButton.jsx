import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Bouton "Retour à l'accueil" affiché sur les pages d'authentification
 * (Connexion, Inscription, Vérification email), qui n'ont pas la Navbar
 * habituelle et donc aucun autre moyen de revenir en arrière.
 */
export default function RetourAccueilButton() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate('/')}
      className="absolute top-5 left-5 sm:top-6 sm:left-6 z-10 flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-vert-principal transition-colors cursor-pointer"
    >
      <ArrowLeft size={16} />
      <span>Accueil</span>
    </button>
  );
}
