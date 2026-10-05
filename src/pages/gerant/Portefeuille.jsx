import { useEffect, useState } from 'react';
import { Wallet, Clock, Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import GerantLayout from '../../components/gerant/GerantLayout';
import { gerantService } from '../../services/gerantService';
import { nettoyerTelephone, estNumeroSenegalaisValide } from '../../utils/telephone';

const OPERATEURS = [
  { valeur: 'wave', libelle: 'Wave' },
  { valeur: 'orange_money', libelle: 'Orange Money' },
];

const STATUTS_RETRAIT = {
  en_attente: { libelle: 'En cours de versement', classe: 'bg-amber-100 text-amber-800' },
  verse: { libelle: 'Versé', classe: 'bg-emerald-100 text-emerald-800' },
  echoue: { libelle: 'Échoué', classe: 'bg-red-100 text-red-700' },
};

const fcfa = (montant) => `${(montant || 0).toLocaleString('fr-FR')} FCFA`;

/**
 * Page Portefeuille (Espace Gérant)
 *
 * Les avances payées par les joueurs arrivent sur le compte de la
 * plateforme et créditent ce portefeuille. Le gérant n'a qu'à indiquer son
 * numéro Wave ou Orange Money, puis demander un retrait : l'argent lui est
 * envoyé sur ce numéro.
 *
 * Une avance n'est retirable qu'à moins de 24h du match ("À venir" avant) :
 * jusque-là, le joueur peut encore annuler et être remboursé.
 */
export default function Portefeuille({ onLogout }) {
  const [portefeuille, setPortefeuille] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreurChargement, setErreurChargement] = useState('');

  const [operateur, setOperateur] = useState('wave');
  const [numero, setNumero] = useState('');
  const [modifierNumero, setModifierNumero] = useState(false);
  const [enregistrementNumero, setEnregistrementNumero] = useState(false);
  const [erreurNumero, setErreurNumero] = useState('');

  const [montant, setMontant] = useState('');
  const [retraitEnCours, setRetraitEnCours] = useState(false);
  const [erreurRetrait, setErreurRetrait] = useState('');
  const [message, setMessage] = useState('');

  const appliquer = (donnees) => {
    setPortefeuille(donnees);
    if (donnees.numero_retrait) {
      setOperateur(donnees.numero_retrait.operateur);
      setNumero(donnees.numero_retrait.numero.slice(3));
    }
  };

  useEffect(() => {
    gerantService.getPortefeuille()
      .then(appliquer)
      .catch(() => setErreurChargement('Impossible de charger votre portefeuille.'))
      .finally(() => setChargement(false));
  }, []);

  const handleEnregistrerNumero = async (e) => {
    e.preventDefault();
    setErreurNumero('');
    setMessage('');
    if (!estNumeroSenegalaisValide(numero)) {
      setErreurNumero('Numéro invalide : 9 chiffres commençant par 70, 75, 76, 77 ou 78.');
      return;
    }
    setEnregistrementNumero(true);
    const resultat = await gerantService.enregistrerNumeroRetrait(operateur, numero);
    setEnregistrementNumero(false);
    if (!resultat.success) {
      setErreurNumero(resultat.error);
      return;
    }
    appliquer(resultat.portefeuille);
    setModifierNumero(false);
    setMessage('Numéro enregistré : vos retraits seront envoyés sur ce numéro.');
  };

  const handleRetrait = async (e) => {
    e.preventDefault();
    setErreurRetrait('');
    setMessage('');
    const valeur = Number(montant);
    if (!Number.isInteger(valeur) || valeur <= 0) {
      setErreurRetrait('Indiquez un montant valide.');
      return;
    }
    setRetraitEnCours(true);
    const resultat = await gerantService.demanderRetrait(valeur);
    setRetraitEnCours(false);
    if (!resultat.success) {
      setErreurRetrait(resultat.error);
      return;
    }
    setMontant('');
    setMessage(`Retrait de ${fcfa(valeur)} demandé : vous recevrez l'argent sur votre numéro dès qu'il sera versé.`);
    appliquer(await gerantService.getPortefeuille());
  };

  if (chargement) {
    return (
      <GerantLayout title="Mon portefeuille" onLogout={onLogout}>
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-bold">Chargement du portefeuille...</p>
        </div>
      </GerantLayout>
    );
  }

  if (erreurChargement) {
    return (
      <GerantLayout title="Mon portefeuille" onLogout={onLogout}>
        <p className="text-sm text-red-600 font-semibold">{erreurChargement}</p>
      </GerantLayout>
    );
  }

  const numeroEnregistre = portefeuille.numero_retrait;
  const retraitEnAttente = portefeuille.retraits.some((r) => r.statut === 'en_attente');
  const peutRetirer = numeroEnregistre && !retraitEnAttente
    && portefeuille.solde_disponible >= portefeuille.montant_retrait_minimum;
  const libelleOperateur = OPERATEURS.find((o) => o.valeur === numeroEnregistre?.operateur)?.libelle;

  return (
    <GerantLayout title="Mon portefeuille" onLogout={onLogout}>
      <div className="max-w-5xl space-y-6">

        {message && (
          <p className="p-3 rounded-[8px] bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 font-semibold">
            {message}
          </p>
        )}

        {/* SOLDES */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-vert-principal text-white rounded-[12px] p-5 space-y-2">
            <p className="flex items-center gap-2 text-xs font-bold uppercase opacity-90"><Wallet size={14} /> Solde disponible</p>
            <p className="text-2xl font-black">{fcfa(portefeuille.solde_disponible)}</p>
            <p className="text-xs opacity-80">Peut être retiré maintenant</p>
          </div>
          <div className="bg-white rounded-[12px] border border-gray-200 p-5 space-y-2">
            <p className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500"><Clock size={14} /> À venir</p>
            <p className="text-2xl font-black text-gray-900">{fcfa(portefeuille.a_venir)}</p>
            <p className="text-xs text-gray-500">Avances des matchs dans plus de 24h (encore remboursables au joueur)</p>
          </div>
          <div className="bg-white rounded-[12px] border border-gray-200 p-5 space-y-2">
            <p className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500"><Send size={14} /> Déjà reçu</p>
            <p className="text-2xl font-black text-gray-900">{fcfa(portefeuille.total_verse)}</p>
            <p className="text-xs text-gray-500">
              {portefeuille.en_cours_de_versement > 0
                ? `${fcfa(portefeuille.en_cours_de_versement)} en cours de versement`
                : 'Total versé sur votre numéro'}
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* NUMÉRO DE RETRAIT */}
          <section className="bg-white rounded-[12px] border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-black text-vert-principal">Où recevoir votre argent</h3>

            {numeroEnregistre && !modifierNumero ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-[8px] bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-800">
                    <span className="font-bold">{libelleOperateur}</span> · +221 {numeroEnregistre.numero.slice(3)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setModifierNumero(true)}
                  className="text-sm font-bold text-vert-principal hover:underline cursor-pointer"
                >
                  Changer de numéro
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnregistrerNumero} className="space-y-4">
                {!numeroEnregistre && (
                  <div className="flex items-start gap-3 p-4 rounded-[8px] bg-amber-50 border border-amber-200">
                    <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      Indiquez votre numéro Wave ou Orange Money pour pouvoir retirer votre argent.
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  {OPERATEURS.map((o) => (
                    <button
                      key={o.valeur}
                      type="button"
                      onClick={() => setOperateur(o.valeur)}
                      className={`flex-1 px-4 py-2.5 rounded-[8px] text-sm font-bold border transition-colors cursor-pointer ${
                        operateur === o.valeur
                          ? 'bg-vert-principal text-white border-vert-principal'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {o.libelle}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Numéro {OPERATEURS.find((o) => o.valeur === operateur).libelle}</label>
                  <div className={`flex items-stretch border rounded-[8px] overflow-hidden focus-within:border-vert-principal ${erreurNumero ? 'border-red-500' : 'border-gray-200'}`}>
                    <span className="flex items-center px-3 text-sm font-bold text-gray-500 bg-gray-50 border-r border-gray-200">+221</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={numero}
                      onChange={(e) => {
                        setNumero(nettoyerTelephone(e.target.value));
                        setErreurNumero('');
                      }}
                      placeholder="77 000 00 00"
                      className="w-full px-3 py-2.5 text-sm outline-none"
                    />
                  </div>
                  {erreurNumero && <p className="text-[11px] text-red-600 font-semibold">{erreurNumero}</p>}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={enregistrementNumero}
                    className="bg-vert-principal text-white font-bold text-sm px-6 py-3 rounded-[8px] hover:bg-vert-survol transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {enregistrementNumero ? 'Enregistrement...' : 'Enregistrer le numéro'}
                  </button>
                  {numeroEnregistre && (
                    <button
                      type="button"
                      onClick={() => {
                        appliquer(portefeuille);
                        setModifierNumero(false);
                        setErreurNumero('');
                      }}
                      className="text-sm font-bold text-gray-600 px-4 py-3 rounded-[8px] hover:bg-gray-100 cursor-pointer"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            )}
          </section>

          {/* RETRAIT */}
          <section className="bg-white rounded-[12px] border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-black text-vert-principal">Retirer de l'argent</h3>

            {retraitEnAttente ? (
              <p className="text-sm text-gray-600">
                Un retrait est en cours de versement. Vous pourrez en demander un nouveau une fois qu'il sera reçu.
              </p>
            ) : (
              <form onSubmit={handleRetrait} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Montant (FCFA)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={portefeuille.montant_retrait_minimum}
                      max={portefeuille.solde_disponible}
                      value={montant}
                      onChange={(e) => {
                        setMontant(e.target.value);
                        setErreurRetrait('');
                      }}
                      disabled={!peutRetirer}
                      className={`w-full border rounded-[8px] px-3 py-2.5 text-sm outline-none disabled:bg-gray-50 ${
                        erreurRetrait ? 'border-red-500' : 'border-gray-200 focus:border-vert-principal'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setMontant(String(portefeuille.solde_disponible))}
                      disabled={!peutRetirer}
                      className="shrink-0 px-4 rounded-[8px] border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                    >
                      Tout
                    </button>
                  </div>
                  {erreurRetrait && <p className="text-[11px] text-red-600 font-semibold">{erreurRetrait}</p>}
                  <p className="text-[11px] text-gray-500">
                    Minimum {fcfa(portefeuille.montant_retrait_minimum)}.
                    {numeroEnregistre ? ` Envoyé sur votre ${libelleOperateur} +221 ${numeroEnregistre.numero.slice(3)}.` : ''}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!peutRetirer || retraitEnCours}
                  className="w-full bg-dore text-vert-principal font-extrabold text-sm px-6 py-3 rounded-[8px] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                >
                  {retraitEnCours
                    ? 'Demande en cours...'
                    : !numeroEnregistre
                    ? 'Ajoutez d\'abord votre numéro'
                    : peutRetirer
                    ? 'Retirer'
                    : 'Solde insuffisant'}
                </button>
              </form>
            )}
          </section>
        </div>

        {/* HISTORIQUE DES RETRAITS */}
        <section className="bg-white rounded-[12px] border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-black text-vert-principal">Historique des retraits</h3>
          {portefeuille.retraits.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun retrait pour le moment.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {portefeuille.retraits.map((retrait) => (
                <li key={retrait.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold text-gray-900">{fcfa(retrait.montant)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(retrait.cree_le).toLocaleDateString('fr-FR')} · {retrait.operateur_libelle} +221 {retrait.numero.slice(3)}
                      {retrait.statut === 'echoue' && retrait.motif_echec ? ` · ${retrait.motif_echec}` : ''}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUTS_RETRAIT[retrait.statut].classe}`}>
                    {STATUTS_RETRAIT[retrait.statut].libelle}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </GerantLayout>
  );
}
