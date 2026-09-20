import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle, ScanLine, ArrowLeft } from 'lucide-react';
import GerantLayout from '../../components/gerant/GerantLayout';
import ScannerCameraPreview from '../../components/gerant/ScannerCameraPreview';
import ClavierMontant from '../../components/gerant/ClavierMontant';
import DernieresValidationsList from '../../components/gerant/DernieresValidationsList';
import Button from '../../components/ui/Button';
import { gerantService } from '../../services/gerantService';

/**
 * Page ScannerTicket (Espace Gérant)
 *
 * Pensée pour un usage rapide et répétitif à l'entrée du terrain, par
 * quelqu'un pas forcément à l'aise avec le numérique : un seul écran, une
 * seule action à la fois (façon Wave), plutôt que tout afficher en même
 * temps. Étapes : scan → montant → vérification → résultat → suivant.
 */
export default function ScannerTicket({ onLogout }) {
  const [profile, setProfile] = useState(null);
  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(true);

  // 'scan' | 'manuel' | 'montant' | 'verification' | 'resultat'
  const [etape, setEtape] = useState('scan');
  const [scanActif, setScanActif] = useState(true);
  const [codeManuel, setCodeManuel] = useState('');
  const [codeConfirme, setCodeConfirme] = useState('');
  const [montant, setMontant] = useState('0');
  const [resultat, setResultat] = useState(null);

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

  // Un QR détecté fait directement passer à l'écran "montant" : pas de
  // vérification tant que le montant n'est pas confirmé.
  const handleCodeDetecte = useCallback((valeur) => {
    setScanActif(false);
    setCodeConfirme(valeur);
    setMontant('0');
    setEtape('montant');
  }, []);

  const handleValiderCodeManuel = () => {
    if (!codeManuel.trim()) return;
    setCodeConfirme(codeManuel.trim());
    setMontant('0');
    setEtape('montant');
  };

  const handleConfirmerMontant = async () => {
    setEtape('verification');
    const resultatVerif = await gerantService.verifierTicket(codeConfirme);

    if (!resultatVerif.success) {
      setResultat({ status: 'error', message: resultatVerif.error });
      setEtape('resultat');
      return;
    }

    const ticket = resultatVerif.ticket;
    setResultat({ status: 'success', ticket, montantSaisi: Number(montant) });
    setEtape('resultat');

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

  // Repart de zéro pour le client suivant : relance directement la caméra.
  const handleClientSuivant = () => {
    setCodeManuel('');
    setCodeConfirme('');
    setMontant('0');
    setResultat(null);
    setScanActif(true);
    setEtape('scan');
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

      {/* ÉCRAN 1 : SCAN CAMÉRA (démarre tout seul) */}
      {etape === 'scan' && (
        <div className="bg-white rounded-[16px] border border-gray-200/80 shadow-2xs p-6 sm:p-8 space-y-5 max-w-xl mx-auto text-center">
          <h2 className="text-lg font-black text-gray-900">Scannez le QR code du client</h2>
          <ScannerCameraPreview scanActif={scanActif} onCodeDetecte={handleCodeDetecte} />
          <button
            type="button"
            onClick={() => setEtape('manuel')}
            className="text-sm font-bold text-vert-principal hover:underline cursor-pointer"
          >
            Le QR ne scanne pas ? Saisir le code
          </button>
        </div>
      )}

      {/* ÉCRAN ALTERNATIF : CODE SAISI À LA MAIN (si caméra en panne) */}
      {etape === 'manuel' && (
        <div className="bg-white rounded-[16px] border border-gray-200/80 shadow-2xs p-6 sm:p-8 space-y-5 max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => setEtape('scan')}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <ArrowLeft size={14} /> Revenir au scan
          </button>
          <h2 className="text-lg font-black text-gray-900 text-center">Code du ticket</h2>
          <input
            type="text"
            autoFocus
            value={codeManuel}
            onChange={(e) => setCodeManuel(e.target.value)}
            placeholder="Ex : 3fa85f64-5717-4562-b3fc-2c963f66afa6"
            className="w-full border border-gray-200 rounded-[10px] px-4 py-4 text-center text-sm font-mono font-bold text-gray-900 outline-none focus:border-vert-principal"
          />
          <Button
            type="button"
            variant="gold"
            size="lg"
            rounded="10px"
            fullWidth
            disabled={!codeManuel.trim()}
            onClick={handleValiderCodeManuel}
          >
            Continuer
          </Button>
        </div>
      )}

      {/* ÉCRAN 2 : MONTANT REÇU (gros clavier, une seule action) */}
      {etape === 'montant' && (
        <div className="bg-white rounded-[16px] border border-gray-200/80 shadow-2xs p-6 sm:p-8 space-y-6 max-w-xl mx-auto text-center">
          <button
            type="button"
            onClick={handleClientSuivant}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <ArrowLeft size={14} /> Annuler
          </button>

          <div>
            <p className="text-sm font-bold text-gray-500">Combien le client paie sur place ?</p>
            <p className="text-4xl font-black text-vert-principal mt-2">
              {Number(montant).toLocaleString('fr-FR')} <span className="text-lg">FCFA</span>
            </p>
          </div>

          <ClavierMontant valeur={montant} onChange={setMontant} />

          <Button
            type="button"
            variant="gold"
            size="lg"
            rounded="10px"
            fullWidth
            disabled={Number(montant) <= 0}
            onClick={handleConfirmerMontant}
            className="gap-2"
          >
            <CheckCircle2 size={18} />
            <span>Confirmer</span>
          </Button>
        </div>
      )}

      {/* ÉCRAN 3 : VÉRIFICATION EN COURS */}
      {etape === 'verification' && (
        <div className="bg-white rounded-[16px] border border-gray-200/80 shadow-2xs p-10 max-w-xl mx-auto text-center space-y-4">
          <div className="w-14 h-14 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-gray-600">Vérification du ticket...</p>
        </div>
      )}

      {/* ÉCRAN 4 : RÉSULTAT */}
      {etape === 'resultat' && resultat && (
        <div className="max-w-xl mx-auto space-y-5">
          {resultat.status === 'success' ? (
            <div className="bg-white rounded-[16px] border border-emerald-200 shadow-2xs p-8 text-center space-y-4">
              <CheckCircle2 size={64} className="text-emerald-500 mx-auto" />
              <h2 className="text-xl font-black text-emerald-700">Ticket validé !</h2>
              <div className="space-y-1.5 text-sm text-gray-700">
                <p className="font-bold">{resultat.ticket.client}</p>
                <p>{resultat.ticket.terrain} • {resultat.ticket.creneau}</p>
                <p className="text-lg font-black text-vert-principal">
                  {resultat.montantSaisi.toLocaleString('fr-FR')} FCFA encaissés
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[16px] border border-red-200 shadow-2xs p-8 text-center space-y-4">
              <XCircle size={64} className="text-red-500 mx-auto" />
              <h2 className="text-xl font-black text-red-700">Ticket refusé</h2>
              <p className="text-sm text-gray-600">{resultat.message}</p>
            </div>
          )}

          <Button
            type="button"
            variant="gold"
            size="lg"
            rounded="10px"
            fullWidth
            onClick={handleClientSuivant}
            className="gap-2"
          >
            <ScanLine size={18} />
            <span>Client suivant</span>
          </Button>
        </div>
      )}

      {/* HISTORIQUE, discret sous le flow principal */}
      <div className="max-w-xl mx-auto">
        <DernieresValidationsList validations={validations} />
      </div>

    </GerantLayout>
  );
}
