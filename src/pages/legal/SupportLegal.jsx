import { Link } from 'react-router-dom';
import { LifeBuoy, Mail, Phone, MessageCircle, MapPin, ShieldCheck, FileText, ChevronRight } from 'lucide-react';
import PageLegale from '../../components/legal/PageLegale';
import FAQAccordion from '../../components/ui/FAQAccordion';
import { FAQ_ACCUEIL } from '../../utils/faqAccueil';
import { CONTACT_SUPPORT } from '../../utils/contactSupport';

const CANAUX_CONTACT = [
  {
    icone: MessageCircle,
    titre: 'WhatsApp',
    detail: CONTACT_SUPPORT.telephone,
    aide: 'Le canal le plus rapide',
    href: `https://wa.me/${CONTACT_SUPPORT.whatsapp}`,
  },
  {
    icone: Mail,
    titre: 'Email',
    detail: CONTACT_SUPPORT.email,
    aide: 'Pour les demandes détaillées',
    href: `mailto:${CONTACT_SUPPORT.email}`,
  },
  {
    icone: Phone,
    titre: 'Téléphone',
    detail: CONTACT_SUPPORT.telephone,
    aide: 'Appel ou SMS',
    href: `tel:${CONTACT_SUPPORT.telephone.replace(/\s/g, '')}`,
  },
];

const DOCUMENTS_LEGAUX = [
  {
    icone: FileText,
    titre: "Conditions d'utilisation",
    description: 'Réservations, paiement, annulation, obligations des gérants.',
    to: '/conditions-utilisation',
  },
  {
    icone: ShieldCheck,
    titre: 'Politique de confidentialité',
    description: 'Données collectées, durée de conservation et vos droits.',
    to: '/confidentialite',
  },
];

const SECTIONS = [
  {
    id: 'contact',
    titre: 'Nous contacter',
    contenu: (
      <>
        <p>
          Un problème de réservation, de paiement ou de compte ? Indiquez-nous si possible la référence
          de votre réservation pour qu'on vous réponde plus vite.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {CANAUX_CONTACT.map(({ icone: Icone, titre, detail, aide, href }) => (
            <a
              key={titre}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group rounded-[8px] border border-gray-200 p-4 hover:border-vert-principal hover:bg-vert-clair/40 transition-colors"
            >
              <span className="w-9 h-9 rounded-full bg-vert-clair text-vert-principal flex items-center justify-center mb-3 group-hover:bg-vert-principal group-hover:text-white transition-colors">
                <Icone size={18} />
              </span>
              <p className="font-bold text-gray-900">{titre}</p>
              <p className="text-sm text-vert-principal font-semibold break-all">{detail}</p>
              <p className="text-xs text-gray-500 mt-1">{aide}</p>
            </a>
          ))}
        </div>
        <p className="flex items-center gap-1.5 text-xs text-gray-500 pt-1">
          <MapPin size={14} /> {CONTACT_SUPPORT.adresse}
        </p>
      </>
    ),
  },
  {
    id: 'faq',
    titre: 'Questions fréquentes',
    contenu: (
      <div className="pt-1 [&>div]:max-w-none">
        <FAQAccordion items={FAQ_ACCUEIL} />
      </div>
    ),
  },
  {
    id: 'documents',
    titre: 'Documents légaux',
    contenu: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DOCUMENTS_LEGAUX.map(({ icone: Icone, titre, description, to }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-center gap-4 rounded-[8px] border border-gray-200 p-4 hover:border-vert-principal transition-colors"
          >
            <span className="w-10 h-10 rounded-full bg-dore/15 text-dore flex items-center justify-center shrink-0">
              <Icone size={20} />
            </span>
            <span className="flex-1">
              <span className="block font-bold text-gray-900">{titre}</span>
              <span className="block text-xs text-gray-500">{description}</span>
            </span>
            <ChevronRight size={18} className="text-gray-400 group-hover:text-vert-principal transition-colors" />
          </Link>
        ))}
      </div>
    ),
  },
  {
    id: 'mentions-legales',
    titre: 'Mentions légales',
    contenu: (
      <ul>
        <li><strong>Éditeur</strong> : Sama-Terrain, {CONTACT_SUPPORT.adresse}. Projet réalisé dans le cadre de la certification DWWM+IA de Simplon Sénégal.</li>
        <li><strong>Contact</strong> : {CONTACT_SUPPORT.email} · {CONTACT_SUPPORT.telephone}</li>
        <li><strong>Paiements</strong> : traités par PayTech (Wave, Orange Money). Sama-Terrain ne stocke aucune donnée de paiement.</li>
        <li><strong>Données personnelles</strong> : traitées conformément à la loi n° 2008-12 du 25 janvier 2008 ; autorité de contrôle : Commission de Protection des Données Personnelles (CDP).</li>
        <li><strong>Propriété intellectuelle</strong> : le nom, le logo et les contenus de Sama-Terrain ne peuvent être reproduits sans autorisation. Les photos des terrains appartiennent à leurs gérants respectifs.</li>
      </ul>
    ),
  },
];

export default function SupportLegal() {
  return (
    <PageLegale
      icone={LifeBuoy}
      titre="Support & Légal"
      sousTitre="Besoin d'aide ? Retrouvez nos moyens de contact, les réponses aux questions fréquentes et nos documents légaux."
      sections={SECTIONS}
    />
  );
}
