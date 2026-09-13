import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Pencil } from 'lucide-react';
import GerantLayout from '../../components/gerant/GerantLayout';
import TerrainGallery from '../../components/gerant/TerrainGallery';
import TerrainStatsRow from '../../components/gerant/TerrainStatsRow';
import TerrainInfoCard from '../../components/gerant/TerrainInfoCard';
import ProchainesReservationsTable from '../../components/gerant/ProchainesReservationsTable';
import AvisRecentsList from '../../components/gerant/AvisRecentsList';
import Button from '../../components/ui/Button';
import { gerantService } from '../../services/gerantService';

/**
 * Page TerrainDetail (Espace Gérant)
 *
 * Vue détaillée d'un terrain géré : galerie photo, statistiques du mois,
 * informations générales, description, prochaines réservations et avis récents.
 */
export default function TerrainDetail({ onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [terrain, setTerrain] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [avis, setAvis] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadTerrainDetail() {
      try {
        setLoading(true);
        const [terrainData, reservationsData, avisData, profileData] = await Promise.all([
          gerantService.getTerrainDetail(Number(id)),
          gerantService.getProchainesReservations(Number(id)),
          gerantService.getAvisRecents(),
          gerantService.getGerantProfile(),
        ]);
        setTerrain(terrainData);
        setReservations(reservationsData);
        setAvis(avisData);
        setProfile(profileData);
      } catch (error) {
        console.error('Erreur chargement détail terrain:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTerrainDetail();
  }, [id]);

  if (loading) {
    return (
      <GerantLayout title="Mes terrains" profile={profile} onLogout={onLogout}>
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-bold">Chargement du terrain...</p>
        </div>
      </GerantLayout>
    );
  }

  if (!terrain) {
    return (
      <GerantLayout title="Mes terrains" profile={profile} onLogout={onLogout}>
        <div className="bg-white rounded-[12px] p-12 border border-gray-200/80 shadow-2xs text-center">
          <p className="text-sm text-gray-500 font-semibold">Terrain introuvable</p>
        </div>
      </GerantLayout>
    );
  }

  return (
    <GerantLayout title="Mes terrains" profile={profile} onLogout={onLogout}>

      {/* FIL D'ARIANE + ACTION */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => navigate('/gerant/terrains')}
            className="text-gray-500 hover:text-vert-principal font-semibold cursor-pointer"
          >
            Terrains
          </button>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="font-extrabold text-gray-900">Detail Terrain</span>
        </div>

        <Button variant="outline" size="sm" rounded="8px" className="gap-1.5">
          <Pencil size={14} />
          <span>Modifier les photos</span>
        </Button>
      </div>

      {/* GALERIE PHOTO */}
      <TerrainGallery photos={terrain.photos} />

      {/* STATISTIQUES */}
      <TerrainStatsRow stats={terrain.stats} />

      {/* INFORMATIONS GÉNÉRALES */}
      <TerrainInfoCard
        terrain={terrain}
        onModifier={() => navigate(`/gerant/terrains/${terrain.id}/modifier`)}
      />

      {/* DESCRIPTION */}
      <div className="bg-white rounded-[12px] border border-gray-200/80 shadow-2xs p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-black text-gray-900">Description</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{terrain.description}</p>
      </div>

      {/* PROCHAINES RÉSERVATIONS */}
      <ProchainesReservationsTable
        reservations={reservations}
        totalReservations={reservations.length}
        page={page}
        totalPages={1}
        onPageChange={setPage}
        onVoirTout={() => navigate('/gerant/reservations')}
      />

      {/* AVIS RÉCENTS */}
      <AvisRecentsList avis={avis} />

    </GerantLayout>
  );
}
