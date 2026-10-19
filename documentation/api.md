# Référence de l’API

Les routes sont exposées sous `/api`. Les corps des requêtes JSON doivent être
envoyés avec l’en-tête `Content-Type: application/json`.

## `GET /api/test-db`

Teste la connexion MySQL en exécutant `SELECT 1`.

Exemple de réponse :

```json
{
  "ok": 1
}
```

## `POST /api/auth/register`

Crée un compte. Le pseudo, l’adresse e-mail et le mot de passe sont requis. Le
mot de passe doit comporter au moins quatre caractères ; il est stocké sous
forme de hash bcrypt.

Corps :

```json
{
  "pseudo": "mon-pseudo",
  "mail": "moi@example.com",
  "password": "mon-mot-de-passe"
}
```

Réponse en cas de succès :

```json
{
  "id": 1,
  "user": "created"
}
```

Erreurs prévues : `400` si des données sont manquantes ou si le mot de passe
est trop court ; `409` si le pseudo ou l’adresse e-mail est déjà utilisé.

## `POST /api/auth/login`

Authentifie un compte avec son adresse e-mail et son mot de passe.

Corps :

```json
{
  "mail": "moi@example.com",
  "password": "mon-mot-de-passe"
}
```

Réponse en cas de succès :

```json
{
  "token": "<jeton-jwt>",
  "user": {
    "id": 1,
    "pseudo": "mon-pseudo",
    "role": "..."
  }
}
```

Le jeton expire au bout d’un jour. Une requête sans identifiants valides renvoie
`401`.

## `GET /api/auth/me`

Renvoie le profil du compte associé au jeton. Fournissez l’en-tête :

```http
Authorization: Bearer <jeton-jwt>
```

Réponse en cas de succès :

```json
{
  "ID_user": 1,
  "user_pseudo": "mon-pseudo",
  "user_score": 0,
  "user_role": "...",
  "user_avatar_color": "...",
  "user_avatar_emotion": "...",
  "user_avatar_hat_id": 0
}
```

Erreurs prévues : `401` si le jeton est absent, invalide ou expiré ; `404` si
le compte associé n’existe plus.
