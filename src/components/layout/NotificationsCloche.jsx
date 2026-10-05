import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, CalendarCheck, CalendarX, Star, Wallet, AlertTriangle, MapPin, UserPlus, BadgeCheck, BellOff,
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';

// Rafraîchissement automatique, pour voir arriver les nouvelles
// notifications sans recharger la page.
const INTERVALLE_RAFRAICHISSEMENT_MS = 60 * 1000;

const ICONES = {
  reservation: { Icone: CalendarCheck, classe: 'bg-emerald-100 text-emerald-700' },
  annulation: { Icone: CalendarX, classe: 'bg-red-100 text-red-600' },
  avis: { Icone: Star, classe: 'bg-amber-100 text-amber-700' },
  retrait: { Icone: Wallet, classe: 'bg-sky-100 text-sky-700' },
  abonnement: { Icone: BadgeCheck, classe: 'bg-vert-clair text-vert-principal' },
  alerte: { Icone: AlertTriangle, classe: 'bg-orange-100 text-orange-600' },
  terrain: { Icone: MapPin, classe: 'bg-vert-clair text-vert-principal' },
  inscription: { Icone: UserPlus, classe: 'bg-violet-100 text-violet-700' },
};

function tempsEcoule(dateIso) {
  const minutes = Math.floor((Date.now() - new Date(dateIso).getTime()) / 60000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  const heures = Math.floor(minutes / 60);
  if (heures < 24) return `Il y a ${heures} h`;
  const jours = Math.floor(heures / 24);
  return `Il y a ${jours} jour${jours > 1 ? 's' : ''}`;
}

/**
 * Composant NotificationsCloche
 * Cloche des en-têtes gérant et admin : badge du nombre de notifications non
 * lues, et panneau déroulant listant les notifications au clic. Cliquer une
 * notification la marque comme lue et ouvre la page concernée.
 */
export default function NotificationsCloche() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [nonLues, setNonLues] = useState(0);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(false);
  const [ouvert, setOuvert] = useState(false);

  const charger = useCallback(async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications);
      setNonLues(data.non_lues);
      setErreur(false);
    } catch {
      setErreur(true);
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    // Premier chargement différé au tick suivant (pas de setState synchrone
    // dans l'effet), puis rafraîchissement régulier.
    const premierChargement = setTimeout(charger, 0);
    const intervalle = setInterval(charger, INTERVALLE_RAFRAICHISSEMENT_MS);
    return () => {
      clearTimeout(premierChargement);
      clearInterval(intervalle);
    };
  }, [charger]);

  const basculer = () => {
    if (!ouvert) charger();
    setOuvert(!ouvert);
  };

  const ouvrirNotification = async (notification) => {
    setOuvert(false);
    if (!notification.lue) {
      setNotifications((liste) => liste.map((n) => (n.id === notification.id ? { ...n, lue: true } : n)));
      setNonLues((n) => Math.max(0, n - 1));
      notificationService.marquerLue(notification.id).catch(() => {});
    }
    if (notification.lien) navigate(notification.lien);
  };

  const toutMarquerLu = async () => {
    setNotifications((liste) => liste.map((n) => ({ ...n, lue: true })));
    setNonLues(0);
    try {
      await notificationService.toutMarquerLu();
    } catch {
      charger();
    }
  };

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={basculer}
        aria-expanded={ouvert}
        aria-label={nonLues > 0 ? `Notifications (${nonLues} non lues)` : 'Notifications'}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#ebf5f1] border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all cursor-pointer relative shadow-2xs"
      >
        <Bell size={18} className="sm:w-5 sm:h-5" />
        {nonLues > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
            {nonLues > 9 ? '9+' : nonLues}
          </span>
        )}
      </button>

      {ouvert && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOuvert(false)} />
          <div className="absolute right-0 mt-2 w-[340px] max-w-[calc(100vw-24px)] bg-white rounded-[10px] border border-gray-200 shadow-xl z-50 text-left overflow-hidden">
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-extrabold text-gray-900">
                Notifications
                {nonLues > 0 && <span className="ml-2 text-[11px] font-bold text-red-600">{nonLues} non lue{nonLues > 1 ? 's' : ''}</span>}
              </p>
              {nonLues > 0 && (
                <button
                  type="button"
                  onClick={toutMarquerLu}
                  className="text-[11px] font-bold text-vert-principal hover:underline cursor-pointer"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>

            <div className="max-h-[420px] overflow-y-auto">
              {chargement ? (
                <p className="px-4 py-8 text-center text-xs text-gray-500">Chargement...</p>
              ) : erreur && notifications.length === 0 ? (
                <p className="px-4 py-8 text-center text-xs text-red-600">Impossible de charger les notifications.</p>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-10 text-center text-gray-500">
                  <BellOff size={22} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-xs font-semibold">Aucune notification pour le moment.</p>
                </div>
              ) : (
                <ul>
                  {notifications.map((notification) => {
                    const { Icone, classe } = ICONES[notification.type] || ICONES.alerte;
                    return (
                      <li key={notification.id}>
                        <button
                          type="button"
                          onClick={() => ouvrirNotification(notification)}
                          className={`w-full flex gap-3 px-4 py-3 text-left border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${notification.lue ? '' : 'bg-emerald-50/50'}`}
                        >
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${classe}`}>
                            <Icone size={15} />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="flex items-center gap-1.5">
                              <span className={`text-[13px] text-gray-900 ${notification.lue ? 'font-semibold' : 'font-bold'}`}>
                                {notification.titre}
                              </span>
                              {!notification.lue && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />}
                            </span>
                            <span className="block text-xs text-gray-600 leading-snug mt-0.5">{notification.message}</span>
                            <span className="block text-[11px] text-gray-400 mt-1">{tempsEcoule(notification.cree_le)}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
