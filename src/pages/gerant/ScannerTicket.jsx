import { useState, useEffect } from 'react';
import GerantLayout from '../../components/gerant/GerantLayout';
import ScannerCameraPreview from '../../components/gerant/ScannerCameraPreview';
import TicketValidationResult from '../../components/gerant/TicketValidationResult';
import DernieresValidationsList from '../../components/gerant/DernieresValidationsList';
import Button from '../../components/ui/Button';
import { gerantService } from '../../services/gerantService';

/**
 * Page ScannerTicket (Espace Gérant)
 *
 * Le jour du match, le gérant valide le ticket de l'amateur (par scan caméra
 * ou saisie manuelle du code) et enregistre le solde réglé sur place.
 * La saisie du montant solde est obligatoire avant de pouvoir valider.
 */
export default function ScannerTicket({ onLogout }) {
  const [profile, setProfile] = useState(null);
  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [codeTicket, setCodeTicket] = useState('');
  const [montantSolde, setMontantSolde] = useState('');
  const [erreurMontant, setErreurMontant] = useState('');
  const [resultat, setResultat] = useState(null);
  const [verification, setVerification] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [profileData, validationsData] = await Promise.all([
          gerantService.getGerantProfile(),
          gerantService.getDernieresValidations(),
        ]);
        setProfile(profileData);
        setValidations(validationsData);
      } catch (error) {
        console.error('Erreur chargement scanner ticket:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleVerifier = async () => {
    setErreurMontant('');

    if (!codeTicket.trim()) {
      setErreurMontant('Veuillez saisir ou scanner un code de ticket.');
      return;
    }
    if (!montantSolde || Number(montantSolde) < 0) {
      setErreurMontant('Le montant solde est obligatoire pour valider le ticket.');
      return;
    }

    setVerification(true);
    const ticket = await gerantService.verifierTicket(codeTicket);
    setVerification(false);

    if (!ticket) {
      setResultat({ status: 'error', code: codeTicket.trim() });
      return;
    }

    setResultat({ status: 'success', ticket, montantSaisi: Number(montantSolde) });

    // Ajoute la validation en tête de la liste "Dernières validations"
    setValidations((current) => [
      {
        id: `${ticket.code}-${Date.now()}`,
        nom: ticket.client,
        sousTitre: `${ticket.terrain} • ${ticket.creneau} • À l'instant`,
        statut: 'Validé',
        statutBadgeClass: 'bg-emerald-100 text-emerald-700',
      },
      ...current,
    ]);
  };

  if (loading) {
    return (
      <GerantLayout title="Scanner QR Code" profile={profile} onLogout={onLogout}>
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-bold">Chargement du scanner...</p>
        </div>
      </GerantLayout>
    );
  }

  return (
    <GerantLayout title="Scanner QR Code" profile={profile} onLogout={onLogout}>

      <section className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-5 items-start">

        {/* COLONNE GAUCHE : CAMÉRA + FORMULAIRES */}
        <div className="space-y-5">

          <div className="bg-white rounded-[12px] border border-gray-200/80 shadow-2xs p-6 space-y-4">
            <h3 className="text-base font-black text-gray-900">Caméra de Validation en Direct</h3>
            <ScannerCameraPreview />
          </div>

          <div className="bg-white rounded-[12px] border border-gray-200/80 shadow-2xs p-6 space-y-3">
            <label className="text-sm font-bold text-gray-900">Saisir le montant solde *</label>
            <input
              type="number"
              min={0}
              value={montantSolde}
              onChange={(e) => setMontantSolde(e.target.value)}
              placeholder="15000 FCFA"
              className="w-full border border-gray-200 rounded-[8px] px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-vert-principal"
            />
          </div>

          <div className="bg-white rounded-[12px] border border-gray-200/80 shadow-2xs p-6 space-y-3">
            <label className="text-sm font-bold text-gray-900">Saisir le code manuellement</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={codeTicket}
                onChange={(e) => setCodeTicket(e.target.value)}
                placeholder="Ex : 3fa85f64-5717-4562-b3fc-2c963f66afa6"
                className="flex-1 border border-gray-200 rounded-[8px] px-4 py-3 text-sm font-mono font-semibold text-gray-900 outline-none focus:border-vert-principal"
              />
              <Button
                type="button"
                variant="gold"
                size="md"
                rounded="8px"
                onClick={handleVerifier}
                disabled={verification}
              >
                {verification ? 'Vérification...' : 'Vérifier'}
              </Button>
            </div>
            {erreurMontant && (
              <p className="text-xs font-semibold text-red-600">{erreurMontant}</p>
            )}
          </div>

        </div>

        {/* COLONNE DROITE : RÉSULTAT + HISTORIQUE */}
        <div className="space-y-5">
          <TicketValidationResult result={resultat} />
          <DernieresValidationsList validations={validations} />
        </div>

      </section>

    </GerantLayout>
  );
}
