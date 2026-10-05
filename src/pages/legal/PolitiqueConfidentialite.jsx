import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import PageLegale from '../../components/legal/PageLegale';
import { CONTACT_SUPPORT } from '../../utils/contactSupport';

const SECTIONS = [
  {
    id: 'responsable',
    titre: 'Responsable du traitement',
    contenu: (
      <>
        <p>
          Les données personnelles collectées sur Sama-Terrain sont traitées par l'équipe Sama-Terrain,
          basée à {CONTACT_SUPPORT.adresse}, conformément à la <strong>loi n° 2008-12 du 25 janvier 2008</strong>{' '}
          sur la protection des données à caractère personnel au Sénégal.
        </p>
        <p>
          Pour toute question relative à vos données, vous pouvez nous écrire à{' '}
          <a href={`mailto:${CONTACT_SUPPORT.email}`} className="text-vert-principal font-semibold hover:underline">
            {CONTACT_SUPPORT.email}
          </a>.
        </p>
      </>
    ),
  },
  {
    id: 'donnees-collectees',
    titre: 'Données que nous collectons',
    contenu: (
      <>
        <p>Nous collectons uniquement les données nécessaires au fonctionnement du service :</p>
        <ul>
          <li><strong>Compte</strong> : prénom, nom, adresse email, numéro de téléphone, ville préférée, mot de passe (stocké chiffré, jamais en clair).</li>
          <li><strong>Connexion Google</strong> : si vous utilisez « Se connecter avec Google », nous recevons uniquement votre nom et votre adresse email.</li>
          <li><strong>Réservations</strong> : terrains réservés, dates, créneaux, montants de l'avance et du solde, tickets QR générés.</li>
          <li><strong>Paiements</strong> : référence de transaction, montant et moyen utilisé (Wave ou Orange Money). Vos identifiants de paiement sont saisis chez PayTech et ne transitent jamais par nos serveurs.</li>
          <li><strong>Gérants</strong> : nom du complexe, quartier, numéro WhatsApp et document justificatif (pièce d'identité ou registre de commerce) transmis lors de la demande.</li>
          <li><strong>Avis</strong> : notes et commentaires que vous publiez sur les terrains.</li>
          <li><strong>Assistant IA</strong> : les messages échangés avec le chatbot, pour pouvoir vous répondre.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'finalites',
    titre: 'Pourquoi nous les utilisons',
    contenu: (
      <ul>
        <li>Créer et sécuriser votre compte (vérification de l'email par code à 6 chiffres).</li>
        <li>Gérer vos réservations, vos paiements, vos remboursements et vos tickets d'accès.</li>
        <li>Vous envoyer les notifications liées au service : confirmation, rappel avant le match, annulation, expiration d'abonnement.</li>
        <li>Vérifier l'identité des gérants avant de publier leurs terrains.</li>
        <li>Fournir aux gérants des statistiques et des recommandations de prix basées sur l'activité de leurs terrains (données agrégées).</li>
        <li>Modérer les avis et prévenir les abus (annulations répétées, fraude au paiement).</li>
      </ul>
    ),
  },
  {
    id: 'partage',
    titre: 'Avec qui nous les partageons',
    contenu: (
      <>
        <p>Vos données ne sont <strong>jamais vendues</strong>. Elles sont partagées uniquement avec :</p>
        <ul>
          <li><strong>Le gérant du terrain réservé</strong> : votre nom et les informations de la réservation, pour vous accueillir le jour du match.</li>
          <li><strong>PayTech</strong> : prestataire de paiement qui traite les transactions Wave et Orange Money.</li>
          <li><strong>Google</strong> : uniquement si vous choisissez la connexion Google.</li>
          <li><strong>Fournisseurs d'IA</strong> : le texte de vos questions au chatbot est transmis à un modèle de langage externe pour générer la réponse, sans votre email ni votre téléphone.</li>
          <li><strong>Notre hébergeur et nos outils d'envoi d'emails</strong>, tenus à la confidentialité.</li>
          <li><strong>Les autorités</strong>, si la loi nous y oblige.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'conservation',
    titre: 'Durée de conservation',
    contenu: (
      <ul>
        <li>Données de compte : tant que votre compte est actif, puis supprimées dans un délai de 12 mois après sa fermeture.</li>
        <li>Historique des paiements : conservé le temps imposé par les obligations comptables et fiscales.</li>
        <li>Documents justificatifs des gérants : conservés pendant la durée de l'activité sur la plateforme.</li>
        <li>Codes de vérification : valables 15 minutes, puis inutilisables.</li>
      </ul>
    ),
  },
  {
    id: 'securite',
    titre: 'Sécurité',
    contenu: (
      <p>
        Les échanges avec Sama-Terrain sont chiffrés (HTTPS). Les mots de passe sont hachés, l'accès
        aux espaces gérant et administrateur est protégé par des jetons d'authentification à durée
        limitée, et seules les personnes habilitées peuvent consulter les documents justificatifs.
      </p>
    ),
  },
  {
    id: 'stockage-local',
    titre: 'Stockage local et cookies',
    contenu: (
      <p>
        Nous n'utilisons pas de cookies publicitaires. Votre navigateur conserve uniquement les
        informations techniques nécessaires au fonctionnement du site : vos jetons de connexion
        (pour rester connecté) et quelques préférences d'affichage. Vous pouvez les effacer à tout
        moment en vous déconnectant ou en vidant les données de votre navigateur.
      </p>
    ),
  },
  {
    id: 'droits',
    titre: 'Vos droits',
    contenu: (
      <>
        <p>Conformément à la loi sénégalaise, vous disposez des droits suivants sur vos données :</p>
        <ul>
          <li>droit d'accès et de copie ;</li>
          <li>droit de rectification (modifiable directement depuis votre profil) ;</li>
          <li>droit de suppression de votre compte ;</li>
          <li>droit d'opposition à certains traitements.</li>
        </ul>
        <p>
          Pour les exercer, écrivez à{' '}
          <a href={`mailto:${CONTACT_SUPPORT.email}`} className="text-vert-principal font-semibold hover:underline">
            {CONTACT_SUPPORT.email}
          </a>{' '}
          : nous vous répondrons sous 30 jours. Si vous estimez que vos droits ne sont pas respectés,
          vous pouvez saisir la <strong>Commission de Protection des Données Personnelles (CDP)</strong> du Sénégal.
        </p>
      </>
    ),
  },
  {
    id: 'modifications',
    titre: 'Modifications de cette politique',
    contenu: (
      <p>
        Nous pouvons mettre à jour cette politique pour suivre l'évolution du service ou de la loi.
        La date de dernière mise à jour figure en haut de la page. Consultez aussi nos{' '}
        <Link to="/conditions-utilisation" className="text-vert-principal font-semibold hover:underline">
          conditions d'utilisation
        </Link>.
      </p>
    ),
  },
];

export default function PolitiqueConfidentialite() {
  return (
    <PageLegale
      icone={ShieldCheck}
      titre="Politique de confidentialité"
      sousTitre="Quelles données nous collectons, pourquoi, et comment vous gardez le contrôle dessus."
      miseAJour="5 octobre 2026"
      sections={SECTIONS}
    />
  );
}
