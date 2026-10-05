import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ShieldCheck, ShieldOff, Mail, History, Info, X } from 'lucide-react';
import GerantLayout from '../../components/gerant/GerantLayout';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import { gerantService } from '../../services/gerantService';
import { equipeService } from '../../services/equipeService';
import { nettoyerTelephone, estNumeroSenegalaisValide } from '../../utils/telephone';
import { validerTexteObligatoire, validerEmail } from '../../utils/validation';

const FORMULAIRE_VIDE = { prenom: '', nom: '', email: '', telephone: '' };

function BadgeStatut({ employe }) {
  if (!employe.actif) {
    return <span className="inline-flex rounded-[4px] px-2 py-1 text-[11px] font-bold bg-gray-100 text-gray-600">Désactivé</span>;
  }
  if (!employe.invitationAcceptee) {
    return <span className="inline-flex rounded-[4px] px-2 py-1 text-[11px] font-bold bg-amber-100 text-amber-800">Invitation envoyée</span>;
  }
  return <span className="inline-flex rounded-[4px] px-2 py-1 text-[11px] font-bold bg-emerald-100 text-emerald-700">Actif</span>;
}

/**
 * Page Mon équipe (Espace Gérant, propriétaire uniquement)
 *
 * Le gérant ajoute ses employés (gestionnaires sur place, caissiers...). Chacun
 * a son propre compte : il choisit lui-même son mot de passe grâce à
 * l'invitation reçue par email. Le gérant peut le désactiver à tout moment ;
 * ses actions restent visibles dans le journal d'activité.
 */
export default function Equipe({ onLogout }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [employes, setEmployes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreurChargement, setErreurChargement] = useState('');

  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [formulaire, setFormulaire] = useState(FORMULAIRE_VIDE);
  const [erreursChamps, setErreursChamps] = useState({});
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const [message, setMessage] = useState(null); // { type, texte }
  const [actionEnCours, setActionEnCours] = useState(null);

  useEffect(() => {
    Promise.all([gerantService.getGerantProfile(), equipeService.getEmployes()])
      .then(([profileData, employesData]) => {
        setProfile(profileData);
        setEmployes(employesData);
      })
      .catch(() => setErreurChargement("Impossible de charger votre équipe."))
      .finally(() => setChargement(false));
  }, []);

  const changerChamp = (champ, valeur) => {
    setFormulaire((precedent) => ({ ...precedent, [champ]: valeur }));
    setErreursChamps((precedent) => (precedent[champ] ? { ...precedent, [champ]: '' } : precedent));
  };

  const remplacerEmploye = (employe) =>
    setEmployes((liste) => liste.map((e) => (e.id === employe.id ? employe : e)));

  const handleAjouter = async (e) => {
    e.preventDefault();
    setMessage(null);

    const erreurs = {
      prenom: validerTexteObligatoire(formulaire.prenom, 'Le prénom'),
      nom: validerTexteObligatoire(formulaire.nom, 'Le nom'),
      email: validerEmail(formulaire.email),
      telephone: formulaire.telephone && !estNumeroSenegalaisValide(formulaire.telephone)
        ? 'Numéro de téléphone invalide.'
        : '',
    };
    if (Object.values(erreurs).some(Boolean)) {
      setErreursChamps(erreurs);
      return;
    }

    setEnvoiEnCours(true);
    const resultat = await equipeService.ajouterEmploye(formulaire);
    setEnvoiEnCours(false);

    if (!resultat.success) {
      setErreursChamps(resultat.erreursChamps || {});
      if (!Object.keys(resultat.erreursChamps || {}).length) setMessage({ type: 'error', texte: resultat.error });
      return;
    }

    setEmployes((liste) => [resultat.employe, ...liste]);
    setFormulaire(FORMULAIRE_VIDE);
    setFormulaireOuvert(false);
    setMessage({
      type: 'success',
      texte: `${resultat.employe.nomComplet} a été ajouté(e). Une invitation lui a été envoyée à ${resultat.employe.email} pour choisir son mot de passe.`,
    });
  };

  const handleChangerStatut = async (employe) => {
    const nouvelEtat = !employe.actif;
    if (!nouvelEtat && !window.confirm(`Désactiver ${employe.nomComplet} ? Il ne pourra plus se connecter, même s'il est déjà connecté.`)) return;

    setActionEnCours(employe.id);
    const resultat = await equipeService.changerStatut(employe.id, nouvelEtat);
    setActionEnCours(null);

    if (!resultat.success) {
      setMessage({ type: 'error', texte: resultat.error });
      return;
    }
    remplacerEmploye(resultat.employe);
    setMessage({
      type: 'success',
      texte: `${employe.nomComplet} a été ${nouvelEtat ? 'réactivé(e)' : 'désactivé(e)'}.`,
    });
  };

  const handleRenvoyerInvitation = async (employe) => {
    setActionEnCours(employe.id);
    const resultat = await equipeService.renvoyerInvitation(employe.id);
    setActionEnCours(null);
    setMessage(resultat.success
      ? { type: 'success', texte: `Invitation renvoyée à ${employe.email}.` }
      : { type: 'error', texte: resultat.error });
  };

  return (
    <GerantLayout title="Mon équipe" profile={profile} onLogout={onLogout}>

      {/* EXPLICATION DES DROITS */}
      <section className="bg-white rounded-[12px] border border-gray-200 p-5 flex gap-3">
        <Info size={18} className="text-vert-principal shrink-0 mt-0.5" />
        <div className="text-sm text-gray-600 leading-relaxed space-y-1">
          <p>
            Chaque employé a <strong className="text-gray-900">son propre compte</strong> : plus besoin de partager votre mot de passe.
            Vous voyez dans le <button type="button" onClick={() => navigate('/gerant/journal')} className="font-bold text-vert-principal hover:underline cursor-pointer">journal d'activité</button> qui
            a validé un ticket, encaissé un solde ou modifié des créneaux.
          </p>
          <p>
            <strong className="text-gray-900">Ils peuvent :</strong> voir les réservations, scanner les tickets, gérer les créneaux et tarifs.{' '}
            <strong className="text-gray-900">Ils ne peuvent pas :</strong> voir vos revenus et statistiques, retirer de l'argent, gérer l'abonnement ou l'équipe.
          </p>
        </div>
      </section>

      {message && <Alert type={message.type} message={message.texte} onClose={() => setMessage(null)} />}

      {/* AJOUT D'UN EMPLOYÉ */}
      <section className="bg-white rounded-[12px] border border-gray-200 p-5 sm:p-6">
        {formulaireOuvert ? (
          <form onSubmit={handleAjouter} className="space-y-4" noValidate>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-vert-principal">Ajouter un employé</h3>
              <button
                type="button"
                onClick={() => setFormulaireOuvert(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer"
                aria-label="Fermer le formulaire"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Prénom *" value={formulaire.prenom} onChange={(e) => changerChamp('prenom', e.target.value)} errorMessage={erreursChamps.prenom} />
              <Input label="Nom *" value={formulaire.nom} onChange={(e) => changerChamp('nom', e.target.value)} errorMessage={erreursChamps.nom} />
              <Input label="Email *" type="email" value={formulaire.email} onChange={(e) => changerChamp('email', e.target.value)} errorMessage={erreursChamps.email} placeholder="employe@exemple.com" />
              <Input
                label="Téléphone (facultatif)"
                type="tel"
                inputMode="numeric"
                value={formulaire.telephone}
                onChange={(e) => changerChamp('telephone', nettoyerTelephone(e.target.value))}
                errorMessage={erreursChamps.telephone}
                placeholder="77 123 45 67"
              />
            </div>
            <p className="text-xs text-gray-500">
              Un email d'invitation lui sera envoyé : il choisira lui-même son mot de passe. Vous ne le connaîtrez jamais.
            </p>
            <button
              type="submit"
              disabled={envoiEnCours}
              className="bg-vert-principal text-white font-bold text-sm px-6 py-3 rounded-[8px] hover:bg-vert-survol transition-colors cursor-pointer disabled:opacity-50"
            >
              {envoiEnCours ? 'Envoi...' : "Ajouter et envoyer l'invitation"}
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setFormulaireOuvert(true)}
            className="inline-flex items-center gap-2 bg-vert-principal text-white font-bold text-sm px-5 py-3 rounded-[8px] hover:bg-vert-survol transition-colors cursor-pointer"
          >
            <UserPlus size={16} /> Ajouter un employé
          </button>
        )}
      </section>

      {/* LISTE DES EMPLOYÉS */}
      <section className="bg-white rounded-[12px] border border-gray-200">
        <h3 className="px-5 sm:px-6 py-4 border-b border-gray-100 text-base font-black text-gray-900">
          Employés ({employes.length})
        </h3>

        {chargement ? (
          <p className="px-6 py-10 text-center text-sm text-gray-500">Chargement...</p>
        ) : erreurChargement ? (
          <p className="px-6 py-10 text-center text-sm text-red-600">{erreurChargement}</p>
        ) : employes.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-gray-500">
            Aucun employé pour le moment. Ajoutez la personne qui gère votre terrain au quotidien.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {employes.map((employe) => (
              <li key={employe.id} className="px-5 sm:px-6 py-4 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${employe.actif ? 'bg-dore text-vert-principal' : 'bg-gray-200 text-gray-500'}`}>
                    {employe.initiales}
                  </span>
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-gray-900">
                      {employe.nomComplet} <BadgeStatut employe={employe} />
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {employe.email}{employe.telephone ? ` · +${employe.telephone}` : ''}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Ajouté le {employe.ajouteLe}
                      {employe.derniereConnexion ? ` · Dernière connexion : ${employe.derniereConnexion}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/gerant/journal?auteur=${employe.id}`)}
                    className="inline-flex items-center gap-1.5 rounded-[8px] border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <History size={14} /> Son activité
                  </button>
                  {employe.actif && !employe.invitationAcceptee && (
                    <button
                      type="button"
                      disabled={actionEnCours === employe.id}
                      onClick={() => handleRenvoyerInvitation(employe)}
                      className="inline-flex items-center gap-1.5 rounded-[8px] border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                    >
                      <Mail size={14} /> Renvoyer l'invitation
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={actionEnCours === employe.id}
                    onClick={() => handleChangerStatut(employe)}
                    className={`inline-flex items-center gap-1.5 rounded-[8px] px-3 py-2 text-xs font-bold cursor-pointer disabled:opacity-50 ${
                      employe.actif
                        ? 'border border-red-200 text-red-600 hover:bg-red-50'
                        : 'bg-vert-principal text-white hover:bg-vert-survol'
                    }`}
                  >
                    {employe.actif ? <><ShieldOff size={14} /> Désactiver</> : <><ShieldCheck size={14} /> Réactiver</>}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

    </GerantLayout>
  );
}
