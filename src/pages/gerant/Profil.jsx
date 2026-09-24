import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import GerantLayout from '../../components/gerant/GerantLayout';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { nettoyerTelephone, estNumeroSenegalaisValide } from '../../utils/telephone';

// Le téléphone est stocké avec l'indicatif (ex: "221770000000") : on
// n'affiche/n'édite que la partie locale à 9 chiffres.
function extraireNumeroLocal(telephoneStocke) {
  const chiffres = (telephoneStocke || '').replace(/\D/g, '');
  return chiffres.startsWith('221') ? chiffres.slice(3) : chiffres.slice(-9);
}

const ONGLETS = ['Informations personnelles', 'Sécurité'];

/**
 * Page GerantProfil (Espace Gérant)
 *
 * Même structure que la page Profil de l'espace amateur : informations
 * personnelles modifiables + changement de mot de passe. Les infos du
 * complexe (nom, quartier, adresse...) restent gérées depuis "Mes terrains".
 */
export default function GerantProfil({ onLogout }) {
  const navigate = useNavigate();
  const { currentUser, login } = useAuth();
  const [ongletActif, setOngletActif] = useState(ONGLETS[0]);

  const [prenom, setPrenom] = useState(currentUser?.prenom || '');
  const [nom, setNom] = useState(currentUser?.nom || '');
  const [telephone, setTelephone] = useState(extraireNumeroLocal(currentUser?.telephone));

  const [chargement, setChargement] = useState(false);
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  const [ancienMotDePasse, setAncienMotDePasse] = useState('');
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('');
  const [chargementMotDePasse, setChargementMotDePasse] = useState(false);
  const [messageMotDePasse, setMessageMotDePasse] = useState('');
  const [erreurMotDePasse, setErreurMotDePasse] = useState('');

  const profileHeader = {
    name: `${currentUser?.prenom || ''} ${currentUser?.nom || ''}`.trim(),
    initials: currentUser?.initiales,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErreur('');

    if (telephone && !estNumeroSenegalaisValide(telephone)) {
      setErreur('Numéro de téléphone invalide (préfixe attendu : 70, 75, 76, 77 ou 78).');
      return;
    }

    setChargement(true);
    const resultat = await authService.modifierProfil({
      prenom,
      nom,
      telephone: telephone ? `221${telephone}` : '',
      ville_preferee: currentUser?.ville_preferee || '',
    });
    setChargement(false);

    if (!resultat.success) {
      setErreur(resultat.error);
      return;
    }

    login(resultat.user);
    setMessage('Profil mis à jour avec succès.');
  };

  const handleChangerMotDePasse = async (e) => {
    e.preventDefault();
    setMessageMotDePasse('');
    setErreurMotDePasse('');

    if (nouveauMotDePasse !== confirmationMotDePasse) {
      setErreurMotDePasse('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setChargementMotDePasse(true);
    const resultat = await authService.changerMotDePasse(ancienMotDePasse, nouveauMotDePasse);
    setChargementMotDePasse(false);

    if (!resultat.success) {
      setErreurMotDePasse(resultat.error);
      return;
    }

    setAncienMotDePasse('');
    setNouveauMotDePasse('');
    setConfirmationMotDePasse('');
    setMessageMotDePasse('Mot de passe modifié avec succès.');
  };

  return (
    <GerantLayout title="Mon profil" profile={profileHeader} onLogout={onLogout}>
      <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* CARTE DE GAUCHE : APERÇU DU PROFIL */}
        <div className="bg-white rounded-[12px] border border-gray-200 p-6 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-dore text-vert-principal font-black text-2xl flex items-center justify-center mx-auto border border-[#b8952b]">
            {currentUser?.initiales}
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900">{currentUser?.prenom} {currentUser?.nom}</h2>
            <p className="text-sm text-gray-500">{currentUser?.email}</p>
          </div>

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
            {ongletActif === 'Informations personnelles' ? (
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
                      value={currentUser?.email || ''}
                      disabled
                      className="w-full border border-gray-200 rounded-[8px] px-3 py-2.5 text-sm bg-gray-50 text-gray-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Téléphone</label>
                    <div className="flex items-stretch border border-gray-200 rounded-[8px] overflow-hidden focus-within:border-vert-principal">
                      <span className="flex items-center px-3 text-sm font-bold text-gray-500 bg-gray-50 border-r border-gray-200">
                        +221
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={telephone}
                        onChange={(e) => setTelephone(nettoyerTelephone(e.target.value))}
                        placeholder="77 000 00 00"
                        className="w-full px-3 py-2.5 text-sm outline-none"
                      />
                    </div>
                    {telephone.length === 9 && !estNumeroSenegalaisValide(telephone) && (
                      <p className="text-[11px] text-red-600 font-semibold">
                        Numéro invalide (préfixe attendu : 70, 75, 76, 77 ou 78).
                      </p>
                    )}
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
            ) : (
              <form onSubmit={handleChangerMotDePasse} className="space-y-5">
                <h3 className="text-lg font-black text-vert-principal">Changer le mot de passe</h3>

                {messageMotDePasse && <p className="text-sm text-emerald-600 font-semibold">{messageMotDePasse}</p>}
                {erreurMotDePasse && <p className="text-sm text-red-600 font-semibold">{erreurMotDePasse}</p>}

                <div className="space-y-4 max-w-sm">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Mot de passe actuel</label>
                    <input
                      type="password"
                      value={ancienMotDePasse}
                      onChange={(e) => setAncienMotDePasse(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-[8px] px-3 py-2.5 text-sm outline-none focus:border-vert-principal"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Nouveau mot de passe</label>
                    <input
                      type="password"
                      value={nouveauMotDePasse}
                      onChange={(e) => setNouveauMotDePasse(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-[8px] px-3 py-2.5 text-sm outline-none focus:border-vert-principal"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Confirmer le nouveau mot de passe</label>
                    <input
                      type="password"
                      value={confirmationMotDePasse}
                      onChange={(e) => setConfirmationMotDePasse(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-[8px] px-3 py-2.5 text-sm outline-none focus:border-vert-principal"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={chargementMotDePasse}
                  className="bg-vert-principal text-white font-bold text-sm px-6 py-3 rounded-[8px] hover:bg-vert-survol transition-colors cursor-pointer disabled:opacity-50"
                >
                  {chargementMotDePasse ? 'Modification...' : 'Modifier le mot de passe'}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </GerantLayout>
  );
}
