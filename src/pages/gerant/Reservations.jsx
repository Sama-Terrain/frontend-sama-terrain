import React, { useState, useEffect, useMemo } from 'react';
import GerantLayout from '../../components/gerant/GerantLayout';
import ReservationsActiviteBanner from '../../components/gerant/ReservationsActiviteBanner';
import ReservationsFiltersBar from '../../components/gerant/ReservationsFiltersBar';
import ReservationsTable from '../../components/gerant/ReservationsTable';
import { gerantService } from '../../services/gerantService';

const STATUT_LABEL_TO_VALUE = {
  Confirmées: 'Confirmée',
  Annulées: 'Annulée',
};

// Le mock ne fournit qu'une page de réservations ; la pagination reste affichée
// (3 pages, comme sur la maquette) en attendant une vraie pagination côté API.
const TOTAL_PAGES_MOCK = 3;

/**
 * Page Reservations (Espace Gérant)
 *
 * Vue complète des réservations reçues sur l'ensemble des terrains du gérant,
 * filtrable par période, terrain et statut.
 */
export default function Reservations({ onLogout }) {
  const [reservations, setReservations] = useState([]);
  const [activite, setActivite] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [terrainSelectionne, setTerrainSelectionne] = useState('Tous les terrains');
  const [statutSelectionne, setStatutSelectionne] = useState('Toutes');
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadReservations() {
      try {
        setLoading(true);
        const [reservationsData, activiteData, profileData] = await Promise.all([
          gerantService.getReservationsGerant(),
          gerantService.getReservationsActivite(),
          gerantService.getGerantProfile(),
        ]);
        setReservations(reservationsData);
        setActivite(activiteData);
        setProfile(profileData);
      } catch (error) {
        console.error('Erreur chargement réservations gérant:', error);
      } finally {
        setLoading(false);
      }
    }

    loadReservations();
  }, []);

  const terrains = useMemo(
    () => [...new Set(reservations.map((reservation) => reservation.terrain))],
    [reservations]
  );

  const reservationsFiltrees = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchTerrain = terrainSelectionne === 'Tous les terrains' || reservation.terrain === terrainSelectionne;
      const statutAttendu = STATUT_LABEL_TO_VALUE[statutSelectionne];
      const matchStatut = statutSelectionne === 'Toutes' || reservation.statut === statutAttendu;
      return matchTerrain && matchStatut;
    });
  }, [reservations, terrainSelectionne, statutSelectionne]);

  // Réinitialise la page quand les filtres changent
  useEffect(() => {
    setPage(1);
  }, [terrainSelectionne, statutSelectionne]);

  if (loading) {
    return (
      <GerantLayout title="Réservations" profile={profile} onLogout={onLogout}>
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-bold">Chargement des réservations...</p>
        </div>
      </GerantLayout>
    );
  }

  return (
    <GerantLayout title="Réservations" profile={profile} onLogout={onLogout}>

      <ReservationsActiviteBanner
        totalMois={activite?.totalMois}
        tauxValidation={activite?.tauxValidation}
      />

      <ReservationsFiltersBar
        periodeLabel={activite?.periodeLabel}
        terrains={terrains}
        terrainSelectionne={terrainSelectionne}
        onChangeTerrain={setTerrainSelectionne}
        statutSelectionne={statutSelectionne}
        onChangeStatut={setStatutSelectionne}
      />

      <ReservationsTable
        reservations={reservationsFiltrees}
        totalReservations={activite?.totalMois || reservationsFiltrees.length}
        page={page}
        totalPages={TOTAL_PAGES_MOCK}
        onPageChange={setPage}
      />

    </GerantLayout>
  );
}
