import React from 'react';
import { Check, Download, Share2, X } from 'lucide-react';

export default function TicketQR({ ticket, onClose }) {
    if (!ticket) return null;

    // Format metadata
    const reference = ticket.reference || (ticket.id ? (ticket.id.startsWith('#') ? ticket.id : `#ST-2024-${ticket.id.replace('RES-', '')}`) : '#ST-2024-0847');
    const terrainName = ticket.nomTerrain || ticket.terrainName || 'Stadium Mermoz - Elite Arena';
    const dateHeure = ticket.dateTexte || ticket.dateHeure || 'Vendredi 29 Nov — 18:00 à 19:00';
    const dureeJoueurs = ticket.dureeJoueurs || ticket.format || '1 Heures — 5 vs 5';

    const acompte = ticket.montantAcompte !== undefined ? ticket.montantAcompte : 15000;
    const moyenPaiement = ticket.moyenPaiement || 'Wave';
    const prixTotal = ticket.prixTotal !== undefined ? ticket.prixTotal : (acompte * 2);
    const resteAPayer = ticket.resteAPayer !== undefined ? ticket.resteAPayer : Math.max(0, prixTotal - acompte);

    const handleDownload = () => {
        window.print();
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Ticket de réservation ${reference}`,
                text: `Ma réservation au ${terrainName} le ${dateHeure}`,
                url: window.location.href,
            }).catch(() => { });
        } else {
            navigator.clipboard?.writeText(window.location.href);
            alert('Lien du ticket copié !');
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 overflow-y-auto"
            onClick={onClose}
        >
            <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">

                <div
                    className="bg-white rounded-2xl sm:rounded-[28px] p-2.5 sm:p-6 max-w-[280px] sm:max-w-md w-full relative shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 text-left my-2 sm:my-8"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* BOUTON FERMER */}
                    <button
                        onClick={onClose}
                        className="absolute top-1.5 right-1.5 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                        title="Fermer"
                    >
                        <X size={14} className="sm:w-5 sm:h-5" />
                    </button>

                    {/* ICÔNE DE SUCCÈS */}
                    <div className="flex justify-center mb-1.5 sm:mb-3">
                        <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-full bg-[#E6F4EA] flex items-center justify-center">
                            <Check
                                className="w-4 h-4 sm:w-8 sm:h-8 text-[#004030]"
                                strokeWidth={2.5}
                            />
                        </div>
                    </div>

                    {/* TITRE */}
                    <h2 className="text-[0.75rem] sm:text-xl font-black text-[#004030] text-center mb-0.5 tracking-tight">
                        Réservation confirmée !
                    </h2>

                    {/* SOUS-TITRE */}
                    <p className="text-[8px] sm:text-xs text-gray-500 text-center max-w-[220px] sm:max-w-xs mx-auto leading-snug mb-1.5 sm:mb-4">
                        Présentez ce QR code à votre arrivée au terrain pour valider votre entrée.
                    </p>

                    {/* SÉPARATEUR */}
                    <div className="w-full border-t border-dashed border-gray-300 mb-1.5 sm:mb-4"></div>

                    {/* CONTENEUR QR CODE */}
                    <div className="bg-[#F3F6F4] rounded-lg sm:rounded-2xl p-1.5 sm:p-4 flex justify-center items-center mx-auto w-fit mb-1.5 sm:mb-4">
                        <svg className="w-24 h-24 sm:w-44 sm:h-44" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Finder Pattern Top-Left */}
                            <rect x="10" y="10" width="50" height="50" rx="10" fill="#004030" />
                            <rect x="20" y="20" width="30" height="30" rx="6" fill="#F3F6F4" />
                            <rect x="27.5" y="27.5" width="15" height="15" rx="3" fill="#004030" />

                            {/* Finder Pattern Top-Right */}
                            <rect x="140" y="10" width="50" height="50" rx="10" fill="#004030" />
                            <rect x="150" y="20" width="30" height="30" rx="6" fill="#F3F6F4" />
                            <rect x="157.5" y="27.5" width="15" height="15" rx="3" fill="#004030" />

                            {/* Finder Pattern Bottom-Left */}
                            <rect x="10" y="140" width="50" height="50" rx="10" fill="#004030" />
                            <rect x="20" y="150" width="30" height="30" rx="6" fill="#F3F6F4" />
                            <rect x="27.5" y="157.5" width="15" height="15" rx="3" fill="#004030" />

                            {/* Data Modules */}
                            <rect x="75" y="10" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="95" y="10" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="115" y="10" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="75" y="30" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="115" y="30" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="75" y="50" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="95" y="50" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="115" y="50" width="12" height="12" rx="3" fill="#004030" />

                            <rect x="10" y="75" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="30" y="75" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="50" y="75" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="75" y="75" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="95" y="75" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="115" y="75" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="140" y="75" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="175" y="75" width="12" height="12" rx="3" fill="#004030" />

                            <rect x="10" y="95" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="50" y="95" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="75" y="95" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="140" y="95" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="160" y="95" width="12" height="12" rx="3" fill="#004030" />

                            <rect x="10" y="115" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="30" y="115" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="75" y="115" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="95" y="115" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="115" y="115" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="140" y="115" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="160" y="115" width="12" height="12" rx="3" fill="#004030" />

                            <rect x="75" y="140" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="95" y="140" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="140" y="140" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="160" y="140" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="175" y="140" width="12" height="12" rx="3" fill="#004030" />

                            <rect x="75" y="160" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="115" y="160" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="140" y="160" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="175" y="160" width="12" height="12" rx="3" fill="#004030" />

                            <rect x="75" y="175" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="95" y="175" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="140" y="175" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="160" y="175" width="12" height="12" rx="3" fill="#004030" />
                            <rect x="175" y="175" width="12" height="12" rx="3" fill="#004030" />
                        </svg>
                    </div>

                    {/* TABLEAU DES DÉTAILS DE LA RÉSERVATION */}
                    <div className="space-y-0 text-[8px] sm:text-xs mb-2 sm:mb-4">

                        <div className="flex justify-between items-center py-0.5 gap-2">
                            <span className="text-gray-500 font-medium">Référence Réservation</span>
                            <span className="font-extrabold text-gray-900 text-right">{reference}</span>
                        </div>

                        <div className="flex justify-between items-center py-0.5 gap-2">
                            <span className="text-gray-500 font-medium">Terrain</span>
                            <span className="font-bold text-gray-900 text-right truncate max-w-[55%]">{terrainName}</span>
                        </div>

                        <div className="flex justify-between items-center py-0.5 gap-2">
                            <span className="text-gray-500 font-medium">Date & Heure</span>
                            <span className="font-bold text-gray-900 text-right">{dateHeure}</span>
                        </div>

                        <div className="flex justify-between items-center py-0.5 gap-2">
                            <span className="text-gray-500 font-medium">Durée / Joueurs</span>
                            <span className="font-bold text-gray-900 text-right">{dureeJoueurs}</span>
                        </div>

                        <div className="flex justify-between items-center py-0.5 gap-2">
                            <span className="text-gray-500 font-medium">Montant acompte payé</span>
                            <span className="font-extrabold text-[#004030] text-right">
                                {acompte.toLocaleString()} FCFA (via {moyenPaiement})
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-0.5 gap-2">
                            <span className="text-gray-500 font-medium">Reste à payer sur place</span>
                            <span className="font-extrabold text-gray-900 text-right">{resteAPayer.toLocaleString()} FCFA</span>
                        </div>

                    </div>

                    {/* BOUTONS D'ACTION */}
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-3 pt-0.5">

                        <button
                            onClick={handleDownload}
                            className="flex items-center justify-center gap-1 sm:gap-2 bg-[#004030] hover:bg-[#005943] text-white font-bold text-[8px] sm:text-xs py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-md sm:rounded-xl transition-all cursor-pointer shadow-xs"
                        >
                            <span>Télécharger</span>
                            <Download size={10} className="sm:w-4 sm:h-4" />
                        </button>

                        <button
                            onClick={handleShare}
                            className="flex items-center justify-center gap-1 sm:gap-2 bg-white border border-[#004030] text-[#004030] hover:bg-[#004030]/5 font-bold text-[8px] sm:text-xs py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-md sm:rounded-xl transition-all cursor-pointer"
                        >
                            <span>Partager</span>
                            <Share2 size={10} className="sm:w-4 sm:h-4" />
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}
