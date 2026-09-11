import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, Ticket } from 'lucide-react';
import Button from '../../components/ui/Button';
import { reservationService } from '../../services/reservationService';
import TicketQR from '../../components/reservation/TicketQR';

export default function MesReservations() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('a-venir'); // 'a-venir', 'passees', 'annulees'
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketModal, setTicketModal] = useState(null);

  useEffect(() => {
    async function loadReservations() {
      try {
        setLoading(true);
        const data = await reservationService.getUserReservations();
        setReservations(data);
      } catch (err) {
        console.error('Erreur chargement réservations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReservations();
  }, []);

  const handleAnnuler = async (resId) => {
    if (window.confirm('Voulez-vous vraiment annuler cette réservation ?')) {
      await reservationService.annulerReservation(resId);
      const updated = await reservationService.getUserReservations();
      setReservations([...updated]);
    }
  };

  const filteredReservations = reservations.filter(
    (res) => res.tabCategory === activeTab
  );

  return (
    <div className="min-h-screen bg-gray-50/60 py-10 px-4 sm:px-6 lg:px-20 font-sans text-left">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* EN-TÊTE : TITRE ET BOUTON "RÉSERVER UN NOUVEAU MATCH" */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-vert-principal tracking-tight">
            Mes Réservations
          </h1>

          <Button
            onClick={() => navigate('/terrains')}
            variant="gold"
            size="md"
            rounded="12px"
            className="rounded-[8px] font-extrabold shadow-xs inline-flex items-center justify-center gap-2 text-vert-principal"
          >
            <span>Réserver un nouveau match</span>
          </Button>
        </div>

        {/* ONGLETS : À VENIR | PASSÉES | ANNULÉES */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('a-venir')}
              className={`pb-4 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'a-venir'
                  ? 'text-vert-principal border-b-2 border-[#004030]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              À venir
            </button>

            <button
              onClick={() => setActiveTab('passees')}
              className={`pb-4 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'passees'
                  ? 'text-vert-principal border-b-2 border-[#004030]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Passées
            </button>

            <button
              onClick={() => setActiveTab('annulees')}
              className={`pb-4 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'annulees'
                  ? 'text-vert-principal border-b-2 border-[#004030]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Annulées
            </button>
          </div>
        </div>

        {/* LISTE DES CARTES DE RÉSERVATION (FIDÈLE À FIGMA) */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#004030] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-gray-500 font-semibold">Chargement de vos réservations...</p>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-4">
            <Calendar size={48} className="text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-700">Aucune réservation dans cet onglet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Vous n'avez pas de match prévu dans la catégorie "{activeTab}". Explorez les terrains disponibles et réservez votre créneau dès maintenant !
            </p>
            <button
              onClick={() => navigate('/terrains')}
              className="px-5 py-2.5 bg-vert-principal text-white text-xs font-bold rounded-[8px] hover:bg-vert-survol"
            >
              Voir les terrains
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredReservations.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 hover:border-gray-300 transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                
                {/* BLOC IMAGE ET INFORMATIONS TERRAIN */}
                <div className="flex items-center space-x-5">
                  <div className="w-28 h-20 sm:w-36 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-gray-200 border border-gray-100">
                    <img
                      src={item.image}
                      alt={item.nomTerrain}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    {/* BADGES CONFIRMÉE + ACOMPTE PAYÉ */}
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                        item.tabCategory === 'annulees'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-vert-clair text-vert-principal'
                      }`}>
                        {item.status}
                      </span>

                      {item.acomptePaye && (
                        <span className="text-[11px] font-semibold text-gray-500">
                          Acompte payé
                        </span>
                      )}
                    </div>

                    {/* NOM DU TERRAIN */}
                    <h3 className="text-base sm:text-lg font-black text-gray-900">
                      {item.nomTerrain}
                    </h3>

                    {/* DATE ET HEURE */}
                    <div className="flex items-center space-x-2 text-xs text-gray-600 font-medium">
                      <Calendar size={14} className="text-gray-400 shrink-0" />
                      <span>{item.dateTexte}</span>
                    </div>
                  </div>
                </div>

                {/* BLOC MONTANT ACOMPTE ET BOUTONS VOIR TICKET / ANNULER */}
                <div className="flex flex-row md:flex-row items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                  
                  {/* MONTANT ACOMPTE */}
                  <div className="text-left md:text-right">
                    <span className="block text-[11px] text-gray-400 font-medium">Montant Acompte</span>
                    <span className="text-base sm:text-lg font-black text-gray-900">
                      {item.montantAcompte.toLocaleString()} FCFA
                    </span>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setTicketModal(item)}
                      className="px-4 py-2 bg-vert-clair hover:bg-[#d5ecd9] text-vert-principal font-bold text-xs rounded-[8px] transition-colors cursor-pointer"
                    >
                      Voir ticket
                    </button>

                    {item.tabCategory === 'a-venir' && (
                      <button
                        onClick={() => handleAnnuler(item.id)}
                        className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-[8px] transition-colors cursor-pointer"
                      >
                        Annuler
                      </button>
                    )}
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

        {/* PAGINATION (1 2 >) */}
        {!loading && filteredReservations.length > 0 && (
          <div className="flex justify-center items-center space-x-2 pt-6">
            <button className="w-8 h-8 rounded-[8px] bg-vert-clair text-vert-principal font-bold text-xs flex items-center justify-center">
              1
            </button>
            <button className="w-8 h-8 rounded-[8px] bg-white border border-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center hover:bg-gray-50">
              2
            </button>
            <button className="w-8 h-8 rounded-[8px] bg-white border border-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center hover:bg-gray-50">
              <ChevronRight size={14} />
            </button>
          </div>
        )}

      </div>

      {/* MODAL TICKET DU MATCH (FIGMA DESIGN) */}
      <TicketQR
        ticket={ticketModal}
        onClose={() => setTicketModal(null)}
      />

    </div>
  );
}
