import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Star, Calendar as CalendarIcon, Clock, CheckCircle2, AlertTriangle, X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { terrainService } from '../../services/terrainService';
import { avisService } from '../../services/avisService';
import { creneauService } from '../../services/creneauService';
import { reservationService } from '../../services/reservationService';
import { nettoyerTelephone, estNumeroSenegalaisValide } from '../../utils/telephone';
import { ICONES_EQUIPEMENTS } from '../../utils/equipements';
import CarteTerrain from '../../components/terrain/CarteTerrain';

export default function DetailTerrain({ currentUser }) {
  const { id } = useParams();
  const terrainId = Number(id);
  const navigate = useNavigate();

  const [terrain, setTerrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Date du jour au format YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const todayStr = getTodayString();

  // Génération dynamique des 7 prochains jours à partir d'aujourd'hui
  const generateUpcomingDays = () => {
    const days = [];
    const today = new Date();
    const joursNoms = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const moisNoms = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = joursNoms[d.getDay()];
      const dayNum = d.getDate();
      const monthName = moisNoms[d.getMonth()];

      days.push({
        id: dateStr,
        jour: i === 0 ? 'Aujourd\'hui' : dayName,
        date: `${dayNum} ${monthName}`
      });
    }
    return days;
  };

  const joursSemaine = generateUpcomingDays();

  // Date et créneau éventuellement proposés par l'assistant IA (lien du
  // chatbot : /terrains/:id?date=AAAA-MM-JJ&creneau=ID). Ils sont seulement
  // présélectionnés : l'amateur vérifie, complète et confirme lui-même.
  const [searchParams] = useSearchParams();
  const dateSuggeree = searchParams.get('date');
  const creneauSuggereId = Number(searchParams.get('creneau')) || null;
  const suggestionAppliquee = useRef(false);
  const [infoSuggestion, setInfoSuggestion] = useState('');

  // État de sélection Date & Créneau (Initialisé sur aujourd'hui, ou sur la
  // date proposée par l'assistant si elle est valide et pas encore passée)
  const [selectedDate, setSelectedDate] = useState(
    dateSuggeree && /^\d{4}-\d{2}-\d{2}$/.test(dateSuggeree) && dateSuggeree >= todayStr
      ? dateSuggeree
      : todayStr
  );
  // Plusieurs créneaux peuvent être sélectionnés ensemble (ex: 18h ET 19h
  // le même jour), pour être réservés et payés en une seule fois.
  const [selectedCreneaux, setSelectedCreneaux] = useState([]);

  // Coordonnées utilisateur (Placeholders)
  const [nomComplet, setNomComplet] = useState('');
  // On ne stocke que les 9 chiffres locaux : l'indicatif +221 est fixe et
  // ajouté au moment de l'envoi (voir telephoneComplet plus bas). Utile
  // pour WhatsApp/N8n, qui exigent un numéro au format international.
  const [telephone, setTelephone] = useState('');
  const telephoneComplet = telephone ? `221${telephone}` : '';
  const [avance, setAvance] = useState('');

  // Avis clients du terrain
  const [avisList, setAvisList] = useState([]);
  const [showAvisModal, setShowAvisModal] = useState(false);
  const [newAvisNote, setNewAvisNote] = useState(5);
  const [newAvisTexte, setNewAvisTexte] = useState('');
  const [envoiAvisEnCours, setEnvoiAvisEnCours] = useState(false);
  const [erreurAvis, setErreurAvis] = useState('');

  // Réservation (déjà jouée, confirmée, pas encore notée) permettant à
  // l'amateur connecté de laisser un avis sur CE terrain, s'il en a une.
  const [reservationPourAvis, setReservationPourAvis] = useState(null);

  useEffect(() => {
    // Rien à chercher si personne n'est connecté : reservationPourAvis
    // reste à sa valeur initiale (null).
    if (!currentUser) return;

    async function chercherReservationNotable() {
      try {
        const mesReservations = await reservationService.getUserReservations();
        const candidates = mesReservations.filter(
          (r) => r.terrainId === terrainId && (r.statut === 'confirmee' || r.statut === 'terminee')
        );

        for (const candidate of candidates) {
          const possible = await avisService.avisPossible(candidate.id);
          if (possible) {
            setReservationPourAvis(candidate);
            return;
          }
        }
        setReservationPourAvis(null);
      } catch (error) {
        console.error('Erreur vérification avis possible :', error);
        setReservationPourAvis(null);
      }
    }
    chercherReservationNotable();
  }, [currentUser, terrainId]);

  // Créneaux horaires du terrain, rechargés à chaque changement de date.
  const [creneauxHoraires, setCreneauxHoraires] = useState([]);
  const [loadingCreneaux, setLoadingCreneaux] = useState(false);

  useEffect(() => {
    // Rien à charger si aucune date n'est sélectionnée (cas rare : le champ
    // date a toujours une valeur par défaut à l'ouverture de la page).
    if (!selectedDate) return;

    async function chargerCreneaux() {
      try {
        setLoadingCreneaux(true);
        const data = await creneauService.getCreneauxByTerrainAndDate(terrainId, selectedDate);
        setCreneauxHoraires(data);

        // Une seule fois, au premier chargement : on présélectionne le
        // créneau proposé par l'assistant s'il est toujours disponible.
        if (creneauSuggereId && !suggestionAppliquee.current) {
          suggestionAppliquee.current = true;
          const suggere = data.find((c) => c.id === creneauSuggereId && c.disponible);
          if (suggere) {
            setSelectedCreneaux([suggere]);
            setInfoSuggestion("Créneau proposé par l'assistant : vérifiez-le, complétez vos informations puis confirmez votre réservation.");
          } else {
            setInfoSuggestion("Le créneau proposé par l'assistant n'est plus disponible. Choisissez un autre horaire ci-dessous.");
          }
        }
      } catch (error) {
        console.error('Erreur chargement créneaux :', error);
        setCreneauxHoraires([]);
      } finally {
        setLoadingCreneaux(false);
      }
    }
    chargerCreneaux();
  }, [terrainId, selectedDate, creneauSuggereId]);

  // Chargement du terrain et des avis
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [terrainData, avisData] = await Promise.all([
          terrainService.getTerrainById(terrainId),
          avisService.getAvisJoueurs(terrainId)
        ]);

        // Si le terrain n'existe pas (mauvais id, terrain supprimé...), on
        // ne doit jamais afficher un terrain inventé à la place : `terrain`
        // reste `null` et l'écran "Terrain introuvable" prend le relais.
        setTerrain(terrainData);

        setAvisList(avisData || []);
      } catch (error) {
        console.error('Erreur chargement données :', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [terrainId]);

  // Handler d'ajout d'un avis : lié à la réservation détectée comme éligible.
  const handleAddAvis = async (e) => {
    e.preventDefault();
    if (!reservationPourAvis) return;

    setErreurAvis('');
    setEnvoiAvisEnCours(true);

    const resultat = await avisService.creerAvis({
      reservationId: reservationPourAvis.id,
      note: newAvisNote,
      commentaire: newAvisTexte,
    });

    setEnvoiAvisEnCours(false);

    if (!resultat.success) {
      setErreurAvis(resultat.error);
      return;
    }

    setAvisList([resultat.avis, ...avisList]);
    // Un avis par réservation : celle-ci n'est plus disponible pour en
    // laisser un nouveau sur ce terrain (à moins d'y rejouer un jour).
    setReservationPourAvis(null);
    setNewAvisNote(5);
    setNewAvisTexte('');
    setShowAvisModal(false);
  };

  // Vérifier si la date sélectionnée est passée (antérieure à aujourd'hui)
  const isPastDate = selectedDate && selectedDate < todayStr;

  // Conditions d'affichage & Validation
  const hasChosenDateAndSlot = Boolean(selectedDate && !isPastDate && selectedCreneaux.length > 0);
  const avanceNum = Number(avance) || 0;

  const MONTANT_AVANCE_MINIMUM = 10000;
  // Prix total de TOUS les créneaux sélectionnés (un seul ou plusieurs, ex:
  // 18h ET 19h le même jour) : l'avance et le reste à payer portent sur
  // l'ensemble, pas sur un seul créneau.
  const currentPrix = selectedCreneaux.length > 0
    ? selectedCreneaux.reduce((total, c) => total + c.prix, 0)
    : (terrain?.prixHeure || 30000);

  const isFormComplete = Boolean(
    selectedDate &&
    !isPastDate &&
    selectedCreneaux.length > 0 &&
    nomComplet.trim() !== '' &&
    estNumeroSenegalaisValide(telephone) &&
    avanceNum > MONTANT_AVANCE_MINIMUM &&
    avanceNum < currentPrix
  );

  const resteAPayer = Math.max(0, currentPrix - avanceNum);

  const [erreurReservation, setErreurReservation] = useState('');
  const [creationEnCours, setCreationEnCours] = useState(false);

  const handleReserverSlot = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!isFormComplete) return;

    setErreurReservation('');
    setCreationEnCours(true);

    try {
      // On crée réellement les réservations en base (une par créneau,
      // regroupées dans une Commande) : ça bloque chaque créneau
      // ("en_attente") pour que personne d'autre ne puisse le réserver
      // pendant que l'amateur va payer son avance sur PayTech.
      const { commandeId } = await reservationService.creerReservationGroupe({
        creneauIds: selectedCreneaux.map((c) => c.id),
        nomComplet,
        telephone: telephoneComplet,
        montantAvance: avanceNum,
      });

      const reservationData = {
        terrain: terrain || [],
        date: selectedDate,
        creneaux: selectedCreneaux,
        nomComplet,
        telephone: telephoneComplet,
        avance: avanceNum,
        resteSurPlace: resteAPayer,
        // Id de la Commande backend : nécessaire à Paiement.jsx pour
        // démarrer le paiement PayTech de CE groupe de créneaux précis.
        commandeId,
      };

      // On transmet les infos de la réservation à la page de paiement via la
      // navigation (state), sans passer par un state global : la page Paiement
      // les lira avec useLocation().
      navigate('/paiement', { state: reservationData });
    } catch (error) {
      setErreurReservation(
        error.response?.data?.creneaux?.[0] ||
        error.response?.data?.montant_avance?.[0] ||
        error.response?.data?.detail ||
        "Impossible de réserver ce(s) créneau(x). Il(s) a/ont peut-être déjà été pris, veuillez réessayer."
      );
      // Un créneau a peut-être été pris entre-temps par quelqu'un d'autre :
      // on recharge la liste pour refléter son vrai statut.
      const data = await creneauService.getCreneauxByTerrainAndDate(terrainId, selectedDate);
      setCreneauxHoraires(data);
      setSelectedCreneaux([]);
    } finally {
      setCreationEnCours(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 text-center">
        <div className="w-12 h-12 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-semibold text-sm">Chargement du terrain...</p>
      </div>
    );
  }

  if (!terrain) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 text-center space-y-4">
        <AlertTriangle size={40} className="text-amber-500 mx-auto" />
        <p className="text-gray-700 font-bold">Ce terrain est introuvable ou n'existe plus.</p>
        <Button onClick={() => navigate('/terrains')} variant="primary" size="md" rounded="8px">
          Voir les terrains disponibles
        </Button>
      </div>
    );
  }

  // Vraies photos du terrain (uploadées par le gérant). On retombe sur
  // l'unique `terrain.image` seulement si aucune photo n'a été ajoutée.
  const photosGalerie = terrain.photos?.length > 0
    ? terrain.photos.map((p) => p.image)
    : terrain.image
      ? [terrain.image]
      : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-20 font-sans text-left">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* BREADCRUMB */}
        <nav className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
          <button onClick={() => navigate('/')} className="hover:text-vert-principal cursor-pointer">
            Accueil
          </button>
          <span>/</span>
          <button onClick={() => navigate('/terrains')} className="hover:text-vert-principal cursor-pointer">
            Terrains
          </button>
          <span>/</span>
          <span className="font-bold text-vert-principal">{terrain?.nom || 'Complexe Keur Madior'}</span>
        </nav>

        {/* GALERIE PHOTOS : les vraies photos du terrain, cliquables (plein écran) */}
        {photosGalerie.length === 0 ? (
          <div className="h-72 sm:h-96 w-full rounded-[8px] bg-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400">
            <Images size={32} />
            <p className="text-xs font-semibold">Aucune photo pour ce terrain</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-[8px] overflow-hidden">
            <button
              type="button"
              onClick={() => setLightboxIndex(0)}
              className="md:col-span-2 h-72 sm:h-96 w-full overflow-hidden bg-gray-200 cursor-pointer"
            >
              <img
                src={photosGalerie[0]}
                alt={terrain.nom}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </button>

            <div className="grid grid-rows-2 gap-4 h-72 sm:h-96">
              {[1, 2].map((index) => {
                const photo = photosGalerie[index];
                if (!photo) {
                  return <div key={index} className="h-full w-full rounded-[8px] bg-gray-100" />;
                }
                const dernieresCachees = index === 2 && photosGalerie.length > 3;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    className="relative h-full w-full overflow-hidden rounded-[8px] bg-gray-200 cursor-pointer"
                  >
                    <img
                      src={photo}
                      alt={`${terrain.nom} - photo ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    {dernieresCachees && (
                      <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-sm">
                        +{photosGalerie.length - 3} photos
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* VISIONNEUSE PLEIN ÉCRAN */}
        {lightboxIndex !== null && (
          <div
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Fermer"
              className="absolute top-4 right-4 text-white/80 hover:text-white cursor-pointer"
            >
              <X size={28} />
            </button>

            {photosGalerie.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) => (i - 1 + photosGalerie.length) % photosGalerie.length);
                }}
                aria-label="Photo précédente"
                className="absolute left-4 sm:left-6 text-white/80 hover:text-white cursor-pointer"
              >
                <ChevronLeft size={36} />
              </button>
            )}

            <img
              src={photosGalerie[lightboxIndex]}
              alt={`${terrain.nom} - photo ${lightboxIndex + 1}`}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[85vh] object-contain rounded-[8px]"
            />

            {photosGalerie.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) => (i + 1) % photosGalerie.length);
                }}
                aria-label="Photo suivante"
                className="absolute right-4 sm:right-6 text-white/80 hover:text-white cursor-pointer"
              >
                <ChevronRight size={36} />
              </button>
            )}

            {photosGalerie.length > 1 && (
              <span className="absolute bottom-4 text-white/70 text-xs font-semibold">
                {lightboxIndex + 1} / {photosGalerie.length}
              </span>
            )}
          </div>
        )}

        {/* LAYOUT PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* COLONNE GAUCHE */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* EN-TÊTE DU TERRAIN */}
            <div className="bg-white rounded-[8px] p-6 border border-gray-200 space-y-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {terrain?.nom || 'Complexe Keur Madior'}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin size={15} className="text-gray-400" />
                  <span>{terrain?.localisation || 'Almadies, Dakar'}</span>
                </div>

                <div className="flex items-center space-x-1 text-amber-400">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < Math.round(terrain?.note || 0)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                  <span className="font-bold text-gray-800 ml-1">{(terrain?.note || 0).toFixed(1)}</span>
                  <span className="text-gray-400">({avisList.length} avis)</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  terrain?.surface,
                  terrain?.type,
                  terrain?.nombrePortions > 1 ? `Divisible en ${terrain.nombrePortions} portions` : null,
                ]
                  .filter(Boolean)
                  .map((badge) => (
                  <Badge
                    key={badge}
                    statut="disponible"
                    className="px-3 py-1 font-semibold"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>

              {/* Équipements choisis par le gérant à l'ajout du terrain */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-2">Équipements</h3>
                {terrain?.equipements?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {terrain.equipements.map((equipement) => {
                      const Icone = ICONES_EQUIPEMENTS[equipement];
                      return (
                        <span
                          key={equipement}
                          className="inline-flex items-center gap-1.5 rounded-full bg-vert-clair text-vert-principal px-3.5 py-1.5 text-xs font-bold"
                        >
                          {Icone && <Icone size={13} />}
                          <span>{equipement}</span>
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Aucun équipement renseigné pour ce terrain.</p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {terrain?.description}
                </p>
              </div>
            </div>

            {/* SELECTION DE DISPONIBILITÉS */}
            <div className="bg-white rounded-[8px] p-6 border border-gray-200 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-gray-900">Disponibilités</h3>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 font-semibold">Choisir une date :</span>
                  <input
                    type="date"
                    min={todayStr}
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedCreneaux([]);
                    }}
                    className="bg-gray-50 border border-gray-200 rounded-[8px] px-3 py-1.5 text-xs font-bold text-vert-principal focus:outline-none focus:border-vert-principal cursor-pointer"
                  />
                </div>
              </div>

              {/* SÉLECTEUR RAPIDE DES 7 PROCHAINS JOURS A PARTIR D'AUJOURD'HUI */}
              <div className="grid grid-cols-7 gap-2">
                {joursSemaine.map((item) => {
                  const isSelected = selectedDate === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedDate(item.id);
                        setSelectedCreneaux([]);
                      }}
                      className={`p-3 rounded-[8px] text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-vert-principal text-white font-bold shadow-sm'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium'
                      }`}
                    >
                      <span className="text-[11px] opacity-80">{item.jour}</span>
                      <span className="text-xs font-black mt-0.5">{item.date}</span>
                    </button>
                  );
                })}
              </div>

              {/* MESSAGE SI LA DATE SELECTIONNEE EST PASSÉE */}
              {isPastDate ? (
                <div className="p-4 bg-red-50 rounded-[8px] border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle size={18} className="shrink-0 text-red-500" />
                  <span>
                    Impossible de réserver pour une date passée. Veuillez choisir la date d'aujourd'hui ou une date ultérieure.
                  </span>
                </div>
              ) : !selectedDate ? (
                <div className="p-4 bg-amber-50 rounded-[8px] border border-amber-200 text-amber-800 text-xs font-medium">
                  Veuillez d'abord cliquer sur un jour ci-dessus pour afficher les créneaux disponibles.
                </div>
              ) : loadingCreneaux ? (
                <div className="py-8 text-center">
                  <div className="w-8 h-8 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : creneauxHoraires.length === 0 ? (
                <div className="p-4 bg-gray-50 rounded-[8px] border border-gray-200 text-gray-600 text-xs font-medium">
                  Aucun créneau configuré par le gérant pour cette date.
                </div>
              ) : (
                /* CRÉNEAUX HORAIRES DISPONIBLES */
                <div className="space-y-3 pt-4 border-t border-gray-100">

                  {infoSuggestion && (
                    <div className="p-3 bg-vert-clair rounded-[8px] border border-vert-principal/30 text-vert-principal text-xs font-medium">
                      {infoSuggestion}
                    </div>
                  )}

                  {/* Titre */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-700 uppercase">
                      Créneaux disponibles
                    </h4>

                    <span className="text-[10px] font-medium text-gray-400">
                      {selectedDate}
                    </span>
                  </div>

                  {/* Terrain divisible : on explique la règle au joueur */}
                  {terrain?.nombrePortions > 1 && (
                    <p className="text-[11px] text-gray-500">
                      Ce terrain peut être loué en entier ou par portion. Le terrain complet n'est
                      disponible que si toutes ses portions sont libres à cette heure.
                    </p>
                  )}

                  {/* Créneaux */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">

                    {creneauxHoraires.map((slot) => {

                      const isSelected = selectedCreneaux.some((c) => c.id === slot.id);

                      /* Créneau indisponible */
                      if (!slot.disponible) {
                        return (
                          <div
                            key={slot.id}
                            className="
                              min-h-[64px]
                              px-2.5 py-2
                              rounded-xl
                              bg-gray-100
                              text-gray-400
                              text-center
                              border border-gray-200
                              opacity-60
                              cursor-not-allowed
                              flex
                              flex-col
                              items-center
                              justify-center
                            "
                          >
                            <p className="text-xs font-bold line-through">
                              {slot.heure}
                            </p>

                            {slot.libellePortion && (
                              <p className="text-[10px] font-semibold mt-0.5">{slot.libellePortion}</p>
                            )}

                            <p className="text-[10px] mt-1">
                              {slot.prix.toLocaleString()} FCFA
                            </p>

                            <span className="text-[9px] mt-0.5">
                              Indisponible
                            </span>
                          </div>
                        );
                      }

                      /* Créneau disponible */
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => {
                            setSelectedCreneaux((prev) => {
                              if (isSelected) return prev.filter((c) => c.id !== slot.id);

                              // Le terrain complet et une de ses portions, à la même heure,
                              // occupent la même surface : choisir l'un retire l'autre.
                              const sansConflit = prev.filter(
                                (c) => c.heure_debut !== slot.heure_debut || (c.portion !== 0 && slot.portion !== 0)
                              );
                              return [...sansConflit, slot];
                            });
                          }}
                          className={`
                            min-h-[64px]
                            px-2.5 py-2
                            rounded-xl
                            text-center
                            border
                            transition-all
                            duration-200
                            active:scale-[0.97]
                            flex
                            flex-col
                            items-center
                            justify-center
                            ${
                              isSelected
                                ? `
                                  bg-vert-principal
                                  text-white
                                  border-vert-principal
                                  shadow-md
                                `
                                : `
                                  bg-white
                                  text-gray-800
                                  border-gray-200
                                  hover:border-vert-principal
                                  hover:bg-gray-50
                                `
                            }
                          `}
                        >
                          {/* Heure */}
                          <p className="text-sm font-extrabold leading-none">
                            {slot.heure}
                          </p>

                          {/* Partie du terrain (terrain divisible uniquement) */}
                          {slot.libellePortion && (
                            <p className={`text-[10px] font-bold mt-1 ${isSelected ? 'text-white' : 'text-vert-principal'}`}>
                              {slot.libellePortion}
                            </p>
                          )}

                          {/* Prix */}
                          <p
                            className={`
                              text-[10px]
                              font-medium
                              mt-1.5
                              ${
                                isSelected
                                  ? "text-emerald-100"
                                  : "text-gray-500"
                              }
                            `}
                          >
                            {slot.prix.toLocaleString()} FCFA
                          </p>

                          {/* Sélection */}
                          {isSelected && (
                            <span className="text-[9px] font-bold mt-1">
                              Sélectionné ✓
                            </span>
                          )}
                        </button>
                      );
                    })}

                  </div>
                </div>
              )}

            </div>

            {/* VOS COORDONNÉES ET AVANCE (ACCESSIBLES SEULEMENT POUR UNE DATE VALIDE + CRÉNEAU SÉLECTIONNÉ) */}
            {hasChosenDateAndSlot && (
              <>
                <div className="bg-white rounded-[8px] p-6 border border-gray-200 space-y-4 animate-in fade-in duration-200">
                  <h3 className="text-sm font-bold text-gray-900">Vos coordonnées</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600">Nom complet</label>
                      <input
                        type="text"
                        value={nomComplet}
                        onChange={(e) => setNomComplet(e.target.value)}
                        placeholder="Assane Ndong FALL"
                        className="w-full bg-gray-50 border border-gray-200 rounded-[8px] px-4 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-vert-principal"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600">Numéro de Téléphone</label>
                      <div className="flex items-stretch bg-gray-50 border border-gray-200 rounded-[8px] focus-within:border-vert-principal overflow-hidden">
                        <span className="flex items-center px-3 text-xs font-bold text-gray-500 bg-gray-100 border-r border-gray-200">
                          +221
                        </span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          value={telephone}
                          onChange={(e) => setTelephone(nettoyerTelephone(e.target.value))}
                          placeholder="77 000 00 00"
                          className="w-full bg-transparent px-3 py-2.5 text-xs font-bold text-gray-900 focus:outline-none"
                        />
                      </div>
                      {telephone.length === 9 && !estNumeroSenegalaisValide(telephone) && (
                        <p className="text-[11px] text-red-600 font-semibold">
                          Numéro invalide (préfixe attendu : 70, 75, 76, 77 ou 78).
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[8px] p-6 border border-gray-200 space-y-3 animate-in fade-in duration-200">
                  <h3 className="text-sm font-bold text-gray-900">
                    Montant de l'avance <span className="text-xs text-gray-400 font-normal">(supérieur à 10 000 FCFA)</span>
                  </h3>

                  <div className="relative max-w-md">
                    <input
                      type="number"
                      value={avance}
                      onChange={(e) => setAvance(e.target.value)}
                      placeholder="15 000 (FCFA)"
                      className="w-full bg-gray-50 border border-gray-200 rounded-[8px] px-4 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-vert-principal"
                    />
                    <span className="absolute right-4 top-2.5 text-xs font-bold text-gray-400">FCFA</span>
                  </div>

                  {avance !== '' && avanceNum <= MONTANT_AVANCE_MINIMUM && (
                    <p className="text-xs font-semibold text-red-600">
                      L'avance doit être strictement supérieure à 10 000 FCFA.
                    </p>
                  )}

                  {avance !== '' && avanceNum >= currentPrix && (
                    <p className="text-xs font-semibold text-red-600">
                      L'avance ne peut pas dépasser le prix total {selectedCreneaux.length > 1 ? 'des créneaux' : 'du créneau'} ({currentPrix.toLocaleString()} FCFA).
                    </p>
                  )}

                  {avanceNum > MONTANT_AVANCE_MINIMUM && avanceNum < currentPrix && (
                    <p className="text-xs font-semibold text-gray-500">
                      Reste à payer sur place : <span className="text-vert-principal font-bold">{resteAPayer.toLocaleString()} FCFA</span>
                    </p>
                  )}

                  {erreurReservation && (
                    <div className="p-3 bg-red-50 rounded-[8px] border border-red-200 text-red-700 text-xs font-bold">
                      {erreurReservation}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* AVIS DES CLIENTS */}
            <div className="bg-white rounded-[8px] p-6 border border-gray-200 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-gray-900">Avis des clients</h3>
                <Button
                  onClick={() => {
                    if (!currentUser) {
                      navigate('/login');
                    } else if (!reservationPourAvis) {
                      setErreurAvis(
                        "Vous devez avoir joué un match confirmé sur ce terrain (et pas déjà laissé d'avis) pour pouvoir en laisser un."
                      );
                    } else {
                      setErreurAvis('');
                      setShowAvisModal(true);
                    }
                  }}
                  variant="primary"
                  size="sm"
                  rounded="8px"
                >
                  Laisser un avis
                </Button>
              </div>

              {erreurAvis && !showAvisModal && (
                <div className="p-3 bg-amber-50 rounded-[8px] border border-amber-200 text-amber-800 text-xs font-semibold">
                  {erreurAvis}
                </div>
              )}

              <div className="space-y-4">
                {avisList.length === 0 && (
                  <p className="text-xs text-gray-500">Aucun avis pour le moment.</p>
                )}
                {avisList.map((avis) => (
                  <div key={avis.id} className="p-4 bg-gray-50 rounded-[8px] border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-vert-principal text-white font-bold text-xs flex items-center justify-center">
                          {avis.initiales}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">{avis.nom}</h4>
                          <div className="flex text-amber-400 mt-0.5">
                            {[...Array(avis.note)].map((_, i) => (
                              <span key={i} className="text-xs">★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] text-gray-400">{avis.date || 'Recente'}</span>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed pl-11">
                      {avis.commentaire}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* COLONNE DROITE : RECAPITULATIF STICKY */}
          <div className="space-y-6 sticky top-24">
            
            <div className="bg-white rounded-[8px] p-4 border border-gray-200 space-y-3">
              <h4 className="text-xs font-bold text-gray-900 uppercase">Localisation du terrain</h4>
              {/* Position GPS exacte si le gérant l'a indiquée, sinon carte par adresse */}
              <CarteTerrain
                latitude={terrain?.latitude}
                longitude={terrain?.longitude}
                adresse={terrain?.adresse}
                ville={terrain?.ville}
              />
              <p className="text-[11px] text-gray-500 flex items-center gap-1">
                <MapPin size={12} className="shrink-0 text-vert-principal" />
                <span>{terrain?.adresse}, {terrain?.ville}</span>
              </p>
            </div>

            <div className="bg-white rounded-[8px] p-6 border border-gray-200 space-y-5">
              <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3">
                Récapitulatif de votre match
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center space-x-2 text-gray-700">
                  <CheckCircle2 size={16} className="text-vert-principal shrink-0" />
                  <span className="font-bold">{terrain?.nom || 'Complexe Keur Madior'}</span>
                </div>

                <div className="flex items-center space-x-2 text-gray-700">
                  <CalendarIcon size={16} className="text-vert-principal shrink-0" />
                  <span>
                    {isPastDate
                      ? 'Date passée non valide'
                      : selectedDate
                      ? `Date : ${selectedDate}`
                      : 'Veuillez choisir une date'}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-gray-700">
                  <Clock size={16} className="text-vert-principal shrink-0" />
                  <span>
                    {selectedCreneaux.length === 0
                      ? 'Veuillez choisir un créneau'
                      : selectedCreneaux.length === 1
                      ? `${selectedCreneaux[0].heure} (1 Heure)`
                      : `${selectedCreneaux.length} créneaux : ${selectedCreneaux.map((c) => c.heure).join(', ')}`}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-gray-100 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Location terrain</span>
                  <span className="font-bold text-gray-900">{currentPrix.toLocaleString()} FCFA</span>
                </div>

                {avanceNum > 0 && (
                  <div className="flex justify-between items-center p-2.5 bg-vert-clair rounded-[8px] text-vert-principal font-bold">
                    <span>Avance à payer</span>
                    <span>{avanceNum.toLocaleString()} FCFA</span>
                  </div>
                )}

                <div className="flex justify-between pt-2 text-sm font-extrabold text-gray-900">
                  <span>Total à payer sur place</span>
                  <span className="text-vert-principal">{resteAPayer.toLocaleString()} FCFA</span>
                </div>
              </div>

              <Button
                onClick={handleReserverSlot}
                disabled={!isFormComplete || creationEnCours}
                variant="gold"
                size="md"
                rounded="8px"
                fullWidth
                className="font-extrabold"
              >
                {creationEnCours
                  ? 'Réservation en cours...'
                  : isFormComplete
                  ? 'Réserver ce créneau'
                  : isPastDate
                  ? 'Réservation impossible pour date passée'
                  : 'Complétez les informations pour réserver'}
              </Button>
            </div>

          </div>

        </div>

      </div>

      {/* MODAL AVIS (100% FIDÈLE À LA MAQUETTE FIGMA) */}
      {showAvisModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[8px] p-6 sm:p-8 max-w-lg w-full space-y-6 relative animate-in zoom-in-95 duration-200 text-left">
            
            {/* EN-TÊTE MODAL (Titre & Bouton Fermer X) */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-gray-900">
                Votre avis sur {terrain?.nom || ''}
              </h3>
              <button
                type="button"
                onClick={() => setShowAvisModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full cursor-pointer"
                title="Fermer"
              >
                <span className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-500 hover:bg-gray-100">✕</span>
              </button>
            </div>

            <form onSubmit={handleAddAvis} className="space-y-6">
              
              {/* SÉLECTEUR ÉTOILES NOTE GLOBALE */}
              <div className="text-center space-y-2">
                <p className="text-xs font-semibold text-gray-600">Note globale</p>
                
                <div className="flex justify-center items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((starIndex) => (
                    <button
                      key={starIndex}
                      type="button"
                      onClick={() => setNewAvisNote(starIndex)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={
                          starIndex <= newAvisNote
                            ? 'fill-[#c06c11] text-[#c06c11]'
                            : 'text-gray-300'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* CHAMP COMMENTAIRE AVEC COMPTEUR 0/500 */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-gray-900">
                  Décrivez votre expérience <span className="font-normal text-gray-500">(optionnel)</span>
                </label>
                
                <textarea
                  rows="4"
                  maxLength={500}
                  value={newAvisTexte}
                  onChange={(e) => setNewAvisTexte(e.target.value)}
                  placeholder="Terrain en excellent état, équipe d'accueil chaleureuse ! Idéal pour un match amical entre collègues..."
                  className="w-full bg-[#f4f7f6] border border-gray-200/80 rounded-2xl p-4 text-xs font-medium text-gray-800 focus:outline-none focus:border-vert-principal placeholder-gray-400"
                ></textarea>

                {/* Compteur de caractères */}
                <div className="text-right text-[11px] text-gray-400 font-medium">
                  {newAvisTexte.length} / 500
                </div>
              </div>

              {erreurAvis && (
                <div className="p-3 bg-red-50 rounded-[8px] border border-red-200 text-red-700 text-xs font-bold">
                  {erreurAvis}
                </div>
              )}

              {/* BOUTONS D'ACTION (ANNULER CONTOUR VERT & PUBLIER SOLIDE VERT) */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setShowAvisModal(false)}
                  variant="outline"
                  size="sm"
                  rounded="8px"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={envoiAvisEnCours}
                  variant="primary"
                  size="sm"
                  rounded="8px"
                  className="shadow-xs"
                >
                  {envoiAvisEnCours ? 'Envoi...' : 'Publier mon avis'}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
