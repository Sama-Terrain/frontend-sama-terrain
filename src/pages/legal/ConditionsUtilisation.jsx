import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import PageLegale from '../../components/legal/PageLegale';
import { CONTACT_SUPPORT } from '../../utils/contactSupport';

// Les règles métier (avance, 15 minutes, 24h, abonnement 7 500 FCFA...) sont
// les mêmes que dans IA/faq/politiques.txt et utils/faqAccueil.js : les
// garder alignées si l'une d'elles change.
const SECTIONS = [
  {
    id: 'objet',
    titre: 'Objet du service',
    contenu: (
      <>
        <p>
          Sama-Terrain est une plateforme en ligne qui permet aux joueurs (« amateurs ») de trouver et
          de réserver des créneaux sur des terrains de mini-foot au Sénégal, et aux propriétaires de
          terrains (« gérants ») de publier et gérer leurs terrains.
        </p>
        <p>
          Sama-Terrain agit comme intermédiaire : le gérant reste seul responsable de son terrain, de
          son état et de l'accueil des joueurs.
        </p>
      </>
    ),
  },
  {
    id: 'acceptation',
    titre: 'Acceptation des conditions',
    contenu: (
      <p>
        En créant un compte ou en effectuant une réservation, vous acceptez les présentes conditions
        ainsi que notre{' '}
        <Link to="/confidentialite" className="text-vert-principal font-semibold hover:underline">
          politique de confidentialité
        </Link>. Si vous ne les acceptez pas, vous ne devez pas utiliser le service.
      </p>
    ),
  },
  {
    id: 'compte',
    titre: 'Création et sécurité du compte',
    contenu: (
      <ul>
        <li>Vous devez fournir des informations exactes et vérifier votre adresse email via le code à 6 chiffres reçu (valable 15 minutes).</li>
        <li>Vous êtes responsable de la confidentialité de votre mot de passe et de toute activité réalisée depuis votre compte.</li>
        <li>Un compte est personnel : il ne peut pas être cédé ni partagé.</li>
      </ul>
    ),
  },
  {
    id: 'reservations',
    titre: 'Réservations et paiement',
    contenu: (
      <ul>
        <li>Une réservation n'est confirmée qu'après le paiement en ligne d'une <strong>avance</strong> (minimum 5 000 FCFA, montant fixé par le terrain), via Wave ou Orange Money grâce à PayTech.</li>
        <li>En cas d'annulation, les frais de transaction liés au paiement de l'avance restent à la charge du joueur (voir ci-dessous).</li>
        <li>Vous disposez de <strong>15 minutes</strong> après le choix du créneau pour payer l'avance ; passé ce délai, la réservation est annulée automatiquement et le créneau est libéré.</li>
        <li>Le <strong>solde</strong> (prix total moins l'avance) se règle en espèces, sur place, auprès du gérant, le jour du match.</li>
        <li>Un ticket QR est délivré après confirmation ; il doit être présenté au gérant à l'arrivée.</li>
      </ul>
    ),
  },
  {
    id: 'annulation',
    titre: 'Annulation et remboursement',
    contenu: (
      <ul>
        <li>Annulation <strong>plus de 24 heures</strong> avant le match : l'avance est remboursée sur le moyen de paiement utilisé, <strong>déduction faite des frais de transaction</strong> (PayTech, Wave ou Orange Money).</li>
        <li>Ces <strong>frais d'annulation sont à la charge du joueur</strong> : ils correspondent au coût du paiement déjà effectué et ne sont pas récupérables. Leur montant exact vous est indiqué avant que vous confirmiez l'annulation.</li>
        <li>Annulation <strong>moins de 24 heures</strong> avant le match : l'annulation reste possible, mais l'avance n'est plus remboursable.</li>
      </ul>
    ),
  },
  {
    id: 'gerants',
    titre: 'Obligations des gérants',
    contenu: (
      <ul>
        <li>Toute demande de compte gérant doit être accompagnée d'un document justificatif (pièce d'identité ou registre de commerce) et est soumise à la validation d'un administrateur.</li>
        <li>Après validation, le gérant bénéficie de <strong>7 jours d'essai gratuit</strong>, puis d'un <strong>abonnement mensuel de 7 500 FCFA</strong>. Sans renouvellement, l'accès à l'espace gérant est suspendu automatiquement jusqu'au paiement.</li>
        <li>Le gérant s'engage à publier des informations exactes (photos, prix, équipements, horaires) et à honorer les réservations confirmées.</li>
        <li>Les avances encaissées sont versées sur le portefeuille du gérant et deviennent retirables à moins de 24 heures du match, une fois la période de remboursement passée.</li>
      </ul>
    ),
  },
  {
    id: 'comportement',
    titre: 'Règles de conduite et avis',
    contenu: (
      <>
        <p>Il est interdit d'utiliser Sama-Terrain pour :</p>
        <ul>
          <li>publier des avis faux, injurieux, discriminatoires ou sans rapport avec le terrain ;</li>
          <li>effectuer des réservations frauduleuses ou des annulations abusives répétées ;</li>
          <li>tenter de contourner le paiement ou d'accéder aux comptes d'autres utilisateurs.</li>
        </ul>
        <p>Les avis sont modérés et peuvent être retirés s'ils ne respectent pas ces règles.</p>
      </>
    ),
  },
  {
    id: 'suspension',
    titre: 'Suspension de compte',
    contenu: (
      <p>
        En cas de non-respect de ces conditions, Sama-Terrain peut suspendre ou supprimer un compte,
        après avertissement lorsque c'est possible. Vous pouvez de votre côté demander la fermeture de
        votre compte à tout moment.
      </p>
    ),
  },
  {
    id: 'responsabilite',
    titre: 'Responsabilité',
    contenu: (
      <p>
        Sama-Terrain s'efforce d'assurer un service disponible et des informations à jour, sans pouvoir
        le garantir en permanence (maintenance, panne d'un prestataire de paiement, coupure réseau).
        Sama-Terrain n'est pas responsable des incidents survenant sur le terrain pendant un match, ni
        de l'état des installations, qui relèvent du gérant. Les recommandations produites par l'IA
        (prix suggérés, réponses du chatbot) sont indicatives.
      </p>
    ),
  },
  {
    id: 'droit-applicable',
    titre: 'Droit applicable et contact',
    contenu: (
      <p>
        Les présentes conditions sont régies par le droit sénégalais. En cas de litige, nous vous
        invitons à nous contacter d'abord à{' '}
        <a href={`mailto:${CONTACT_SUPPORT.email}`} className="text-vert-principal font-semibold hover:underline">
          {CONTACT_SUPPORT.email}
        </a>{' '}
        pour trouver une solution amiable ; à défaut, les tribunaux de Dakar seront compétents.
      </p>
    ),
  },
];

export default function ConditionsUtilisation() {
  return (
    <PageLegale
      icone={FileText}
      titre="Conditions d'utilisation"
      sousTitre="Les règles qui encadrent l'utilisation de Sama-Terrain, pour les joueurs comme pour les gérants."
      miseAJour="5 octobre 2026"
      sections={SECTIONS}
    />
  );
}
