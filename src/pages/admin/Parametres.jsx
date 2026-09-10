import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Save } from 'lucide-react';

export default function Parametres() {
  return (
    <AdminLayout title="Paramètres du Système">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs space-y-6 text-left max-w-3xl">
        <h2 className="text-lg font-black text-gray-900">Configuration Générale</h2>

        <div className="space-y-5 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <label className="font-extrabold text-gray-800">Nom de la Plateforme</label>
            <input
              type="text"
              defaultValue="SAMA-TERRAIN"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:border-[#004030]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-extrabold text-gray-800">Pourcentage de Commission (%)</label>
            <input
              type="number"
              defaultValue={10}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:border-[#004030]"
            />
          </div>

          <div className="pt-3">
            <button className="px-6 py-3 bg-[#004030] hover:bg-[#005943] text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-colors">
              <Save size={16} />
              <span>Enregistrer les paramètres</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
