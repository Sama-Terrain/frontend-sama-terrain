import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Save } from 'lucide-react';

export default function Parametres() {
  return (
    <AdminLayout title="Paramètres du Système">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs space-y-6 text-left max-w-3xl">
        <h2 className="text-lg font-black text-gray-900">Configuration Générale</h2>

        <div className="space-y-5 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <label className="font-extrabold text-gray-800">Nom de la Plateforme</label>
            <Input
              type="text"
              defaultValue="SAMA-TERRAIN"
              className="w-full px-4 py-2.5 bg-gray-50 rounded-xl font-bold text-gray-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-extrabold text-gray-800">Pourcentage de Commission (%)</label>
            <Input
              type="number"
              defaultValue={10}
              className="w-full px-4 py-2.5 bg-gray-50 rounded-xl font-bold text-gray-900"
            />
          </div>

          <div className="pt-3">
            <Button
              variant="primary"
              size="md"
              rounded="xl"
              className="shadow-xs"
            >
              <Save size={16} />
              <span>Enregistrer les paramètres</span>
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
