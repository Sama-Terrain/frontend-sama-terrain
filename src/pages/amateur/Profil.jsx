import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { VILLES } from '../../utils/villes';

const ONGLETS = ['Informations personnelles', 'Sécurité', 'Notifications'];

/**
 * Page Profil (Espace Amateur)
 *
 * Permet à l'amateur connecté de consulter et modifier ses informations
 * personnelles. "Sécurité" et "Notifications" ne sont pas encore
 * implémentées : on l'affiche clairement plutôt que de faire semblant.
 */
export default function Profil() {
  const navigate = useNavigate();
  const { currentUser, login, logout } = useAuth();
  const [ongletActif, setOngletActif] = useState(ONGLETS[0]);

  const [prenom, setPrenom] = useState(currentUser.prenom || '');
  const [nom, setNom] = useState(currentUser.nom || '');
  const [telephone, setTelephone] = useState(currentUser.telephone || '');
  const [villePreferee, setVillePreferee] = useState(currentUser.ville_preferee || '');

  const [chargement, setChargement] = useState(false);
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  const membreDepuis = currentUser.date_joined
    ? new Date(currentUser.date_joined).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
    : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErreur('');
    setChargement(true);

    const resultat = await authService.modifierProfil({
      prenom,
      nom,
      telephone,
      ville_preferee: villePreferee,
    });

    setChargement(false);

    if (!resultat.success) {
      setErreur(resultat.error);
      return;
    }

    // Met à jour l'utilisateur connecté partout dans l'app (Navbar, etc.)
    login(resultat.user);
    setMessage('Profil mis à jour avec succès.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-20 font-sans">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* CARTE DE GAUCHE : APERÇU DU PROFIL */}
        <div className="bg-white rounded-[12px] border border-gray-200 p-6 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-vert-clair text-vert-principal font-black text-2xl flex items-center justify-center mx-auto">
            {currentUser.initiales}
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900">{currentUser.prenom} {currentUser.nom}</h2>
            <p className="text-sm text-gray-500">{currentUser.email}</p>
          </div>
          {membreDepuis && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 border-t border-gray-100 pt-4">
              <Calendar size={13} />
              <span>Membre depuis : {membreDepuis}</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 rounded-[8px] py-2.5 cursor-pointer"
          >
            <LogOut size={14} />
            <span>Se déconnecter</span>
          </button>
        </div>

        {/* COLONNE DE DROITE */}
        <div className="lg:col-span-2 space-y-4">

          {/* ONGLETS */}
          <div className="flex gap-2 bg-white rounded-[10px] border border-gray-200 p-1.5 w-fit">
            {ONGLETS.map((onglet) => (
              <button
                key={onglet}
                type="button"
                onClick={() => setOngletActif(onglet)}
                className={`px-4 py-2 rounded-[8px] text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                  ongletActif === onglet
                    ? 'bg-vert-principal text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {onglet}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-[12px] border border-gray-200 p-6 sm:p-8">
            {ongletActif !== 'Informations personnelles' ? (
              <p className="text-sm text-gray-500">Fonctionnalité à venir.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-lg font-black text-vert-principal">Informations personnelles</h3>

                {message && <p className="text-sm text-emerald-600 font-semibold">{message}</p>}
                {erreur && <p className="text-sm text-red-600 font-semibold">{erreur}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Prénom</label>
                    <input
                      type="text"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      className="w-full border border-gray-200 rounded-[8px] px-3 py-2.5 text-sm outline-none focus:border-vert-principal"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Nom</label>
                    <input
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="w-full border border-gray-200 rounded-[8px] px-3 py-2.5 text-sm outline-none focus:border-vert-principal"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Email</label>
                    <input
                      type="email"
                      value={currentUser.email}
                      disabled
                      className="w-full border border-gray-200 rounded-[8px] px-3 py-2.5 text-sm bg-gray-50 text-gray-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Téléphone</label>
                    <input
                      type="tel"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      placeholder="+221 77 000 00 00"
                      className="w-full border border-gray-200 rounded-[8px] px-3 py-2.5 text-sm outline-none focus:border-vert-principal"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-gray-700">Ville préférée</label>
                    <select
                      value={villePreferee}
                      onChange={(e) => setVillePreferee(e.target.value)}
                      className="w-full border border-gray-200 rounded-[8px] px-3 py-2.5 text-sm outline-none focus:border-vert-principal cursor-pointer"
                    >
                      <option value="">Non renseignée</option>
                      {VILLES.map((ville) => (
                        <option key={ville} value={ville}>{ville}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={chargement}
                  className="bg-vert-principal text-white font-bold text-sm px-6 py-3 rounded-[8px] hover:bg-vert-survol transition-colors cursor-pointer disabled:opacity-50"
                >
                  {chargement ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
