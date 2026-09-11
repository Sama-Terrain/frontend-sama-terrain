import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Eye, ShieldCheck, Upload, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import heroBg from '../../assets/herobg.jpeg';

export default function DevenirGerant() {
  const navigate = useNavigate();

  // État du formulaire
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    adresse: '',
    whatsapp: '',
    password: '',
    nomComplexe: '',
    quartier: '',
    document: null
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData((prev) => ({ ...prev, document: e.dataTransfer.files[0] }));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, document: e.target.files[0] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-left">
      
      {/* 1. HERO BANNER SECTION (FARMER / GÉRANT BANNER) */}
      <section className="relative bg-vert-principal text-white py-16 px-4 sm:px-6 lg:px-20 overflow-hidden border-b border-gray-200 h-[40vh]">
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#004030]/90 via-[#004030]/80 to-[#004030] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-3xl leading-tight">
            Faites de votre terrain une vraie opportunité
          </h1>
          <p className="text-sm sm:text-base text-gray-200/90 max-w-2xl font-normal leading-relaxed">
            Sama-Terrain vous aide à attirer plus de joueurs, gérer vos réservations et développer vos revenus, simplement. Rejoignez Sama-Terrain et donnez plus de visibilité à votre terrain.
          </p>
        </div>
      </section>

      {/* 2. SECTION "POURQUOI NOUS FAIRE CONFIANCE ?" */}
      <section className="py-16 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-8">
          Pourquoi nous faire confiance ?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-[8px] border border-gray-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-vert-clair text-vert-principal flex items-center justify-center">
              <Calendar size={22} />
            </div>
            <h3 className="text-base font-bold text-gray-900">Gestion simplifiée</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Fini les doubles réservations. Un planning en ligne clair et accessible n'importe où.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-[8px] border border-gray-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-vert-clair text-vert-principal flex items-center justify-center">
              <Eye size={22} />
            </div>
            <h3 className="text-base font-bold text-gray-900">Visibilité accrue</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Attirez de nouveaux joueurs locaux directement depuis notre moteur de recherche optimisé.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-[8px] border border-gray-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-vert-clair text-vert-principal flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
            <h3 className="text-base font-bold text-gray-900">Paiements sécurisés</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Recevez vos acomptes et règlements de façon transparente via Wave, Orange Money ou Carte.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FORMULAIRE "INSCRIVEZ VOTRE COMPLEXE EN 3 MINUTES" */}
      <section className="pb-20 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-[8px] p-6 sm:p-10 border border-gray-200 space-y-8">
          
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              Inscrivez votre complexe en 3 minutes
            </h2>
            <p className="text-xs text-gray-600 mt-2 max-w-3xl leading-relaxed">
              Remplissez les détails essentiels. Notre équipe d'intégration valide votre fiche d'établissement sous 24h et vous contacte pour l'installation du kit d'accueil.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-[#e6f4ea] rounded-[8px] border border-emerald-200 text-center space-y-4">
              <CheckCircle2 size={48} className="text-[#004030] mx-auto" />
              <h3 className="text-lg font-bold text-[#004030]">
                Demande d'adhésion envoyée avec succès !
              </h3>
              <p className="text-xs text-gray-700 max-w-md mx-auto">
                Merci {formData.prenom} ! Notre équipe d'intégration valide votre dossier pour le complexe <strong>{formData.nomComplexe || 'sportif'}</strong> et vous contactera sous 24h.
              </p>
              <Button
                onClick={() => navigate('/')}
                variant="primary"
                size="sm"
                rounded="8px"
              >
                Retour à l'accueil
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* COLONNE 1 : VOS COORDONNÉES PROFESSIONNELLES */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-[#004030] font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-vert-clair flex items-center justify-center text-xs">1</span>
                    <span>Vos coordonnées professionnelles</span>
                  </div>

                  {/* Prénom & Nom */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">Prénom *</label>
                      <Input
                        type="text"
                        name="prenom"
                        required
                        value={formData.prenom}
                        onChange={handleChange}
                        placeholder="Moussa"
                        variant="gray"
                        className="text-xs font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">Nom *</label>
                      <Input
                        type="text"
                        name="nom"
                        required
                        value={formData.nom}
                        onChange={handleChange}
                        placeholder="Diallo"
                        variant="gray"
                        className="text-xs font-bold"
                      />
                    </div>
                  </div>

                  {/* Adresse */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Adresse *</label>
                    <Input
                      type="text"
                      name="adresse"
                      required
                      value={formData.adresse}
                      onChange={handleChange}
                      placeholder="Rufisque"
                      variant="gray"
                      className="text-xs font-bold"
                    />
                  </div>

                  {/* Numéro WhatsApp */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">
                      Numéro WhatsApp (Notifications réservations) *
                    </label>
                    <div className="flex items-center bg-[#f3f4f6] rounded-[8px] border border-transparent focus-within:bg-white focus-within:border-vert-principal overflow-hidden">
                      <span className="px-3.5 py-3 text-xs font-bold text-gray-500 bg-gray-200/60 border-r border-gray-300">
                        +221
                      </span>
                      <input
                        type="text"
                        name="whatsapp"
                        required
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="77 000 00 00"
                        className="w-full bg-transparent px-4 py-3 text-xs font-bold text-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Mot de passe */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">
                      Mot de passe d'accès gérant *
                    </label>
                    <Input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="8 caractères minimum"
                      variant="gray"
                      className="text-xs font-bold"
                    />
                    <p className="text-[10px] text-gray-400">
                      Ce mot de passe servira à connecter l'application de contrôle à l'accueil.
                    </p>
                  </div>
                </div>

                {/* COLONNE 2 : VOTRE COMPLEXE SPORTIF */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-[#004030] font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-vert-clair flex items-center justify-center text-xs">2</span>
                    <span>Votre complexe sportif</span>
                  </div>

                  {/* Nom officiel du complexe */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Nom officiel du complexe *</label>
                    <Input
                      type="text"
                      name="nomComplexe"
                      required
                      value={formData.nomComplexe}
                      onChange={handleChange}
                      placeholder="ex: Olympique Club Almadies"
                      variant="gray"
                      className="text-xs font-bold"
                    />
                  </div>

                  {/* Ville & Quartier d'implantation */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Ville & Quartier d'Implantation *</label>
                    <select
                      name="quartier"
                      required
                      value={formData.quartier}
                      onChange={handleChange}
                      className="w-full bg-[#f3f4f6] border border-transparent rounded-[8px] px-4 py-3 text-xs font-bold text-gray-900 focus:outline-none focus:bg-white focus:border-[#004030] cursor-pointer"
                    >
                      <option value="">Sélectionnez une zone</option>
                      <option value="Almadies">Almadies, Dakar</option>
                      <option value="Mermoz">Mermoz, Dakar</option>
                      <option value="Fann">Fann, Dakar</option>
                      <option value="Yoff">Yoff, Dakar</option>
                      <option value="Rufisque">Rufisque, Dakar</option>
                      <option value="Guédiawaye">Guédiawaye, Dakar</option>
                    </select>
                  </div>

                  {/* Document d'identité ou RCCM (Dropzone) */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Document d'identité ou RCCM *</label>
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleFileDrop}
                      className="border-2 border-dashed border-sky-300 bg-sky-50/20 rounded-[8px] p-6 text-center space-y-2 hover:bg-sky-50/50 transition-colors cursor-pointer relative"
                    >
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload size={24} className="text-sky-500 mx-auto" />
                      
                      {formData.document ? (
                        <p className="text-xs font-bold text-emerald-700">
                          Fichier sélectionné : {formData.document.name}
                        </p>
                      ) : (
                        <div>
                          <p className="text-xs text-gray-700">
                            Drop here to attach or <span className="text-sky-600 font-bold underline">upload</span>
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1">Max size: 5GB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Check if form is complete */}
              {(() => {
                const isFormComplete = Boolean(
                  formData.prenom.trim() &&
                  formData.nom.trim() &&
                  formData.adresse.trim() &&
                  formData.whatsapp.trim() &&
                  formData.password.trim() &&
                  formData.nomComplexe.trim() &&
                  formData.quartier &&
                  formData.document
                );

                return (
                  <div className="pt-4 text-left">
                    <Button
                      type="submit"
                      disabled={!isFormComplete}
                      variant="gold"
                      size="md"
                      rounded="8px"
                      className="py-3.5 px-8 font-extrabold inline-flex items-center gap-2"
                    >
                      <span>Envoyer ma demande d'adhésion</span>
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                );
              })()}

            </form>
          )}

        </div>
      </section>

    </div>
  );
}
