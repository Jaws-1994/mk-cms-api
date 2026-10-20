# Documentation de l’API — Projet MK

Source : `Insomnium_projet-mk.json`, collection `test-projet-mk`.
Export du 2026-10-20T11:49:23.653Z · Documentation rédigée le 20 octobre 2026.

## Portée et niveau de certitude

Cette documentation décrit les 26 requêtes configurées dans l’export, regroupées en 14 couples méthode/route. Les variantes locales et Vercel sont rassemblées. Des requêtes ont ensuite été exécutées sur l’URL Vercel de l’export le 20 octobre 2026. Neuf routes distinctes disposent désormais d’une réponse de succès capturée, dont les deux variantes de démarrage de partie.

**L’export ne contient aucune réponse HTTP enregistrée**, aucun code de statut, aucune description de route et aucune spécification API renseignée. Les réponses ci-dessous proviennent des appels réalisés, lorsqu’ils ont été possibles ; les autres points restent à confirmer côté backend. Les fonctions des routes sont déduites de leurs noms et exemples ; les types indiqués sont ceux observés dans les corps JSON, pas un schéma de validation garanti.

## Configuration

| Environnement | URL de base observée |
| --- | --- |
| Local | `http://localhost:3000/api` |
| Vercel | `https://mk-cms-api-remake.vercel.app/api` |

Les routes ci-dessous incluent déjà le préfixe `/api`. Ajouter seulement la partie qui suit `/api` à une URL de base ci-dessus. La présence d’une URL dans l’export ne confirme pas sa disponibilité actuelle.

### En-têtes et authentification

Pour les requêtes avec corps JSON :

```http
Content-Type: application/json
```

Quand un Bearer est configuré :

```http
Authorization: Bearer <TOKEN>
```

Les jetons réels de l’export ne sont pas reproduits. `User-Agent: insomnium/0.2.3-a` est un en-tête du client de test et n’est pas présenté ici comme une exigence du backend.

« Sans Bearer configuré » décrit uniquement la requête exportée : cela ne prouve pas que le serveur autorise l’accès anonyme. De même, un Bearer configuré ne prouve pas à lui seul que l’authentification est obligatoire. Les lectures `/admin` ont réussi avec un jeton administrateur. Le comportement avec un jeton joueur n’a pas été testé.

Aucun paramètre de query string n’est configuré dans les 26 requêtes. Aucun cookie n’est enregistré dans le cookie jar exporté.

## Sommaire des routes

| Méthode | Route | Usage | Authentification configurée | Environnement observé |
| --- | --- | --- | --- | --- |
| `GET` | `/api/test-db` | Test de connexion à la base de données | Sans Bearer | Local |
| `POST` | `/api/auth/register` | Inscription | Sans Bearer | Local, Vercel |
| `POST` | `/api/auth/login` | Connexion | Sans Bearer | Local, Vercel |
| `GET` | `/api/auth/me` | Utilisateur connecté | Bearer | Local, Vercel |
| `GET` | `/api/admin/users` | Liste des utilisateurs | Bearer | Local, Vercel |
| `PATCH` | `/api/user/:id` | Compte utilisateur | Bearer | Vercel |
| `DELETE` | `/api/user/:id` | Compte utilisateur | Bearer | Vercel |
| `DELETE` | `/api/admin/user/:id` | Administration d’un utilisateur | Bearer | Local |
| `GET` | `/api/leaderboard` | Classement général | Sans Bearer | Local, Vercel |
| `GET` | `/api/category` | Catégories | Sans Bearer | Local, Vercel |
| `POST` | `/api/game/start` | Démarrer une partie | Bearer selon la variante | Local, Vercel |
| `POST` | `/api/game/correction` | Corriger une partie | Bearer | Local, Vercel |
| `PATCH` | `/api/admin/user/:id` | Administration d’un utilisateur | Bearer | Local, Vercel |
| `GET` | `/api/admin/quotes` | Liste des citations | Bearer | Local, Vercel |

## Détail des routes

### `GET /api/test-db`

Fonction déduite du nom de la requête : tester la connexion à la base de données.

**Exemple : test-db localhost**

Authentification configurée : aucun Bearer.

Corps : aucun corps configuré.

**Réponse observée — HTTP 200**

Capture Vercel : `2026-10-20T13:47:30.647997+00:00`. Authentification : sans Bearer. Variante : /api/test-db.

```json
{
  "ok": 1
}
```

**Champs de la réponse de succès**

| Champ | Type observé |
| --- | --- |
| `ok` | `integer` |

Les types décrivent cet échantillon ; `null` ne permet pas d’inférer les autres valeurs acceptées.

### `POST /api/auth/register`

Créer un compte utilisateur (fonction déduite du nom de la route).

**Exemple : post register local**

Authentification configurée : aucun Bearer.

```json
{
  "pseudo": "joueur",
  "mail": "joueur@example.com",
  "password": "mot_de_passe_exemple"
}
```

| Champ | Type observé | Description |
| --- | --- | --- |
| `pseudo` | `string` | Pseudonyme du compte. |
| `mail` | `string` | Adresse e-mail ; le champ s’appelle bien `mail`. |
| `password` | `string` | Mot de passe du compte. |

Les champs sont présents dans cet exemple. Leur caractère obligatoire, leurs limites et les autres champs acceptés ne sont pas précisés.

**Réponse** : non incluse dans l’export. Aucun exemple de corps de succès ou d’erreur ni code HTTP n’est disponible.

### `POST /api/auth/login`

Se connecter avec une adresse e-mail et un mot de passe.

**Exemple : post login local**

Authentification configurée : aucun Bearer.

```json
{
  "mail": "joueur@example.com",
  "password": "mot_de_passe_exemple"
}
```

| Champ | Type observé | Description |
| --- | --- | --- |
| `mail` | `string` | Adresse e-mail ; le champ s’appelle bien `mail`. |
| `password` | `string` | Mot de passe du compte. |

Les champs sont présents dans cet exemple. Leur caractère obligatoire, leurs limites et les autres champs acceptés ne sont pas précisés.

**Réponse observée — HTTP 200**

Capture Vercel : `2026-10-20T13:49:09.677818+00:00`. Authentification : sans Bearer. Variante : Connexion exemple export.

Exemple de réponse anonymisé ; les longues listes sont abrégées pour la lecture. Les champs et valeurs utiles ci-dessous proviennent de la réponse capturée.

```json
{
  "token": "<TOKEN>",
  "user": {
    "id": 45,
    "pseudo": "kalu2",
    "role": "admin"
  }
}
```

**Champs de la réponse de succès**

| Champ | Type observé |
| --- | --- |
| `token` | `string` |
| `user` | `object` |
| `user.id` | `integer` |
| `user.pseudo` | `string` |
| `user.role` | `string` |

Les types décrivent cet échantillon ; `null` ne permet pas d’inférer les autres valeurs acceptées.

Le champ du jeton est bien `token`. L’objet `user` de connexion utilise `id`, `pseudo`, `role`, alors que `/auth/me` utilise notamment `ID_user`, `user_pseudo` et `user_role`. Ne pas supposer que ces deux objets ont la même structure.

### `GET /api/auth/me`

Consulter les informations de l’utilisateur authentifié.

**Exemple : get me local**

Authentification configurée : Bearer.

Corps : aucun corps configuré.

**Réponse observée — HTTP 401**

Capture Vercel : `2026-10-20T13:47:30.648555+00:00`. Authentification : sans Bearer. Variante : /api/auth/me.

```json
{
  "error": true,
  "url": "https://mk-cms-api-remake.vercel.app/api/auth/me",
  "statusCode": 401,
  "statusMessage": "Token manquant",
  "message": "Token manquant"
}
```

**Réponse observée — HTTP 200**

Capture Vercel : `2026-10-20T13:49:02.547444+00:00`. Authentification : Bearer administrateur. Variante : get me local.

Exemple de réponse anonymisé ; les longues listes sont abrégées pour la lecture. Les champs et valeurs utiles ci-dessous proviennent de la réponse capturée.

```json
{
  "ID_user": 45,
  "user_pseudo": "kalu2",
  "user_mail": "joueur@example.com",
  "user_score": 2116,
  "user_role": "admin",
  "user_avatar_color": "blue",
  "user_avatar_emotion": "happy",
  "user_avatar_hat_id": null
}
```

**Champs de la réponse de succès**

| Champ | Type observé |
| --- | --- |
| `ID_user` | `integer` |
| `user_pseudo` | `string` |
| `user_mail` | `string` |
| `user_score` | `integer` |
| `user_role` | `string` |
| `user_avatar_color` | `string` |
| `user_avatar_emotion` | `string` |
| `user_avatar_hat_id` | `null` |

Les types décrivent cet échantillon ; `null` ne permet pas d’inférer les autres valeurs acceptées.

### `GET /api/admin/users`

Consulter les utilisateurs depuis l’administration.

**Exemple : ADMIN get all user local**

Authentification configurée : Bearer.

Corps : aucun corps configuré.

**Réponse observée — HTTP 401**

Capture Vercel : `2026-10-20T13:47:36.462556+00:00`. Authentification : sans Bearer. Variante : /api/admin/users.

```json
{
  "error": true,
  "url": "https://mk-cms-api-remake.vercel.app/api/admin/users",
  "statusCode": 401,
  "statusMessage": "Token manquant",
  "message": "Token manquant"
}
```

**Réponse observée — HTTP 200**

Capture Vercel : `2026-10-20T13:49:02.548052+00:00`. Authentification : Bearer administrateur. Variante : ADMIN get all user local.

Exemple de réponse anonymisé ; les longues listes sont abrégées pour la lecture. Les champs et valeurs utiles ci-dessous proviennent de la réponse capturée.

```json
{
  "users": [
    {
      "ID_user": 49,
      "user_pseudo": "aaaaaaaaa",
      "user_mail": "joueur@example.com",
      "user_score": 0,
      "user_role": "player",
      "user_is_blocked": 0,
      "user_avatar_color": "blue",
      "user_avatar_emotion": "happy",
      "user_avatar_hat_id": null
    },
    {
      "ID_user": 43,
      "user_pseudo": "admin",
      "user_mail": "joueur@example.com",
      "user_score": 0,
      "user_role": "admin",
      "user_is_blocked": 0,
      "user_avatar_color": "blue",
      "user_avatar_emotion": "happy",
      "user_avatar_hat_id": null
    }
  ]
}
```

**Champs de la réponse de succès**

| Champ | Type observé |
| --- | --- |
| `users` | `array` |
| `users[].ID_user` | `integer` |
| `users[].user_pseudo` | `string` |
| `users[].user_mail` | `string` |
| `users[].user_score` | `integer` |
| `users[].user_role` | `string` |
| `users[].user_is_blocked` | `integer` |
| `users[].user_avatar_color` | `string` |
| `users[].user_avatar_emotion` | `string` |
| `users[].user_avatar_hat_id` | `null` |

Les types décrivent cet échantillon ; `null` ne permet pas d’inférer les autres valeurs acceptées.

### `PATCH /api/user/:id`

Modifier ou supprimer le compte ciblé, selon la méthode HTTP.

L’export ne permet pas de confirmer si seul le propriétaire du compte peut agir, ni si un administrateur dispose de droits supplémentaires.

**Paramètre de chemin**

| Paramètre | Format observé | Description |
| --- | --- | --- |
| `id` | Entier dans l’URL | Identifiant de l’utilisateur ciblé ; exemple : `44`. |

**Exemple : patch user/:id local**

Authentification configurée : Bearer.

```json
{
  "user_avatar_color": "yellow"
}
```

| Champ | Type observé | Description |
| --- | --- | --- |
| `user_avatar_color` | `string` | Couleur de l’avatar ; seule la valeur `yellow` est illustrée. |

Les champs sont présents dans cet exemple. Leur caractère obligatoire, leurs limites et les autres champs acceptés ne sont pas précisés.

**Réponse** : non incluse dans l’export. Aucun exemple de corps de succès ou d’erreur ni code HTTP n’est disponible.

### `DELETE /api/user/:id`

Modifier ou supprimer le compte ciblé, selon la méthode HTTP.

L’export ne permet pas de confirmer si seul le propriétaire du compte peut agir, ni si un administrateur dispose de droits supplémentaires.

**Paramètre de chemin**

| Paramètre | Format observé | Description |
| --- | --- | --- |
| `id` | Entier dans l’URL | Identifiant de l’utilisateur ciblé ; exemple : `44`. |

**Exemple : delete user/:id local**

Authentification configurée : Bearer.

Corps : aucun corps configuré.

**Réponse** : non incluse dans l’export. Aucun exemple de corps de succès ou d’erreur ni code HTTP n’est disponible.

### `DELETE /api/admin/user/:id`

Modifier ou supprimer un utilisateur depuis l’administration.

**Paramètre de chemin**

| Paramètre | Format observé | Description |
| --- | --- | --- |
| `id` | Entier dans l’URL | Identifiant de l’utilisateur ciblé ; exemple : `28`. |

**Exemple : ADMIN delete user/:id local**

Authentification configurée : Bearer.

Corps : aucun corps configuré.

**Réponse** : non incluse dans l’export. Aucun exemple de corps de succès ou d’erreur ni code HTTP n’est disponible.

### `GET /api/leaderboard`

Consulter le classement. La capture expose les identifiants, pseudonymes et scores ; la pagination reste à confirmer.

**Exemple : get leaderboard local**

Authentification configurée : aucun Bearer.

Corps : aucun corps configuré.

**Réponse observée — HTTP 200**

Capture Vercel : `2026-10-20T13:47:30.647493+00:00`. Authentification : sans Bearer. Variante : /api/leaderboard.

Exemple de réponse anonymisé ; les longues listes sont abrégées pour la lecture. Les champs et valeurs utiles ci-dessous proviennent de la réponse capturée.

```json
{
  "leaderboard": [
    {
      "ID_user": 45,
      "user_pseudo": "kalu2",
      "user_score": 2116
    },
    {
      "ID_user": 46,
      "user_pseudo": "Le big F",
      "user_score": 248
    },
    {
      "ID_user": 31,
      "user_pseudo": "testdeploy",
      "user_score": 0
    }
  ]
}
```

**Champs de la réponse de succès**

| Champ | Type observé |
| --- | --- |
| `leaderboard` | `array` |
| `leaderboard[].ID_user` | `integer` |
| `leaderboard[].user_pseudo` | `string` |
| `leaderboard[].user_score` | `integer` |

Les types décrivent cet échantillon ; `null` ne permet pas d’inférer les autres valeurs acceptées.

### `GET /api/category`

Consulter les catégories. La réponse capturée expose `categories`, avec `ID_genre` et `genre_name`.

**Exemple : get category local**

Authentification configurée : aucun Bearer.

Corps : aucun corps configuré.

**Réponse observée — HTTP 200**

Capture Vercel : `2026-10-20T13:47:30.646815+00:00`. Authentification : sans Bearer. Variante : /api/category.

```json
{
  "categories": [
    {
      "ID_genre": 5,
      "genre_name": "Action"
    },
    {
      "ID_genre": 6,
      "genre_name": "Horreur"
    }
  ]
}
```

**Champs de la réponse de succès**

| Champ | Type observé |
| --- | --- |
| `categories` | `array` |
| `categories[].ID_genre` | `integer` |
| `categories[].genre_name` | `string` |

Les types décrivent cet échantillon ; `null` ne permet pas d’inférer les autres valeurs acceptées.

### `POST /api/game/start`

Deux variantes sont présentes : une partie invitée avec `category`, et une partie personnalisée avec `genre_ids`.

**Exemple : post game/start guest local**

Authentification configurée : aucun Bearer.

```json
{
  "category": "all"
}
```

| Champ | Type observé | Description |
| --- | --- | --- |
| `category` | `string` | Sélection de catégories ; seule la valeur `all` est illustrée. |

Les champs sont présents dans cet exemple. Leur caractère obligatoire, leurs limites et les autres champs acceptés ne sont pas précisés.

**Exemple : post game/start personnalisée local**

Authentification configurée : Bearer.

```json
{
  "genre_ids": [
    5,
    6
  ]
}
```

| Champ | Type observé | Description |
| --- | --- | --- |
| `genre_ids` | `array<integer>` | Liste d’identifiants de genres ; exemple : `[5, 6]`. |

Les champs sont présents dans cet exemple. Leur caractère obligatoire, leurs limites et les autres champs acceptés ne sont pas précisés.

Les variantes `category` et `genre_ids` sont envoyées séparément. L’export ne précise pas si elles peuvent être combinées, si d’autres valeurs de `category` existent, ni si une partie personnalisée est autorisée sans connexion. Les deux captures renvoient 10 questions, 4 propositions par question, une limite de 30 000 ms et un `game_token`. La durée de vie de la partie reste à confirmer.

**Réponse observée — HTTP 200**

Capture Vercel : `2026-10-20T13:49:09.696409+00:00`. Authentification : sans Bearer. Variante : Démarrage invité.

Exemple de réponse anonymisé ; les longues listes sont abrégées pour la lecture. Les champs et valeurs utiles ci-dessous proviennent de la réponse capturée.

```json
{
  "game_id": "2b34aa9e-98ff-460c-87fc-31b123be9497",
  "genre": {
    "ID_genre": null,
    "genre_name": "Toutes les catégories"
  },
  "genres": [
    {
      "ID_genre": 5,
      "genre_name": "Action"
    },
    {
      "ID_genre": 6,
      "genre_name": "Horreur"
    }
  ],
  "question_count": 10,
  "question_time_limit_ms": 30000,
  "questions": [
    {
      "question_id": "q1",
      "quote": {
        "ID_quote": 1,
        "quote_text": "I'll be back.",
        "quote_language": "en"
      },
      "options": [
        {
          "ID_movie": 2,
          "movie_title": "Die Hard"
        },
        {
          "ID_movie": 26,
          "movie_title": "Child's Play"
        },
        {
          "ID_movie": 1,
          "movie_title": "The Terminator"
        },
        {
          "ID_movie": 14,
          "movie_title": "Mad Max: Fury Road"
        }
      ]
    }
  ],
  "game_token": "<GAME_TOKEN>"
}
```

**Réponse observée — HTTP 200**

Capture Vercel : `2026-10-20T13:49:10.071362+00:00`. Authentification : Bearer administrateur. Variante : Démarrage personnalisé.

Exemple de réponse anonymisé ; les longues listes sont abrégées pour la lecture. Les champs et valeurs utiles ci-dessous proviennent de la réponse capturée.

```json
{
  "game_id": "eeb59214-92db-429c-970b-7e3ddd141661",
  "genre": {
    "ID_genre": null,
    "genre_name": "Catégories sélectionnées"
  },
  "genres": [
    {
      "ID_genre": 5,
      "genre_name": "Action"
    },
    {
      "ID_genre": 6,
      "genre_name": "Horreur"
    }
  ],
  "question_count": 10,
  "question_time_limit_ms": 30000,
  "questions": [
    {
      "question_id": "q1",
      "quote": {
        "ID_quote": 26,
        "quote_text": "Hi, I'm Chucky. Wanna play?",
        "quote_language": "en"
      },
      "options": [
        {
          "ID_movie": 26,
          "movie_title": "Child's Play"
        },
        {
          "ID_movie": 18,
          "movie_title": "Jaws"
        },
        {
          "ID_movie": 2,
          "movie_title": "Die Hard"
        },
        {
          "ID_movie": 19,
          "movie_title": "Scream"
        }
      ]
    }
  ],
  "game_token": "<GAME_TOKEN>"
}
```

**Champs de la réponse de succès**

| Champ | Type observé |
| --- | --- |
| `game_id` | `string` |
| `genre` | `object` |
| `genre.ID_genre` | `null` |
| `genre.genre_name` | `string` |
| `genres` | `array` |
| `genres[].ID_genre` | `integer` |
| `genres[].genre_name` | `string` |
| `question_count` | `integer` |
| `question_time_limit_ms` | `integer` |
| `questions` | `array` |
| `questions[].question_id` | `string` |
| `questions[].quote` | `object` |
| `questions[].quote.ID_quote` | `integer` |
| `questions[].quote.quote_text` | `string` |
| `questions[].quote.quote_language` | `string` |
| `questions[].options` | `array` |
| `questions[].options[].ID_movie` | `integer` |
| `questions[].options[].movie_title` | `string` |
| `game_token` | `string` |

Les types décrivent cet échantillon ; `null` ne permet pas d’inférer les autres valeurs acceptées.

**À conserver pour la correction invitée :** `game_id` et `game_token`. Ce dernier est distinct du Bearer utilisateur. Dans les captures, chaque question contient `question_id`, `quote` et `options` ; chaque proposition contient `ID_movie` et `movie_title`.

### `POST /api/game/correction`

Envoyer les réponses d’une partie pour correction.

**Exemple : post game/correction guest local**

Authentification configurée : Bearer.

```json
{
  "game_id": "5a36e4c4-9358-4ec6-8498-6780dab7f4bc",
  "answers": [
    {
      "question_id": "q1",
      "selected_movie_id": 27,
      "response_time_ms": 15000
    },
    {
      "question_id": "q2",
      "selected_movie_id": 21,
      "response_time_ms": 15000
    },
    {
      "question_id": "q3",
      "selected_movie_id": 10,
      "response_time_ms": 15000
    },
    {
      "question_id": "q4",
      "selected_movie_id": 12,
      "response_time_ms": 15000
    },
    {
      "question_id": "q5",
      "selected_movie_id": 30,
      "response_time_ms": 15000
    },
    {
      "question_id": "q6",
      "selected_movie_id": 24,
      "response_time_ms": 15000
    },
    {
      "question_id": "q7",
      "selected_movie_id": 19,
      "response_time_ms": 15000
    },
    {
      "question_id": "q8",
      "selected_movie_id": 6,
      "response_time_ms": 15000
    },
    {
      "question_id": "q9",
      "selected_movie_id": 18,
      "response_time_ms": 5000
    },
    {
      "question_id": "q10",
      "selected_movie_id": 4,
      "response_time_ms": 30000
    }
  ]
}
```

| Champ | Type observé | Description |
| --- | --- | --- |
| `game_id` | `string` | Identifiant de partie au format UUID dans les exemples. |
| `answers` | `array<object>` | Réponses associées à la partie ; les deux exemples contiennent 10 réponses. |

Les champs sont présents dans cet exemple. Leur caractère obligatoire, leurs limites et les autres champs acceptés ne sont pas précisés.

**Exemple : post game/correction guest vercel**

Authentification configurée : Bearer.

```json
{
  "game_id": "33cb7045-660a-4f5e-9cea-b0cda21a2d4d",
  "answers": [
    {
      "question_id": "q1",
      "selected_movie_id": 7,
      "response_time_ms": 15000
    },
    {
      "question_id": "q2",
      "selected_movie_id": 25,
      "response_time_ms": 15000
    },
    {
      "question_id": "q3",
      "selected_movie_id": 28,
      "response_time_ms": 15000
    },
    {
      "question_id": "q4",
      "selected_movie_id": 20,
      "response_time_ms": 15000
    },
    {
      "question_id": "q5",
      "selected_movie_id": 21,
      "response_time_ms": 15000
    },
    {
      "question_id": "q6",
      "selected_movie_id": 12,
      "response_time_ms": 15000
    },
    {
      "question_id": "q7",
      "selected_movie_id": 13,
      "response_time_ms": 15000
    },
    {
      "question_id": "q8",
      "selected_movie_id": 5,
      "response_time_ms": 15000
    },
    {
      "question_id": "q9",
      "selected_movie_id": 23,
      "response_time_ms": 15000
    },
    {
      "question_id": "q10",
      "selected_movie_id": 8,
      "response_time_ms": 15000
    }
  ]
}
```

**Structure d’un objet `answers[]`**

| Champ | Type observé | Description |
| --- | --- | --- |
| `question_id` | `string` | Identifiant de question, de `q1` à `q10` dans les exemples. |
| `selected_movie_id` | `integer` | Identifiant du film choisi comme réponse. |
| `response_time_ms` | `integer` | Temps de réponse en millisecondes ; valeurs illustrées : `5000`, `15000`, `30000`. |

Les identifiants de partie, de question et de film sont des données d’exemple : ils ne constituent pas un jeu de test réutilisable garanti. Les exemples contiennent 10 réponses ; l’export ne prouve pas que cette taille est obligatoire. La gestion des réponses absentes, des valeurs `null`, des délais dépassés et d’une seconde correction de la même partie n’est pas précisée.

**Incohérence à vérifier :** les deux requêtes portent le nom « guest », mais un Bearer est configuré dans chacune. Le test réel confirme désormais une correction sans Bearer à condition de fournir le `game_token` de la partie invitée.

Le test invité renvoie un score de partie dans `summary.score` et `awarded_score: 0`. Le calcul général du score, une éventuelle XP et l’attribution de points en mode connecté restent à confirmer.

**Corps validé pour une correction invitée**

Le corps de l’export doit être complété avec `game_token`. Sans ce champ et sans Bearer, le test renvoie HTTP 403 « Accès à la partie refusé ». Avec le champ, la correction de la même partie réussit (HTTP 200).

| Champ supplémentaire | Type observé | Usage confirmé |
| --- | --- | --- |
| `game_token` | `string` | Jeton renvoyé par `/api/game/start`, transmis tel quel pour corriger la partie invitée. |

```json
{
  "game_id": "2b34aa9e-98ff-460c-87fc-31b123be9497",
  "answers": [
    {
      "question_id": "q1",
      "selected_movie_id": 2,
      "response_time_ms": 15000
    },
    {
      "question_id": "q2",
      "selected_movie_id": 20,
      "response_time_ms": 15000
    },
    {
      "question_id": "q3",
      "selected_movie_id": 26,
      "response_time_ms": 15000
    },
    {
      "question_id": "q4",
      "selected_movie_id": 25,
      "response_time_ms": 15000
    },
    {
      "question_id": "q5",
      "selected_movie_id": 8,
      "response_time_ms": 15000
    },
    {
      "question_id": "q6",
      "selected_movie_id": 9,
      "response_time_ms": 15000
    },
    {
      "question_id": "q7",
      "selected_movie_id": 19,
      "response_time_ms": 15000
    },
    {
      "question_id": "q8",
      "selected_movie_id": 19,
      "response_time_ms": 15000
    },
    {
      "question_id": "q9",
      "selected_movie_id": 22,
      "response_time_ms": 15000
    },
    {
      "question_id": "q10",
      "selected_movie_id": 26,
      "response_time_ms": 15000
    }
  ],
  "game_token": "<GAME_TOKEN>"
}
```

**Réponse observée — HTTP 403**

Capture Vercel : `2026-10-20T13:49:59.209965+00:00`. Authentification : sans Bearer. Variante : Correction invitée sans game_token.

```json
{
  "error": true,
  "url": "https://mk-cms-api-remake.vercel.app/api/game/correction",
  "statusCode": 403,
  "statusMessage": "Accès à la partie refusé",
  "message": "Accès à la partie refusé"
}
```

**Réponse observée — HTTP 200**

Capture Vercel : `2026-10-20T13:50:05.218848+00:00`. Authentification : sans Bearer. Variante : Correction invitée avec game_token.

Exemple de réponse anonymisé ; les longues listes sont abrégées pour la lecture. Les champs et valeurs utiles ci-dessous proviennent de la réponse capturée.

```json
{
  "games": [
    {
      "game_id": "2b34aa9e-98ff-460c-87fc-31b123be9497",
      "questions": [
        {
          "question_id": "q1",
          "ID_quote": 1,
          "correct_movie_id": 1
        }
      ]
    }
  ],
  "game_id": "2b34aa9e-98ff-460c-87fc-31b123be9497",
  "summary": {
    "correct_answers": 3,
    "question_count": 10,
    "score": 336,
    "awarded_score": 0
  },
  "corrections": [
    {
      "question_id": "q1",
      "selected_movie_id": 2,
      "response_time_ms": 15000,
      "quote_text": "I'll be back.",
      "selected_movie_title": "Die Hard",
      "correct_movie_title": "The Terminator",
      "correct_movie_id": 1,
      "is_correct": false,
      "score": 0
    },
    {
      "question_id": "q2",
      "selected_movie_id": 20,
      "response_time_ms": 15000,
      "quote_text": "Are you not entertained?",
      "selected_movie_title": "The Exorcist",
      "correct_movie_title": "Gladiator",
      "correct_movie_id": 4,
      "is_correct": false,
      "score": 0
    }
  ]
}
```

**Champs de la réponse de succès**

| Champ | Type observé |
| --- | --- |
| `games` | `array` |
| `games[].game_id` | `string` |
| `games[].questions` | `array` |
| `games[].questions[].question_id` | `string` |
| `games[].questions[].ID_quote` | `integer` |
| `games[].questions[].correct_movie_id` | `integer` |
| `game_id` | `string` |
| `summary` | `object` |
| `summary.correct_answers` | `integer` |
| `summary.question_count` | `integer` |
| `summary.score` | `integer` |
| `summary.awarded_score` | `integer` |
| `corrections` | `array` |
| `corrections[].question_id` | `string` |
| `corrections[].selected_movie_id` | `integer` |
| `corrections[].response_time_ms` | `integer` |
| `corrections[].quote_text` | `string` |
| `corrections[].selected_movie_title` | `string` |
| `corrections[].correct_movie_title` | `string` |
| `corrections[].correct_movie_id` | `integer` |
| `corrections[].is_correct` | `boolean` |
| `corrections[].score` | `integer` |

Les types décrivent cet échantillon ; `null` ne permet pas d’inférer les autres valeurs acceptées.

**Lecture du résultat capturé :** 3 réponses correctes sur 10, score de partie de 336 et score attribué de 0. Chaque bonne réponse de cet essai, avec un temps déclaré de 15 000 ms, rapporte 112 points. Cet échantillon ne suffit pas à établir la formule générale. La réponse comporte à la fois `games[].questions` et `corrections`, ainsi qu’un `game_id` au premier niveau.

### `PATCH /api/admin/user/:id`

Modifier ou supprimer un utilisateur depuis l’administration.

**Paramètre de chemin**

| Paramètre | Format observé | Description |
| --- | --- | --- |
| `id` | Entier dans l’URL | Identifiant de l’utilisateur ciblé ; exemple : `48`. |

**Exemple : ADMIN patch user/:id local**

Authentification configurée : Bearer.

```json
{
  "user_is_blocked": false
}
```

| Champ | Type observé | Description |
| --- | --- | --- |
| `user_is_blocked` | `boolean` | État de blocage ; l’exemple envoie `false`. Les valeurs acceptées doivent être confirmées côté serveur. |

Les champs sont présents dans cet exemple. Leur caractère obligatoire, leurs limites et les autres champs acceptés ne sont pas précisés.

**Réponse** : non incluse dans l’export. Aucun exemple de corps de succès ou d’erreur ni code HTTP n’est disponible.

### `GET /api/admin/quotes`

Consulter les citations depuis l’administration. Aucun filtre ni paramètre de pagination n’est configuré.

**Exemple : ADMIN get quotes local**

Authentification configurée : Bearer.

Corps : aucun corps configuré.

**Réponse observée — HTTP 401**

Capture Vercel : `2026-10-20T13:47:36.839197+00:00`. Authentification : sans Bearer. Variante : /api/admin/quotes.

```json
{
  "error": true,
  "url": "https://mk-cms-api-remake.vercel.app/api/admin/quotes",
  "statusCode": 401,
  "statusMessage": "Token manquant",
  "message": "Token manquant"
}
```

**Réponse observée — HTTP 200**

Capture Vercel : `2026-10-20T13:49:09.661753+00:00`. Authentification : Bearer administrateur. Variante : ADMIN get quotes local.

Exemple de réponse anonymisé ; les longues listes sont abrégées pour la lecture. Les champs et valeurs utiles ci-dessous proviennent de la réponse capturée.

```json
{
  "quotes": [
    {
      "ID_quote": 30,
      "quote_text": "It's alive! It's alive!",
      "quote_language": "en",
      "quote_source": null,
      "quote_status": "approved",
      "quote_created_at": "2026-10-15T09:58:55.000Z",
      "ID_movie": 30,
      "movie_title": "Frankenstein"
    },
    {
      "ID_quote": 29,
      "quote_text": "Sometimes dead is better.",
      "quote_language": "en",
      "quote_source": null,
      "quote_status": "approved",
      "quote_created_at": "2026-10-15T09:58:55.000Z",
      "ID_movie": 29,
      "movie_title": "Pet Sematary"
    }
  ]
}
```

**Champs de la réponse de succès**

| Champ | Type observé |
| --- | --- |
| `quotes` | `array` |
| `quotes[].ID_quote` | `integer` |
| `quotes[].quote_text` | `string` |
| `quotes[].quote_language` | `string` |
| `quotes[].quote_source` | `null` |
| `quotes[].quote_status` | `string` |
| `quotes[].quote_created_at` | `string` |
| `quotes[].ID_movie` | `integer` |
| `quotes[].movie_title` | `string` |

Les types décrivent cet échantillon ; `null` ne permet pas d’inférer les autres valeurs acceptées.

## Exemple de cycle invité avec fetch

```js
const API_BASE = 'https://mk-cms-api-remake.vercel.app/api';

async function postJson(path, payload) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Erreur HTTP ${response.status}`);
  }
  return data;
}

const game = await postJson('/game/start', { category: 'all' });

// Construire answers à partir des choix et temps réels du joueur :
// [{ question_id: 'q1', selected_movie_id: 1, response_time_ms: 12000 }, ...]
async function corrigerPartie(answers) {
  return postJson('/game/correction', {
    game_id: game.game_id,
    game_token: game.game_token,
    answers,
  });
}
```

Pour une lecture authentifiée, envoyer `Authorization: Bearer <TOKEN>` avec la valeur `token` reçue à la connexion. Le cycle ci-dessus décrit le mode invité testé ; la correction d’une partie connectée n’a pas été exécutée.

## Éléments restant à confirmer

- Réponses de l’inscription, de `PATCH /api/user/:id`, de `DELETE /api/user/:id`, de `PATCH /api/admin/user/:id` et de `DELETE /api/admin/user/:id` : aucune réponse capturée.
- Champs obligatoires, validations, bornes et autres erreurs possibles.
- Droits du propriétaire et comportement des routes d’administration avec un jeton joueur.
- Calcul général du score, éventuelle XP et attribution de points en mode connecté.
- Pagination, filtres, départage des égalités du classement et durée de vie des parties.
- Réponses absentes, valeurs `null`, dépassement du temps et répétition d’une correction.

## Particularités de l’export

- Les requêtes `patch user/:id local` et `delete user/:id local` ciblent en réalité Vercel ; les environnements du tableau sont basés sur les URL.
- `GET /api/test-db` et `DELETE /api/admin/user/:id` n’ont qu’un exemple local ; `PATCH /api/user/:id` et `DELETE /api/user/:id` n’ont qu’un exemple Vercel. Cela ne démontre pas l’absence de ces routes dans l’autre environnement.
- Les deux variantes de démarrage de partie disposent chacune d’un exemple local et d’un exemple Vercel.
- Les deux exemples de correction ont des identifiants de partie et des réponses différents ; ils sont conservés séparément pour refléter l’export.
- Les identifiants des exemples et les noms des champs sont conservés ; les identifiants de connexion et mots de passe illustratifs sont remplacés par des valeurs génériques.

## Bilan des tests du 20 octobre 2026

Les tests aboutis couvrent neuf couples méthode/route, avec les deux variantes de démarrage, trois refus GET sans jeton et un refus de correction invitée sans `game_token`. Les appels authentifiés ont utilisé un jeton administrateur fourni dans l’export et une connexion avec les identifiants exportés. Les URL de test étaient toutes sur Vercel, même lorsque le nom de la requête source contenait « local ».

Une partie invitée a été corrigée avec les premières propositions comme choix de test, sans Bearer utilisateur. Sa réponse indique `awarded_score: 0`. Une partie personnalisée authentifiée a été démarrée mais n’a pas été corrigée. Les identifiants des parties documentées sont des exemples d’exécutions passées, pas des parties à réutiliser.

Les essais de création, modification et suppression de comptes temporaires ont été bloqués avant exécution par le contrôle automatique d’autorisation. Ces cinq routes restent documentées à partir de l’export uniquement. Aucun compte existant n’a été modifié ou supprimé par les tests aboutis.

Les jetons utilisateur, jetons de partie, mots de passe et adresses e-mail réelles sont masqués dans ce document. Les captures sont des observations datées ; les listes peuvent évoluer.
