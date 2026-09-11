import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Clock, ArrowRight, ShieldCheck, CheckCircle2, Bot, X } from 'lucide-react';
import TerrainCard from '../../components/terrain/TerrainCard';
import Button from '../../components/ui/Button';
import { terrainService } from '../../services/terrainService';
import { avisService } from '../../services/avisService';
import heroBg from '../../assets/herobg.jpeg';
import ctaBg from '../../assets/cta.png';
import chatbotGif from '../../assets/chatbot.gif';

export default function Accueil() {
  const navigate = useNavigate();

  // États locaux pour les données chargées depuis les services
  const [terrainsVedettes, setTerrainsVedettes] = useState([]);
  const [avisJoueurs, setAvisJoueurs] = useState([]);
  const [loading, setLoading] = useState(true);

  // État du formulaire de recherche rapide
  const [searchZone, setSearchZone] = useState('Yoff Plage & Virage');
  const [searchDate, setSearchDate] = useState("Aujourd'hui");
  const [searchCreneau, setSearchCreneau] = useState('19:00 - Plein jeu');

  // État du Widget Assistant IA (Panneau flottant)
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { id: 1, sender: 'bot', text: 'Bonjour ! Je suis l’assistant Sama-Terrain. Quel quartier ou créneau cherchez-vous à Dakar ?' }
  ]);
  const [aiInput, setAiInput] = useState('');

  // Chargement des données mockées au montage du composant
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [terrainsData, avisData] = await Promise.all([
          terrainService.getTerrainsVedettes(),
          avisService.getAvisJoueurs()
        ]);
        setTerrainsVedettes(terrainsData);
        setAvisJoueurs(avisData);
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Handler de soumission du formulaire de recherche
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate('/terrains', { state: { searchZone, searchDate, searchCreneau } });
  };

  // Handler d'envoi de message à l'assistant IA
  const handleSendAiMessage = (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: aiInput };
    setAiMessages((prev) => [...prev, userMsg]);
    setAiInput('');

    setTimeout(() => {
      setAiMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: `Je recherche des créneaux disponibles pour "${aiInput}". Le Complexe Keur Madior a un créneau disponible ce soir !`
        }
      ]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative bg-vert-principal text-white py-25 px-4 sm:px-6 lg:px-20 overflow-hidden border-b border-gray-200">
        
        {/* Fond d'écran Football */}
        <div 
          className="absolute inset-0 opacity-90 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-vert-principal/90 via-vert-principal/80 to-vert-principal pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-left">
          
          {/* Tag SÉNÉGAL FOOTBALL HUB */}
          <p className="text-[#D4AF37] text-xs sm:text-sm font-bold uppercase tracking-widest mb-4">
            SÉNÉGAL FOOTBALL HUB
          </p>

          {/* Titre Principal Aligné à gauche */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight text-white">
            Réservez votre terrain en quelques clics
          </h1>
          
          {/* Sous-titre Aligné à gauche */}
          <p className="mt-4 text-sm sm:text-base text-gray-200/90 max-w-2xl font-normal leading-relaxed">
            La plateforme n°1 de réservation de mini-foot au Sénégal. Simple, rapide et fiable pour vous et votre équipe.
          </p>

          {/* Formulaire de Recherche Rapide (Fidèle au Figma) */}
          <form 
            onSubmit={handleSearchSubmit}
            className="mt-10 bg-white rounded-[16px] p-5 sm:p-6 w-full text-gray-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-end border border-gray-100"
          >
            {/* Champ 1: Zone / Quartier */}
            <div className="flex flex-col space-y-1.5 text-left">
              <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5 pl-1">
                <MapPin size={15} className="text-vert-principal" />
                <span>Zone / Quartier</span>
              </label>
              <div className="bg-[#f3f4f6] rounded-xl px-4 py-3 border border-transparent focus-within:border-vert-principal transition-colors">
                <select
                  value={searchZone}
                  onChange={(e) => setSearchZone(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm text-vert-principal focus:outline-none cursor-pointer"
                >
                  <option value="Yoff Plage & Virage">Yoff Plage & Virage</option>
                  <option value="Almadies">Almadies</option>
                  <option value="Mermoz">Mermoz</option>
                  <option value="Fann">Fann</option>
                  <option value="Guédiawaye">Guédiawaye</option>
                </select>
              </div>
            </div>

            {/* Champ 2: Date de match */}
            <div className="flex flex-col space-y-1.5 text-left">
              <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5 pl-1">
                <Calendar size={15} className="text-vert-principal" />
                <span>Date de match</span>
              </label>
              <div className="bg-[#f3f4f6] rounded-xl px-4 py-3 border border-transparent focus-within:border-vert-principal transition-colors">
                <select
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm text-vert-principal focus:outline-none cursor-pointer"
                >
                  <option value="Aujourd'hui">Aujourd'hui</option>
                  <option value="Demain">Demain</option>
                  <option value="Ce Samedi">Ce Samedi</option>
                  <option value="Ce Dimanche">Ce Dimanche</option>
                </select>
              </div>
            </div>

            {/* Champ 3: Créneau horaire */}
            <div className="flex flex-col space-y-1.5 text-left">
              <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5 pl-1">
                <Clock size={15} className="text-vert-principal" />
                <span>Créneau horaire</span>
              </label>
              <div className="bg-[#f3f4f6] rounded-xl px-4 py-3 border border-transparent focus-within:border-vert-principal transition-colors">
                <select
                  value={searchCreneau}
                  onChange={(e) => setSearchCreneau(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm text-vert-principal focus:outline-none cursor-pointer"
                >
                  <option value="19:00 - Plein jeu">19:00 - Plein jeu</option>
                  <option value="20:00 - Plein jeu">20:00 - Plein jeu</option>
                  <option value="21:00 - Plein jeu">21:00 - Plein jeu</option>
                  <option value="22:00 - Plein jeu">22:00 - Plein jeu</option>
                </select>
              </div>
            </div>

            {/* Bouton 4: Rechercher un terrain */}
            <div className="flex flex-col justify-end">
              <Button
                type="submit"
                variant="gold"
                size="md"
                rounded="xl"
                fullWidth
              >
                <Search size={18} className="stroke-[2.5]" />
                <span>Rechercher un terrain</span>
              </Button>
            </div>
          </form>

        </div>
      </section>

      {/* 2. SECTION "COMMENT ÇA MARCHE ?" */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Comment ça marche ?
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Trouvez un terrain et commencez à jouer en moins de 3 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Étape 1 */}
          <div className="bg-white p-8 rounded-[8px] border border-gray-200 text-left relative overflow-hidden group hover:border-vert-principal transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-full bg-vert-clair text-vert-principal flex items-center justify-center">
                <Search size={24} />
              </div>
              <span className="text-4xl font-black text-gray-200 group-hover:text-emerald-100 transition-colors">
                01
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Cherchez un terrain</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Indiquez votre localisation et comparez les terrains disponibles en temps réel.
            </p>
          </div>

          {/* Étape 2 */}
          <div className="bg-white p-8 rounded-[8px] border border-gray-200 text-left relative overflow-hidden group hover:border-vert-principal transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-full bg-vert-clair text-vert-principal flex items-center justify-center">
                <Calendar size={24} />
              </div>
              <span className="text-4xl font-black text-gray-200 group-hover:text-emerald-100 transition-colors">
                02
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Choisissez un créneau</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Sélectionnez l'heure et la date qui conviennent à votre équipe en quelques clics.
            </p>
          </div>

          {/* Étape 3 */}
          <div className="bg-white p-8 rounded-[8px] border border-gray-200 text-left relative overflow-hidden group hover:border-vert-principal transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-full bg-vert-clair text-vert-principal flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <span className="text-4xl font-black text-gray-200 group-hover:text-emerald-100 transition-colors">
                03
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Réservez et jouez</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Confirmez instantanément et recevez votre code d'accès au terrain en toute sécurité.
            </p>
          </div>

        </div>
      </section>

      {/* 3. SECTION "TERRAINS VEDETTES À LA UNE" */}
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-20 border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Terrains vedettes à la une
              </h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Les complexes les plus prisés par les passionnés de football à Dakar.
              </p>
            </div>

            <Button
              onClick={() => navigate('/terrains')}
              variant="secondary"
              size="sm"
              className="self-start sm:self-auto"
            >
              Voir tous les terrains
            </Button>
          </div>

          {/* Grille des Terrains Vedettes */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-gray-100 rounded-[8px] animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {terrainsVedettes.map((terrain) => (
                <TerrainCard
                  key={terrain.id}
                  terrain={terrain}
                  onSelect={(t) => {
                    navigate(`/terrains/${t.id}`);
                  }}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 4. BANNIÈRE CALL TO ACTION POUR LES GÉRANTS (PLEINE LARGEUR SUR TOUTE LA LIGNE / FULL WIDTH) */}
      <section className="w-full bg-vert-principal text-white py-16 px-4 sm:px-6 lg:px-20 relative overflow-hidden">
        {/* Motif du terrain de football en arrière-plan */}
        <div 
          className="absolute inset-0 opacity-90 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${ctaBg})` }}
        />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="max-w-2xl text-left">
            <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">
              Vous gérez un terrain ? Rejoignez Sama-Terrain
            </h2>
            <p className="mt-3 text-emerald-100 text-sm sm:text-base leading-relaxed font-normal">
              Automatisez vos réservations, augmentez votre taux d'occupation et gérez votre complexe en toute sérénité.
            </p>
          </div>

          <Button
            onClick={() => navigate('/gerant')}
            variant="outline"
            size="md"
            rounded="8px"
          >
            Devenir Gérant
          </Button>
        </div>
      </section>

      {/* 5. SECTION PROXIMITÉ & CARTE DAKAR */}
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-20 border-y border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              Des complexes proches de chez vous à tout moment
            </h2>
            <p className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">
              Ne perdez plus 45 minutes au téléphone avec les gardiens de terrains. Sama-Terrain synchronise les disponibilités officielles en direct de Yoff à Guédiawaye.
            </p>

            <ul className="mt-6 space-y-3 text-sm font-medium text-gray-700">
              <li className="flex items-center gap-3">
                <ShieldCheck className="text-vert-principal" size={20} />
                <span>Mise à jour en direct des disponibilités</span>
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="text-vert-principal" size={20} />
                <span>Paiement sécurisé par Wave, Orange Money & Carte</span>
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="text-vert-principal" size={20} />
                <span>Confirmation instantanée par SMS / QR Code</span>
              </li>
            </ul>
          </div>

          {/* Visuel Carte Dakar */}
          <div className="bg-emerald-50/50 rounded-[8px] p-6 border border-emerald-100 relative min-h-[280px] flex items-center justify-center text-center">
            <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-full text-xs font-bold text-[#004030] border border-gray-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              14 terrains disponibles ce soir à Dakar
            </div>
            
            <div className="space-y-3">
              <div className="w-16 h-16 bg-vert-principal text-white rounded-full mx-auto flex items-center justify-center">
                <MapPin size={32} />
              </div>
              <p className="text-sm font-bold text-gray-800">
                Almadies • Mermoz • Fann • Yoff • Guédiawaye
              </p>
              <button
                onClick={() => onNavigate && onNavigate('terrains')}
                className="text-xs font-bold text-vert-principal hover:underline cursor-pointer"
              >
                Explorer la carte interactive →
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 6. SECTION "CE QUE DISENT NOS JOUEURS" */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Ce que disent nos joueurs
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Rejoignez des milliers de footballeurs amateurs satisfaits au Sénégal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {avisJoueurs.map((avis) => (
            <div
              key={avis.id}
              className="bg-white p-6 rounded-[8px] border border-gray-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-vert-principal text-white flex items-center justify-center font-bold text-sm">
                    {avis.initiales}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{avis.nom}</h4>
                    <p className="text-xs text-gray-500">{avis.role}</p>
                  </div>
                </div>

                <div className="flex text-amber-400">
                  {[...Array(avis.note)].map((_, i) => (
                    <span key={i} className="text-sm">★</span>
                  ))}
                </div>

                <p className="text-sm text-gray-600 italic leading-relaxed">
                  "{avis.commentaire}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. WIDGET ASSISTANT IA FLOTTANT */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isAiOpen ? (
          <button
            onClick={() => setIsAiOpen(true)}
            className="w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
            title="Ouvrir l'assistant IA"
          >
            <img
              src={chatbotGif}
              alt="Assistant IA"
              className="w-full h-full object-contain"
            />
          </button>
        ) : (
          <div className="w-80 sm:w-96 bg-white rounded-2xl border border-gray-300 overflow-hidden">
            <div className="bg-vert-principal text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot size={20} className="text-emerald-300" />
                <span className="font-bold text-sm">Assistant Sama-Terrain</span>
              </div>

              <button
                onClick={() => setIsAiOpen(false)}
                className="text-gray-300 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 h-64 overflow-y-auto space-y-3 bg-gray-50 text-xs">
              {aiMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-xl ${
                      msg.sender === 'user'
                        ? 'bg-vert-principal text-white rounded-br-none'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSendAiMessage}
              className="p-3 bg-white border-t border-gray-200 flex gap-2"
            >
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ex: Terrain disponible à Yoff..."
                className="flex-1 bg-gray-100 px-3 py-2 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#004030]"
              />

              <Button
                type="submit"
                variant="primary"
                size="sm"
              >
                Envoyer
              </Button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
