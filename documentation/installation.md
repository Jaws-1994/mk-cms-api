# Installation et configuration

## Prérequis

- Node.js avec npm
- Un serveur MySQL joignable depuis l’application
- Une base de données créée avec la table `users` décrite dans
  [Base de données](base-de-donnees.md)

## Installation

Depuis la racine du dépôt :

```bash
npm install
```

Copiez le modèle des variables puis configurez vos valeurs locales :

```bash
# Windows PowerShell
Copy-Item .env-exemple .env

# macOS / Linux
cp .env-exemple .env
```

Renseignez les six variables de `.env` :

| Variable | Description |
| --- | --- |
| `DB_HOST` | Nom d’hôte ou adresse du serveur MySQL |
| `DB_PORT` | Port MySQL (généralement `3306`) |
| `DB_USER` | Utilisateur MySQL |
| `DB_PASSWORD` | Mot de passe MySQL |
| `DB_NAME` | Nom de la base de données |
| `JWT_SECRET` | Secret utilisé pour signer et vérifier les jetons JWT |

Générez un secret JWT aléatoire et gardez-le confidentiel. Changer ce secret
invalide les jetons émis précédemment. N’ajoutez jamais `.env` au dépôt et
n’utilisez pas les valeurs d’exemple en production.

## Lancer l’application

```bash
npm run dev
```

Nuxt affiche l’adresse locale dans le terminal (habituellement
`http://localhost:3000`). Les routes API sont servies sous `/api`.

## Scripts disponibles

| Commande | Utilisation |
| --- | --- |
| `npm run dev` | Démarrage en développement |
| `npm run build` | Construction de production |
| `npm run preview` | Prévisualisation de la construction |
| `npm run generate` | Génération statique |

## Configuration CORS

Le middleware CORS autorise actuellement toutes les origines et les méthodes
`GET`, `POST`, `PATCH`, `DELETE` et `OPTIONS`. Avant de rendre l’API publique,
limitez l’origine aux applications clientes de confiance.
