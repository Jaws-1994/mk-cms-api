# MK CMS API

API et application web de démarrage du projet MK CMS, développées avec Nuxt 4.
Le serveur fournit actuellement des routes de test de connexion MySQL et
d’authentification par jeton Bearer. L’interface Nuxt est encore minimale.

## Prérequis

- Node.js et npm
- Un serveur MySQL accessible
- Une base de données possédant la table `users` attendue par les routes

## Démarrage rapide

```bash
npm install
```

Copiez `.env-exemple` en `.env`, puis renseignez les paramètres de connexion à
votre base de données et une clé secrète JWT. Ne publiez jamais votre fichier
`.env`.

```bash
npm run dev
```

L’application est disponible à l’adresse indiquée par Nuxt, habituellement
`http://localhost:3000`.

Consultez le [guide d’installation et de configuration](documentation/installation.md)
pour les détails, la [référence de l’API](documentation/api.md) pour les routes,
et le [guide de la base de données](documentation/base-de-donnees.md) pour le
schéma attendu.

## Scripts

| Commande | Description |
| --- | --- |
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Prépare la version de production |
| `npm run preview` | Prévisualise la version de production |
| `npm run generate` | Génère une version statique |

## Structure du projet

```text
app/                 Interface Nuxt (pages, composants et layouts)
server/api/          Routes HTTP Nitro
server/middleware/   Middleware du serveur (dont CORS)
documentation/       Guides détaillés du projet
.env-exemple         Modèle local de configuration
```

## Documentation

- [Installation et configuration](documentation/installation.md)
- [Routes API](documentation/api.md)
- [Base de données](documentation/base-de-donnees.md)

## Sécurité

- Le fichier `.env` contient des secrets et ne doit pas être commité.
- Utilisez un `JWT_SECRET` long, aléatoire et différent pour chaque
  environnement.
- Les mots de passe des comptes sont stockés sous forme de hash bcrypt.
- Le middleware CORS autorise actuellement toutes les origines (`*`) ;
  restreignez cette règle aux origines de confiance avant un déploiement public.
