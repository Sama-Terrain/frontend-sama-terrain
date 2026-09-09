import { Link } from 'react-router-dom';
import { Globe, Share2 } from 'lucide-react';
import logoBlanc from '../../assets/sama-logo-clair.png';

export default function Footer() {
  return (
    <footer className="bg-[#032b1f] text-white pt-16 pb-8 border-t border-[#004030]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grille Principale */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-emerald-900/60 text-left">
          
          {/* Colonne 1: Marque */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <img 
                src={logoBlanc} 
                alt="Logo Sama Terrain" 
                className="h-24 w-auto object-contain cursor-pointer" 
              />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm font-normal">
              La plateforme n°1 au Sénégal pour trouver et réserver des terrains de mini-foot près de chez vous. Rejoignez la communauté des passionnés du ballon rond.
            </p>
          </div>

          {/* Colonne 2: Navigation (Titre en #D4AF37) */}
          <div>
            <h4 className="text-sm font-bold text-[#D4AF37] mb-4 tracking-wide">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/terrains" className="hover:text-white transition-colors">
                  Terrains
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link to="/gerant" className="hover:text-white transition-colors">
                  Devenir Gérant
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3: Support & Légal (Titre en #D4AF37) */}
          <div>
            <h4 className="text-sm font-bold text-[#D4AF37] mb-4 tracking-wide">
              Support & Légal
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <a href="#cgu" className="hover:text-white transition-colors">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="#confidentialite" className="hover:text-white transition-colors">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Nous contacter
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 4: Contact & Réseaux (Titre en #D4AF37) */}
          <div>
            <h4 className="text-sm font-bold text-[#D4AF37] mb-4 tracking-wide">
              Contact & Réseaux
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300 mb-6">
              <li>Dakar, Sénégal</li>
              <li>contact@samaterrain.sn</li>
              <li>+221 33 800 00 00</li>
            </ul>

            {/* Icones Réseaux Sociaux Cercle Vert */}
            <div className="flex space-x-3">
              <a href="#facebook" className="w-9 h-9 rounded-full bg-[#004d3a] flex items-center justify-center text-white hover:bg-emerald-500 transition-colors" title="Facebook">
                <Globe size={18} />
              </a>
              <a href="#instagram" className="w-9 h-9 rounded-full bg-[#004d3a] flex items-center justify-center text-white hover:bg-emerald-500 transition-colors" title="Instagram">
                <Share2 size={18} />
              </a>
            </div>
          </div>

        </div>

        {/* Bas de page avec année 2024 comme sur la maquette */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-300">
          <p>© 2024 Sama-Terrain. Tous droits réservés.</p>
          <p className="mt-2 md:mt-0 flex items-center gap-1.5">
            Fait au Sénégal avec passion 🇸🇳
          </p>
        </div>

      </div>
    </footer>
  );
}
