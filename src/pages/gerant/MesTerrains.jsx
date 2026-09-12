import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import GerantLayout from '../../components/gerant/GerantLayout';
import GerantTerrainCard from '../../components/gerant/GerantTerrainCard';
import Button from '../../components/ui/Button';
import { gerantService } from '../../services/gerantService';

/**
 * Page MesTerrains (Espace Gérant)
 *
 * Liste les terrains gérés par le gérant connecté, avec pour chacun :
 * ses statistiques du mois et des actions rapides (modifier, créneaux, activer/désactiver).
 */
export default function MesTerrains({ onLogout }) {
  const [terrains, setTerrains] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTerrains() {
      try {
        setLoading(true);
        const [terrainsData, profileData] = await Promise.all([
          gerantService.getMesTerrains(),
          gerantService.getGerantProfile(),
        ]);
        setTerrains(terrainsData);
        setProfile(profileData);
      } catch (error) {
        console.error('Erreur chargement des terrains gérant:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTerrains();
  }, []);

  // Bascule locale de l'état actif/inactif d'un terrain (mock uniquement, pas d'appel réseau)
  const handleToggleActif = (terrainId, nextActif) => {
    setTerrains((current) =>
      current.map((terrain) =>
        terrain.id === terrainId ? { ...terrain, actif: nextActif } : terrain
      )
    );
  };

  if (loading) {
    return (
      <GerantLayout title="Mes terrains" profile={profile} onLogout={onLogout}>
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-vert-principal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-bold">Chargement de vos terrains...</p>
        </div>
      </GerantLayout>
    );
  }

  return (
    <GerantLayout title="Mes terrains" profile={profile} onLogout={onLogout}>

      {/* EN-TÊTE DE LISTE */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg sm:text-xl font-black text-vert-principal">
          Liste des Terrains ({terrains.length})
        </h2>
        <Button variant="gold" size="sm" rounded="8px" className="gap-2">
          <Plus size={16} />
          <span>Ajouter un terrain</span>
        </Button>
      </div>

      {/* GRILLE DES TERRAINS */}
      {terrains.length === 0 ? (
        <div className="bg-white rounded-[12px] p-12 border border-gray-200/80 shadow-2xs text-center">
          <p className="text-sm text-gray-500 font-semibold">
            Vous n'avez encore ajouté aucun terrain
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {terrains.map((terrain) => (
            <GerantTerrainCard
              key={terrain.id}
              terrain={terrain}
              onToggleActif={handleToggleActif}
            />
          ))}
        </section>
      )}

    </GerantLayout>
  );
}
