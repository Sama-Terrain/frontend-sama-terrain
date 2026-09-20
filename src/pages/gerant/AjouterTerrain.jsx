import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Info,
  SlidersHorizontal,
  ListChecks,
  ImageIcon,
  AlignLeft,
  UploadCloud,
  Check,
  ChevronRight,
} from 'lucide-react';
import GerantLayout from '../../components/gerant/GerantLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { VILLES } from '../../utils/villes';
import { EQUIPEMENTS_DISPONIBLES } from '../../utils/equipements';
import Alert from '../../components/ui/Alert';
import { terrainService } from '../../services/terrainService';

const TYPES_TERRAIN = ['Foot à 5', 'Foot à 6', 'Foot à 7', 'Foot à 11'];
const SURFACES = ['Synthétique', 'Gazon naturel', 'Bitume'];

// En-tête réutilisé pour chaque section du formulaire (icône + titre)
function SectionTitle({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-7 h-7 rounded-full bg-vert-clair text-vert-principal flex items-center justify-center shrink-0">
        <Icon size={16} />
      </span>
      <h3 className="text-sm font-extrabold text-vert-principal">{children}</h3>
    </div>
  );
}

// Champ select stylé de façon cohérente avec les Input du projet
function SelectField({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-gray-800">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full border border-gray-200 rounded-[8px] px-4 py-3 text-xs font-semibold text-gray-900 outline-none bg-white focus:border-vert-principal cursor-pointer"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

export default function AjouterTerrain({ onLogout }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const modeEdition = Boolean(id);

  const [form, setForm] = useState({
    nom: '',
    type: TYPES_TERRAIN[0],
    ville: VILLES[0],
    adresse: '',
    capacite: '',
    surface: SURFACES[0],
    prixHeure: '',
    heureOuverture: '08:00',
    heureFermeture: '23:00',
    equipements: ['Vestiaires', 'Éclairage nocturne', 'Douches'],
    description: '',
  });
  const [photos, setPhotos] = useState([]);
  const [chargementTerrain, setChargementTerrain] = useState(modeEdition);

  // En mode édition, on pré-remplit le formulaire avec le terrain existant.
  useEffect(() => {
    if (!modeEdition) return;

    async function chargerTerrain() {
      try {
        const terrain = await terrainService.getTerrainDetailGerant(id);
        setForm({
          nom: terrain.nom,
          type: terrain.type,
          ville: terrain.ville,
          adresse: terrain.adresse,
          capacite: terrain.capacite,
          surface: terrain.surface,
          prixHeure: terrain.prix_heure,
          heureOuverture: terrain.heure_ouverture?.slice(0, 5) || '08:00',
          heureFermeture: terrain.heure_fermeture?.slice(0, 5) || '23:00',
          equipements: terrain.equipements,
          description: terrain.description,
        });
      } catch (error) {
        console.error('Erreur chargement terrain à modifier:', error);
      } finally {
        setChargementTerrain(false);
      }
    }
    chargerTerrain();
  }, [id, modeEdition]);

  const handleField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEquipement = (equipement) => {
    setForm((prev) => ({
      ...prev,
      equipements: prev.equipements.includes(equipement)
        ? prev.equipements.filter((item) => item !== equipement)
        : [...prev.equipements, equipement],
    }));
  };

  const [erreur, setErreur] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const TYPES_PHOTO_ACCEPTES = ['image/png', 'image/jpeg'];
  const TAILLE_MAX_PHOTO = 10 * 1024 * 1024; // 10 Mo

  const handlePhotosSelect = (fileList) => {
    if (!fileList) return;

    const fichiersValides = [];
    let messageErreur = '';
    for (const fichier of Array.from(fileList)) {
      if (!TYPES_PHOTO_ACCEPTES.includes(fichier.type)) {
        messageErreur = 'Seules les images PNG ou JPEG sont acceptées.';
      } else if (fichier.size > TAILLE_MAX_PHOTO) {
        messageErreur = 'Chaque photo doit faire moins de 10 Mo.';
      } else {
        fichiersValides.push(fichier);
      }
    }

    setErreur(messageErreur);
    setPhotos((prev) => [...prev, ...fichiersValides].slice(0, 8));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');

    const capacite = Number(form.capacite);
    if (!Number.isInteger(capacite) || capacite < 2 || capacite > 30) {
      setErreur('La capacité doit être un nombre entier entre 2 et 30 joueurs.');
      return;
    }

    const prixHeure = Number(form.prixHeure);
    if (!Number.isFinite(prixHeure) || prixHeure < 500) {
      setErreur('Le prix par heure doit être au moins 500 FCFA.');
      return;
    }

    setEnvoiEnCours(true);

    const resultat = modeEdition
      ? await terrainService.modifierTerrain(id, { ...form, photos })
      : await terrainService.creerTerrain({ ...form, photos });

    setEnvoiEnCours(false);

    if (!resultat.success) {
      setErreur(resultat.error);
      return;
    }

    navigate(modeEdition ? `/gerant/terrains/${id}` : '/gerant/terrains');
  };

  if (chargementTerrain) {
    return (
      <GerantLayout title="Mes terrains" onLogout={onLogout}>
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-bold">Chargement du terrain...</p>
        </div>
      </GerantLayout>
    );
  }

  return (
    <GerantLayout title="Mes terrains" onLogout={onLogout}>

      {/* FIL D'ARIANE */}
      <div className="flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => navigate('/gerant/terrains')}
          className="text-gray-500 hover:text-vert-principal font-semibold cursor-pointer"
        >
          Terrains
        </button>
        <ChevronRight size={14} className="text-gray-400" />
        <span className="font-extrabold text-gray-900">
          {modeEdition ? 'Modifier le terrain' : 'Ajouter un terrain'}
        </span>
      </div>

      {/* CARTE FORMULAIRE */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[12px] border border-gray-200/80 shadow-2xs divide-y divide-gray-100"
      >

        {/* EN-TÊTE */}
        <div className="p-6 sm:p-8 space-y-1">
          <h2 className="text-lg sm:text-xl font-black text-gray-900">Ajouter un nouveau terrain</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Renseignez les informations de votre terrain pour le publier sur SAMA-TERRAIN
          </p>
        </div>

        {/* SECTION 1 : INFORMATIONS GÉNÉRALES */}
        <div className="p-6 sm:p-8 space-y-5">
          <SectionTitle icon={Info}>Informations générales</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Nom du terrain"
              placeholder="Ex : Elite Arena"
              value={form.nom}
              onChange={(e) => handleField('nom', e.target.value)}
            />
            <SelectField
              label="Type de terrain"
              value={form.type}
              onChange={(e) => handleField('type', e.target.value)}
              options={TYPES_TERRAIN}
            />
            <SelectField
              label="Ville"
              value={form.ville}
              onChange={(e) => handleField('ville', e.target.value)}
              options={VILLES}
            />
            <Input
              label="Adresse complète"
              placeholder="Ex : Route de Ouakam, Dakar"
              value={form.adresse}
              onChange={(e) => handleField('adresse', e.target.value)}
            />
          </div>
        </div>

        {/* SECTION 2 : CARACTÉRISTIQUES */}
        <div className="p-6 sm:p-8 space-y-5">
          <SectionTitle icon={SlidersHorizontal}>Caractéristiques</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Capacité (joueurs)"
              type="number"
              min={2}
              max={30}
              placeholder="Ex : 10"
              value={form.capacite}
              onChange={(e) => handleField('capacite', e.target.value)}
            />
            <SelectField
              label="Surface"
              value={form.surface}
              onChange={(e) => handleField('surface', e.target.value)}
              options={SURFACES}
            />
            <Input
              label="Prix par heure (FCFA)"
              type="number"
              min={500}
              step={500}
              placeholder="Ex : 15 000"
              value={form.prixHeure}
              onChange={(e) => handleField('prixHeure', e.target.value)}
            />
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium text-gray-800">Horaires d'ouverture</label>
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={form.heureOuverture}
                  onChange={(e) => handleField('heureOuverture', e.target.value)}
                  className="w-full border border-gray-200 rounded-[8px] px-4 py-3 text-xs font-semibold text-gray-900 outline-none focus:border-vert-principal"
                />
                <span className="text-xs text-gray-500 shrink-0">à</span>
                <input
                  type="time"
                  value={form.heureFermeture}
                  onChange={(e) => handleField('heureFermeture', e.target.value)}
                  className="w-full border border-gray-200 rounded-[8px] px-4 py-3 text-xs font-semibold text-gray-900 outline-none focus:border-vert-principal"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3 : ÉQUIPEMENTS */}
        <div className="p-6 sm:p-8 space-y-5">
          <SectionTitle icon={ListChecks}>Équipements</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {EQUIPEMENTS_DISPONIBLES.map((equipement) => {
              const checked = form.equipements.includes(equipement);
              return (
                <button
                  key={equipement}
                  type="button"
                  onClick={() => toggleEquipement(equipement)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-[8px] border text-xs font-semibold transition-colors cursor-pointer ${
                    checked
                      ? 'border-vert-principal bg-vert-clair/40 text-gray-900'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-[4px] flex items-center justify-center shrink-0 ${
                      checked ? 'bg-vert-principal text-white' : 'border border-gray-300'
                    }`}
                  >
                    {checked && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span>{equipement}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 : PHOTOS */}
        <div className="p-6 sm:p-8 space-y-5">
          <SectionTitle icon={ImageIcon}>Photos du terrain</SectionTitle>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handlePhotosSelect(e.dataTransfer.files);
            }}
            className="relative border-2 border-dashed border-gray-300 rounded-[12px] py-12 px-6 text-center space-y-3 hover:bg-gray-50/60 transition-colors cursor-pointer"
          >
            <input
              type="file"
              accept="image/png,image/jpeg"
              multiple
              onChange={(e) => handlePhotosSelect(e.target.files)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="w-11 h-11 rounded-full bg-vert-principal text-white flex items-center justify-center mx-auto">
              <UploadCloud size={20} />
            </div>
            <p className="text-sm font-bold text-gray-800">
              Glissez vos photos ici ou cliquez pour parcourir
            </p>
            <p className="text-xs text-gray-400">PNG, JPG jusqu'à 10 Mo (max 8 photos)</p>
            {photos.length > 0 && (
              <p className="text-xs font-bold text-emerald-700">
                {photos.length} photo{photos.length > 1 ? 's' : ''} sélectionnée{photos.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* SECTION 5 : DESCRIPTION */}
        <div className="p-6 sm:p-8 space-y-5">
          <SectionTitle icon={AlignLeft}>Description</SectionTitle>
          <textarea
            value={form.description}
            onChange={(e) => handleField('description', e.target.value)}
            placeholder="Décrivez votre terrain, son ambiance, ses atouts..."
            rows={5}
            className="w-full border border-gray-200 rounded-[8px] px-4 py-3 text-xs font-semibold text-gray-900 outline-none focus:border-vert-principal resize-none"
          />
        </div>

        {/* PIED DE FORMULAIRE */}
        <div className="p-6 sm:p-8 space-y-4">
          {erreur && <Alert type="error" message={erreur} />}
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              rounded="8px"
              onClick={() => navigate('/gerant/terrains')}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              rounded="8px"
              disabled={envoiEnCours}
              className="gap-2 w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6"
            >
              <Check size={16} className="shrink-0" />
              <span className="truncate">
                {envoiEnCours
                  ? 'Enregistrement...'
                  : modeEdition
                  ? 'Enregistrer les modifications'
                  : 'Enregistrer le terrain'}
              </span>
            </Button>
          </div>
        </div>

      </form>

    </GerantLayout>
  );
}
