# Sama-Terrain — Frontend (React + Vite)

Interface web de **Sama-Terrain**, plateforme sénégalaise de réservation en temps réel de créneaux pour complexes de mini-foot. Ce dossier contient l'application React consommée par les 3 types d'utilisateurs (amateur, gérant, administrateur), qui communique avec l'[API Django](../backend/README.md) (elle-même reliée au [micro-service IA](../IA/README.md)).

Projet réalisé dans le cadre de la certification **DWWM + IA** — Simplon Sénégal (programme Fabrique 360).

## Sommaire

- [Stack technique](#stack-technique)
- [Installation et lancement](#installation-et-lancement)
- [Variables d'environnement](#variables-denvironnement)
- [Organisation du code](#organisation-du-code)
- [Les 3 espaces de l'application](#les-3-espaces-de-lapplication)
- [Fonctionnement général](#fonctionnement-général)
- [Points d'attention pour continuer le projet](#points-dattention-pour-continuer-le-projet)

## Stack technique

| Composant | Choix |
|---|---|
| Framework | React 19 + Vite |
| Routage | React Router (`react-router-dom`) |
| Style | Tailwind CSS (via `@tailwindcss/vite`) |
| Requêtes HTTP | Axios, avec un intercepteur qui gère automatiquement le rafraîchissement du token JWT |
| Graphiques | Recharts |
| Icônes | Lucide React |
| Authentification | JWT (stocké côté client) + bouton "Sign in with Google" natif |

## Installation et lancement

```bash
npm install
cp .env.example .env    # si absent, voir la section suivante pour le contenu attendu
npm run dev
```

L'application est alors disponible sur **http://localhost:5173** (Vite choisit automatiquement un autre port si celui-ci est déjà occupé).

Le [backend Django](../backend/README.md) doit tourner en parallèle (par défaut sur `http://127.0.0.1:8000`) pour que l'application fonctionne réellement — sans lui, les appels API échoueront.

```bash
npm run build      # build de production dans dist/
npm run preview    # sert le build de production en local, pour vérifier avant déploiement
npm run lint       # vérifie le code avec ESLint
```

## Variables d'environnement

**Le fichier `.env` doit être à la racine de `frontend/`**, jamais dans `src/` — Vite ne charge les variables `VITE_*` que depuis la racine du projet, sinon elles valent `undefined` sans avertissement (bug déjà rencontré sur ce projet, notamment pour Google Sign-In).

```env
# URL de l'API Django (avec le préfixe /api)
VITE_API_URL=http://127.0.0.1:8000/api

# Même Client ID que IDCLIENT côté backend/.env — c'est un identifiant
# public, pas un secret : normal qu'il soit visible dans le code du navigateur.
VITE_GOOGLE_CLIENT_ID=xxxxxxxxxx.apps.googleusercontent.com
```

Toute variable d'environnement modifiée nécessite un **redémarrage du serveur Vite** (`npm run dev`) : elles ne sont lues qu'au démarrage, pas rechargées à chaud.

## Organisation du code

```
src/
├── pages/            Une page = un écran complet, organisées par espace
│   ├── amateur/       Accueil, recherche, détail terrain, réservation, paiement, mes réservations
│   ├── gerant/         Dashboard, mes terrains, créneaux & tarifs, revenus, abonnement, scanner ticket
│   ├── admin/          Dashboard, utilisateurs, validation gérants, modération avis, statistiques
│   └── auth/            Connexion, inscription, vérification email
│
├── components/        Composants réutilisables, organisés par domaine (mêmes catégories que pages/)
│   ├── ui/              Composants génériques (Button, Alert, Badge...)
│   └── layout/          Navbar, Footer, structure commune
│
├── services/          Toute la logique d'appel à l'API backend, un fichier par domaine métier
│                       (terrainService, reservationService, gerantService, adminService...).
│                       Chaque service normalise aussi les données reçues du backend (snake_case
│                       → camelCase, libellés français) pour que les pages restent simples.
│
├── routes/            Définition des routes (AppRoutes.jsx) + gardes d'accès :
│                       - ProtectedRoute : bloque une route selon le rôle connecté
│                       - RequireAbonnementActif : bloque l'espace gérant si abonnement expiré
│
├── context/           AuthContext : utilisateur connecté, disponible partout sans prop drilling
├── hooks/             Hooks personnalisés (useAuth, usePaiement)
├── utils/             Fonctions pures partagées (formatage de dates, rôles, villes, jours...)
└── styles/            Styles globaux Tailwind
```

## Les 3 espaces de l'application

L'application sert **un seul rôle à la fois** selon le compte connecté (pas de bascule manuelle) :

- **Espace amateur** (accessible aussi sans connexion pour parcourir le catalogue) : recherche de terrains, réservation avec avance en ligne (Wave/Orange Money), suivi des réservations, ticket QR, dépôt d'avis après avoir joué, chatbot d'assistance (IA) sur la page d'accueil.
- **Espace gérant** (`/gerant/...`, protégé) : tableau de bord, gestion des terrains et de leurs photos, configuration des créneaux et tarifs (grille hebdomadaire + ajustements ponctuels), suivi des revenus, scan des tickets QR à l'entrée, gestion de l'abonnement mensuel.
- **Espace admin** (`/admin/...`, protégé) : statistiques globales de la plateforme, gestion de tous les comptes (activer/suspendre/supprimer), validation ou rejet des demandes "Devenir gérant", modération des avis signalés, détail complet d'un gérant donné (ses terrains, revenus, abonnement, historique de paiements).

Un utilisateur déjà connecté en tant que gérant ou admin qui atterrit sur `/` est automatiquement redirigé vers son propre espace plutôt que de voir la page d'accueil publique amateur.

## Fonctionnement général

- **Authentification** : à la connexion (classique ou Google), le token JWT et l'utilisateur sont stockés côté client (`localStorage`) via `AuthContext`. Un intercepteur Axios (`services/api.js`) rafraîchit automatiquement le token expiré et rejoue la requête d'origine une seule fois, sans que l'utilisateur ait à se reconnecter manuellement (le token expire au bout d'1h, le refresh token dure 7 jours).
- **Protection des routes** : `ProtectedRoute` vérifie le rôle autorisé pour une route donnée ; `RequireAbonnementActif` bloque en plus l'accès à l'espace gérant si son abonnement est expiré (redirection vers la page de paiement de l'abonnement).
- **Paiements** : le frontend ne gère jamais directement PayTech — il appelle le backend qui initie le paiement et redirige le navigateur vers la page PayTech externe ; la confirmation réelle arrive de façon asynchrone (IPN backend), donc le frontend affiche un état "en attente" jusqu'au retour sur les pages `/succes` ou `/annule`.
- **IA / chatbot** : le widget de chat sur la page d'accueil (`iaService.js`) appelle le backend, qui relaie vers le micro-service FastAPI. Les réponses peuvent prendre plusieurs secondes (modèles gratuits) ; aucune donnée n'est inventée côté IA, tout est basé sur les vraies données du backend.

## Points d'attention pour continuer le projet

- **Ne jamais mettre le `.env` ailleurs qu'à la racine de `frontend/`** (voir plus haut).
- Les services (`src/services/*.js`) sont le seul endroit qui doit parler à `axios` : une page ne doit jamais appeler `api.get(...)` directement, pour garder toute la logique de normalisation des données à un seul endroit.
- Le bundle de production dépasse actuellement 500 Ko (avertissement Vite au build) — envisager du code-splitting (`import()` dynamique par route) si le temps de chargement devient un problème.
- Aucun test automatisé n'est en place pour le moment sur ce frontend.
