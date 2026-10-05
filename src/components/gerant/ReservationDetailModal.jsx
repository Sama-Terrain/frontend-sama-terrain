import { X, User, Phone, MapPin, Calendar, Clock, Wallet, Ticket } from 'lucide-react';

const formatMontant = (value) => `${(value ?? 0).toLocaleString('fr-FR')} FCFA`;
const formatDateHeure = (iso) => new Date(iso).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
const LIBELLES_MOYEN = { cash: 'espèces', wave: 'Wave', orange_money: 'Orange Money' };

function Ligne({ libelle, children }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-gray-50 last:border-0">
      <span className="text-gray-500 font-medium">{libelle}</span>
      <span className="font-bold text-gray-900 text-right">{children}</span>
    </div>
  );
}

/**
 * Composant ReservationDetailModal
 * Détail complet d'une réservation reçue par le gérant (page "Réservations"),
 * ouvert depuis le bouton "œil" du tableau ou depuis une notification.
 */
export default function ReservationDetailModal({ reservation, onClose }) {
  if (!reservation) return null;

  const ticket = reservation.ticket;
  const solde = reservation.soldeEncaisse;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs overflow-y-auto" onClick={onClose}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="titre-detail-reservation"
          className="bg-white rounded-[12px] w-full max-w-lg shadow-2xl border border-gray-100 text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* EN-TÊTE */}
          <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-100">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Réservation {reservation.id}</p>
              <h2 id="titre-detail-reservation" className="text-lg font-extrabold text-vert-principal mt-1">
                {reservation.terrain}
              </h2>
              <span className={`inline-flex mt-2 rounded-[4px] px-2 py-1 text-[11px] font-bold ${reservation.statutBadgeClass}`}>
                {reservation.statut}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-6 py-5 space-y-5 text-[13px]">
            {/* CLIENT */}
            <section>
              <h3 className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                <User size={14} className="text-dore" /> Client
              </h3>
              <Ligne libelle="Nom">{reservation.client}</Ligne>
              <Ligne libelle="Téléphone">
                <a href={`tel:+${reservation.telephone}`} className="inline-flex items-center gap-1.5 text-vert-principal hover:underline">
                  <Phone size={12} /> +{reservation.telephone}
                </a>
              </Ligne>
            </section>

            {/* MATCH */}
            <section>
              <h3 className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                <MapPin size={14} className="text-dore" /> Match
              </h3>
              <Ligne libelle="Date">
                <span className="inline-flex items-center gap-1.5 capitalize"><Calendar size={12} /> {reservation.dateLongue}</span>
              </Ligne>
              <Ligne libelle="Créneau">
                <span className="inline-flex items-center gap-1.5"><Clock size={12} /> {reservation.creneau}</span>
              </Ligne>
              <Ligne libelle="Réservée le">{reservation.reserveeLe}</Ligne>
            </section>

            {/* PAIEMENT */}
            <section>
              <h3 className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                <Wallet size={14} className="text-dore" /> Paiement
              </h3>
              <Ligne libelle="Prix total">{formatMontant(reservation.montant)}</Ligne>
              <Ligne libelle="Avance payée en ligne">
                <span className="text-vert-principal">{formatMontant(reservation.montantAvance)}</span>
              </Ligne>
              {solde ? (
                <Ligne libelle="Solde encaissé sur place">
                  {formatMontant(solde.montant)} ({LIBELLES_MOYEN[solde.moyen_paiement] || solde.moyen_paiement})
                  {solde.encaisse_par && (
                    <span className="block text-[11px] font-semibold text-gray-500">
                      par {solde.encaisse_par}, le {formatDateHeure(solde.le)}
                    </span>
                  )}
                </Ligne>
              ) : (
                <Ligne libelle="Reste à encaisser sur place">{formatMontant(reservation.resteAPayer)}</Ligne>
              )}
              <Ligne libelle="Moyen de paiement">{reservation.moyenPaiement || '—'}</Ligne>
              {reservation.transactionId && (
                <Ligne libelle="Référence transaction">
                  <span className="font-mono text-xs break-all">{reservation.transactionId}</span>
                </Ligne>
              )}
            </section>

            {/* TICKET */}
            <section>
              <h3 className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                <Ticket size={14} className="text-dore" /> Ticket d'entrée
              </h3>
              {ticket ? (
                <>
                  <Ligne libelle="Code">
                    <span className="font-mono text-xs break-all">{ticket.code}</span>
                  </Ligne>
                  <Ligne libelle="État">
                    {ticket.utilise ? (
                      <span className="text-gray-500">
                        Scanné{ticket.valide_par ? ` par ${ticket.valide_par}` : ''}
                        {ticket.utilise_le && (
                          <span className="block text-[11px] font-semibold">le {formatDateHeure(ticket.utilise_le)}</span>
                        )}
                      </span>
                    ) : (
                      <span className="text-emerald-700">Valide, pas encore scanné</span>
                    )}
                  </Ligne>
                </>
              ) : (
                <p className="text-gray-500">Aucun ticket : l'avance n'a pas été payée.</p>
              )}
            </section>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[8px] bg-vert-principal hover:bg-vert-survol text-white text-sm font-bold px-5 py-2.5 cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
