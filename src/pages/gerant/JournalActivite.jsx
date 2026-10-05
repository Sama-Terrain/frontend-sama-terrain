import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QrCode, Banknote, CalendarX, CalendarPlus, CalendarCog, CalendarMinus, UserPlus, UserX, UserCheck, History } from 'lucide-react';
import GerantLayout from '../../components/gerant/GerantLayout';
import { useAuth } from '../../hooks/useAuth';
import { gerantService } from '../../services/gerantService';
import { equipeService } from '../../services/equipeService';

const ACTIONS = {
  ticket_valide: { libelle: 'Tickets validés', Icone: QrCode, classe: 'bg-emerald-100 text-emerald-700' },
  solde_encaisse: { libelle: 'Soldes encaissés', Icone: Banknote, classe: 'bg-amber-100 text-amber-700' },
  reservation_annulee: { libelle: 'Réservations annulées', Icone: CalendarX, classe: 'bg-red-100 text-red-600' },
  creneaux_crees: { libelle: 'Créneaux créés', Icone: CalendarPlus, classe: 'bg-sky-100 text-sky-700' },
  creneaux_modifies: { libelle: 'Créneaux modifiés', Icone: CalendarCog, classe: 'bg-sky-100 text-sky-700' },
  creneaux_supprimes: { libelle: 'Créneaux supprimés', Icone: CalendarMinus, classe: 'bg-sky-100 text-sky-700' },
  employe_ajoute: { libelle: 'Employé ajouté', Icone: UserPlus, classe: 'bg-violet-100 text-violet-700' },
  employe_desactive: { libelle: 'Employé désactivé', Icone: UserX, classe: 'bg-gray-100 text-gray-600' },
  employe_reactive: { libelle: 'Employé réactivé', Icone: UserCheck, classe: 'bg-violet-100 text-violet-700' },
};

const libelleJour = (date) => {
  const aujourdhui = new Date();
  const hier = new Date();
  hier.setDate(aujourdhui.getDate() - 1);
  if (date.toDateString() === aujourdhui.toDateString()) return "Aujourd'hui";
  if (date.toDateString() === hier.toDateString()) return 'Hier';
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

/**
 * Page Journal d'activité (Espace Gérant, propriétaire uniquement)
 *
 * Qui a fait quoi dans l'équipe : tickets validés, soldes encaissés,
 * annulations, créneaux et tarifs modifiés... Filtrable par personne
 * (?auteur=ID dans l'URL, utilisé depuis la page "Mon équipe") et par action.
 */
export default function JournalActivite({ onLogout }) {
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const auteur = searchParams.get('auteur') || '';
  const action = searchParams.get('action') || '';

  const [profile, setProfile] = useState(null);
  const [employes, setEmployes] = useState([]);
  const [journal, setJournal] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    Promise.all([gerantService.getGerantProfile(), equipeService.getEmployes()])
      .then(([profileData, employesData]) => {
        setProfile(profileData);
        setEmployes(employesData);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let actif = true;
    equipeService.getJournal({ auteur, action })
      .then((data) => {
        if (!actif) return;
        setJournal(data);
        setErreur('');
      })
      .catch(() => actif && setErreur("Impossible de charger le journal d'activité."))
      .finally(() => actif && setChargement(false));
    return () => {
      actif = false;
    };
  }, [auteur, action]);

  const changerFiltre = (cle, valeur) => {
    const suivants = { auteur, action, [cle]: valeur };
    setSearchParams(Object.fromEntries(Object.entries(suivants).filter(([, v]) => v)));
  };

  // Regroupe les lignes par jour pour une lecture plus facile.
  const parJour = useMemo(() => {
    const groupes = [];
    journal.forEach((ligne) => {
      const jour = libelleJour(ligne.date);
      const dernier = groupes[groupes.length - 1];
      if (dernier && dernier.jour === jour) dernier.lignes.push(ligne);
      else groupes.push({ jour, lignes: [ligne] });
    });
    return groupes;
  }, [journal]);

  const classeSelect = 'border border-gray-200 rounded-[8px] px-3 py-2.5 text-sm font-semibold text-gray-900 bg-white outline-none focus:border-vert-principal cursor-pointer';

  return (
    <GerantLayout title="Journal d'activité" profile={profile} onLogout={onLogout}>

      {/* FILTRES */}
      <section className="bg-white rounded-[12px] border border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row gap-3 sm:items-center">
        <p className="text-sm font-bold text-gray-700 shrink-0">Filtrer :</p>
        <select value={auteur} onChange={(e) => changerFiltre('auteur', e.target.value)} className={classeSelect} aria-label="Filtrer par personne">
          <option value="">Toute l'équipe</option>
          {currentUser && <option value={String(currentUser.id)}>Moi ({currentUser.prenom} {currentUser.nom})</option>}
          {employes.map((e) => (
            <option key={e.id} value={String(e.id)}>{e.nomComplet}{e.actif ? '' : ' (désactivé)'}</option>
          ))}
        </select>
        <select value={action} onChange={(e) => changerFiltre('action', e.target.value)} className={classeSelect} aria-label="Filtrer par action">
          <option value="">Toutes les actions</option>
          {Object.entries(ACTIONS).map(([valeur, { libelle }]) => (
            <option key={valeur} value={valeur}>{libelle}</option>
          ))}
        </select>
      </section>

      {/* LIGNES DU JOURNAL */}
      <section className="bg-white rounded-[12px] border border-gray-200">
        {chargement ? (
          <p className="px-6 py-10 text-center text-sm text-gray-500">Chargement...</p>
        ) : erreur ? (
          <p className="px-6 py-10 text-center text-sm text-red-600">{erreur}</p>
        ) : journal.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <History size={24} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-semibold">Aucune activité pour ces filtres.</p>
          </div>
        ) : (
          parJour.map(({ jour, lignes }) => (
            <div key={jour}>
              <h3 className="px-5 sm:px-6 py-2.5 bg-gray-50 border-y border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500 first-letter:uppercase">
                {jour}
              </h3>
              <ul className="divide-y divide-gray-50">
                {lignes.map((ligne) => {
                  const { Icone, classe } = ACTIONS[ligne.action] || ACTIONS.ticket_valide;
                  const estMoi = currentUser && ligne.auteurId === currentUser.id;
                  return (
                    <li key={ligne.id} className="px-5 sm:px-6 py-3 flex items-start gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${classe}`}>
                        <Icone size={15} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-bold">{estMoi ? 'Vous' : ligne.auteurNom}</span>
                          <span className="text-gray-400"> · </span>
                          {ligne.description}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {ligne.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </section>

    </GerantLayout>
  );
}
