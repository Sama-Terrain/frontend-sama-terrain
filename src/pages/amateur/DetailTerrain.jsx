import { useState, useEffect } from 'react';
import { MapPin, Star, Calendar as CalendarIcon, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { terrainService } from '../../services/terrainService';
import { avisService } from '../../services/avisService';
import { MOCK_CRENEAUX } from '../../data/mockCreneaux';

export default function DetailTerrain({ terrainId = 1, onNavigate, onSelectSlot, currentUser }) {
  const [terrain, setTerrain] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // État de sélection Date & Créneau (Initialisé sur aujourd'hui)
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedCreneau, setSelectedCreneau] = useState(null);

  // Coordonnées utilisateur (Placeholders)
  const [nomComplet, setNomComplet] = useState('');
  const [telephone, setTelephone] = useState('');
  const [avance, setAvance] = useState('');

  // Avis clients chargés via le service mock
  const [avisList, setAvisList] = useState([]);
  const [showAvisModal, setShowAvisModal] = useState(false);
  const [newAvisNom, setNewAvisNom] = useState('');
  const [newAvisNote, setNewAvisNote] = useState(5);
  const [newAvisTexte, setNewAvisTexte] = useState('');

  // Créneaux horaires instantanés
  const creneauxHoraires = MOCK_CRENEAUX;

  // Chargement du terrain et des avis
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [terrainData, avisData] = await Promise.all([
          terrainService.getTerrainById(terrainId),
          avisService.getAvisJoueurs()
        ]);

        setTerrain(terrainData || {
          id: 1,
          nom: 'Complexe Keur Madior',
          localisation: 'Almadies, Dakar',
          type: '5v5',
          prixHeure: 30000,
          avance: 15000,
          note: 4.8,
          nombreAvis: 24,
          disponible: true,
          surface: 'Synthétique',
          description: "Le Complexe Keur Madior propose un terrain de mini-foot haut de gamme en plein cœur des Almadies. Doté d'une pelouse synthétique dernière génération importée, d'un éclairage puissant par projecteurs LED pour les matchs nocturnes et de vestiaires propres et modernes. Un parking sécurisé gratuit est également disponible pour nos clients."
        });

        setAvisList(avisData || []);
      } catch (error) {
        console.error('Erreur chargement données :', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [terrainId]);

  // Handler d'ajout d'un avis
  const handleAddAvis = (e) => {
    e.preventDefault();
    if (!newAvisNom.trim() || !newAvisTexte.trim()) return;

    const newEntry = {
      id: Date.now(),
      nom: newAvisNom,
      initiales: newAvisNom.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
      note: Number(newAvisNote),
      date: 'Aujourd\'hui',
      commentaire: newAvisTexte
    };

    setAvisList([newEntry, ...avisList]);
    setNewAvisNom('');
    setNewAvisTexte('');
    setShowAvisModal(false);
  };

  // Vérifier si la date sélectionnée est passée (antérieure à aujourd'hui)
  const isPastDate = selectedDate && selectedDate < todayStr;

  // Conditions d'affichage & Validation
  const hasChosenDateAndSlot = Boolean(selectedDate && !isPastDate && selectedCreneau);
  const avanceNum = Number(avance) || 0;

  const isFormComplete = Boolean(
    selectedDate &&
    !isPastDate &&
    selectedCreneau &&
    nomComplet.trim() !== '' &&
    telephone.trim() !== '' &&
    avanceNum > 0
  );

  const currentPrix = selectedCreneau ? selectedCreneau.prix : (terrain?.prixHeure || 30000);
  const resteAPayer = Math.max(0, currentPrix - avanceNum);

  const handleReserverSlot = () => {
    if (!currentUser) {
      if (onNavigate) onNavigate('login');
      return;
    }

    if (!isFormComplete) return;

    const reservationData = {
      terrain: terrain || [],
      date: selectedDate,
      creneau: selectedCreneau,
      nomComplet,
      telephone,
      avance: avanceNum,
      resteSurPlace: resteAPayer
    };

    if (onSelectSlot) onSelectSlot(reservationData);
    if (onNavigate) onNavigate('reservation', reservationData);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 text-center">
        <div className="w-12 h-12 border-4 border-[#004030] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-semibold text-sm">Chargement du terrain...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-20 font-sans text-left">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* BREADCRUMB */}
        <nav className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
          <button onClick={() => onNavigate && onNavigate('accueil')} className="hover:text-[#004030]">
            Accueil
          </button>
          <span>/</span>
          <button onClick={() => onNavigate && onNavigate('terrains')} className="hover:text-[#004030]">
            Terrains
          </button>
          <span>/</span>
          <span className="font-bold text-[#004030]">{terrain?.nom || 'Complexe Keur Madior'}</span>
        </nav>

        {/* GALERIE PHOTOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl overflow-hidden">
          <div className="md:col-span-2 h-72 sm:h-96 w-full overflow-hidden bg-gray-200">
            <img
              src={terrain?.image}
              alt={terrain?.nom}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="grid grid-rows-2 gap-4 h-72 sm:h-96">
            <div className="h-full w-full overflow-hidden bg-emerald-900 rounded-[8px]">
              <img
                src={terrain?.image}
                alt="Détail pelouse"
                className="w-full h-full object-cover brightness-110 hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="h-full w-full overflow-hidden bg-emerald-800 rounded-[8px]">
              <img
                src={terrain?.image}
                alt="Éclairage terrain"
                className="w-full h-full object-cover contrast-125 hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* LAYOUT PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* COLONNE GAUCHE */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* EN-TÊTE DU TERRAIN */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4">
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
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-gray-800 ml-1">4.8</span>
                  <span className="text-gray-400">({avisList.length} avis)</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {['Synthétique', '5v5', 'Éclairage', 'Vestiaires', 'Parking'].map((badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1 bg-[#e6f4ea] text-[#004030] font-semibold text-xs rounded-full"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {terrain?.description}
                </p>
              </div>
            </div>

            {/* SELECTION DE DISPONIBILITÉS */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-6">
              
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
                      setSelectedCreneau(null);
                    }}
                    className="bg-gray-50 border border-gray-200 rounded-[8px] px-3 py-1.5 text-xs font-bold text-[#004030] focus:outline-none focus:border-[#004030] cursor-pointer"
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
                        setSelectedCreneau(null);
                      }}
                      className={`p-3 rounded-[8px] text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#004030] text-white font-bold shadow-sm'
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
              ) : (
                /* CRÉNEAUX HORAIRES DISPONIBLES */
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-700 uppercase">
                    Créneaux disponibles ({selectedDate})
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {creneauxHoraires.map((slot) => {
                      const isSelected = selectedCreneau?.id === slot.id;
                      if (!slot.disponible) {
                        return (
                          <div
                            key={slot.id}
                            className="p-3 rounded-[8px] bg-gray-100 text-gray-400 text-center border border-gray-200 opacity-60 cursor-not-allowed"
                          >
                            <p className="text-xs font-bold">{slot.heure}</p>
                            <p className="text-[10px] mt-0.5">{slot.prix.toLocaleString()} FCFA</p>
                          </div>
                        );
                      }
                      return (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedCreneau(slot)}
                          className={`p-3 rounded-[8px] text-center border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#004030] text-white border-[#004030] font-bold shadow-sm'
                              : 'bg-white text-gray-800 border-gray-200 hover:border-[#004030]'
                          }`}
                        >
                          <p className="text-xs font-extrabold">{slot.heure}</p>
                          <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-gray-500'}`}>
                            {slot.prix.toLocaleString()} FCFA
                          </p>
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
                <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4 animate-in fade-in duration-200">
                  <h3 className="text-sm font-bold text-gray-900">Vos coordonnées</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600">Nom complet</label>
                      <input
                        type="text"
                        value={nomComplet}
                        onChange={(e) => setNomComplet(e.target.value)}
                        placeholder="Assane Ndong FALL"
                        className="w-full bg-gray-50 border border-gray-200 rounded-[8px] px-4 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#004030]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600">Numéro de Téléphone</label>
                      <input
                        type="text"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        placeholder="77 777 00 00"
                        className="w-full bg-gray-50 border border-gray-200 rounded-[8px] px-4 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#004030]"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-3 animate-in fade-in duration-200">
                  <h3 className="text-sm font-bold text-gray-900">
                    Montant de l'avance <span className="text-xs text-gray-400 font-normal">(min. 5 000 FCFA)</span>
                  </h3>

                  <div className="relative max-w-md">
                    <input
                      type="number"
                      value={avance}
                      onChange={(e) => setAvance(e.target.value)}
                      placeholder="10 000 (FCFA)"
                      className="w-full bg-gray-50 border border-gray-200 rounded-[8px] px-4 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#004030]"
                    />
                    <span className="absolute right-4 top-2.5 text-xs font-bold text-gray-400">FCFA</span>
                  </div>

                  {avanceNum > 0 && (
                    <p className="text-xs font-semibold text-gray-500">
                      Reste à payer sur place : <span className="text-[#004030] font-bold">{resteAPayer.toLocaleString()} FCFA</span>
                    </p>
                  )}
                </div>
              </>
            )}

            {/* AVIS DES CLIENTS */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-gray-900">Avis des clients</h3>
                <button
                  onClick={() => {
                    if (!currentUser) {
                      if (onNavigate) onNavigate('login');
                    } else {
                      setShowAvisModal(true);
                    }
                  }}
                  className="px-4 py-2 bg-[#004030] hover:bg-[#005943] text-white font-bold text-xs rounded-[8px] transition-colors cursor-pointer"
                >
                  Laisser un avis
                </button>
              </div>

              <div className="space-y-4">
                {avisList.map((avis) => (
                  <div key={avis.id} className="p-4 bg-gray-50 rounded-[8px] border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#004030] text-white font-bold text-xs flex items-center justify-center">
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
            
            <div className="bg-white rounded-2xl p-4 border border-gray-200 space-y-3">
              <h4 className="text-xs font-bold text-gray-900 uppercase">Localisation du terrain</h4>
              <div className="h-44 bg-emerald-50 rounded-[8px] border border-emerald-100 relative overflow-hidden flex items-center justify-center text-center p-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-red-500 text-white rounded-full mx-auto flex items-center justify-center shadow-md animate-bounce">
                    <MapPin size={20} />
                  </div>
                  <p className="text-xs font-bold text-gray-800">
                    Almadies, Dakar, Sénégal
                  </p>
                  <p className="text-[10px] text-gray-500">Rue NG-022, Almadies</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-5">
              <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3">
                Récapitulatif de votre match
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center space-x-2 text-gray-700">
                  <CheckCircle2 size={16} className="text-[#004030] shrink-0" />
                  <span className="font-bold">{terrain?.nom || 'Complexe Keur Madior'}</span>
                </div>

                <div className="flex items-center space-x-2 text-gray-700">
                  <CalendarIcon size={16} className="text-[#004030] shrink-0" />
                  <span>
                    {isPastDate
                      ? 'Date passée non valide'
                      : selectedDate
                      ? `Date : ${selectedDate}`
                      : 'Veuillez choisir une date'}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-gray-700">
                  <Clock size={16} className="text-[#004030] shrink-0" />
                  <span>{selectedCreneau ? `${selectedCreneau.heure} (1 Heure)` : 'Veuillez choisir un créneau'}</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-gray-100 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Location terrain</span>
                  <span className="font-bold text-gray-900">{currentPrix.toLocaleString()} FCFA</span>
                </div>

                {avanceNum > 0 && (
                  <div className="flex justify-between items-center p-2.5 bg-[#e6f4ea] rounded-[8px] text-[#004030] font-bold">
                    <span>Avance à payer</span>
                    <span>{avanceNum.toLocaleString()} FCFA</span>
                  </div>
                )}

                <div className="flex justify-between pt-2 text-sm font-extrabold text-gray-900">
                  <span>Total à payer sur place</span>
                  <span className="text-[#004030]">{resteAPayer.toLocaleString()} FCFA</span>
                </div>
              </div>

              <button
                onClick={handleReserverSlot}
                disabled={!isFormComplete}
                className={`w-full py-3.5 px-4 font-extrabold text-sm rounded-[8px] transition-all text-center ${
                  isFormComplete
                    ? 'bg-[#D4AF37] hover:bg-[#c29f2f] text-gray-900 cursor-pointer shadow-xs'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                }`}
              >
                {isFormComplete
                  ? 'Réserver ce créneau'
                  : isPastDate
                  ? 'Réservation impossible pour date passée'
                  : 'Complétez les informations pour réserver'}
              </button>
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
                  className="w-full bg-[#f4f7f6] border border-gray-200/80 rounded-2xl p-4 text-xs font-medium text-gray-800 focus:outline-none focus:border-[#004030] placeholder-gray-400"
                ></textarea>

                {/* Compteur de caractères */}
                <div className="text-right text-[11px] text-gray-400 font-medium">
                  {newAvisTexte.length} / 500
                </div>
              </div>

              {/* BOUTONS D'ACTION (ANNULER CONTOUR VERT & PUBLIER SOLIDE VERT) */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAvisModal(false)}
                  className="px-6 py-2.5 bg-white border border-[#004030] text-[#004030] hover:bg-emerald-50 font-bold text-xs rounded-[8px] transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#004030] hover:bg-[#005943] text-white font-bold text-xs rounded-[8px] transition-colors cursor-pointer shadow-xs"
                >
                  Publier mon avis
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
