# Base de données

L’API se connecte à MySQL à partir des variables `DB_HOST`, `DB_PORT`,
`DB_USER`, `DB_PASSWORD` et `DB_NAME`. Le dépôt ne fournit actuellement ni
migration ni fichier SQL d’initialisation : la base et son schéma doivent être
préparés séparément.

## Table `users`

Les routes d’authentification s’attendent à trouver une table `users` avec les
colonnes suivantes :

| Colonne | Utilisée par | Rôle |
| --- | --- | --- |
| `ID_user` | Inscription, connexion, profil | Identifiant du compte |
| `user_pseudo` | Inscription, connexion, profil | Pseudo public |
| `user_mail` | Inscription, connexion | Adresse de connexion |
| `user_password_hash` | Inscription, connexion | Hash bcrypt du mot de passe |
| `user_role` | Connexion, profil | Rôle du compte |
| `user_score` | Profil | Score du compte |
| `user_avatar_color` | Profil | Couleur de l’avatar |
| `user_avatar_emotion` | Profil | Émotion de l’avatar |
| `user_avatar_hat_id` | Profil | Identifiant du chapeau de l’avatar |

`ID_user` doit permettre de retrouver un compte de façon unique. Les routes
vérifient que `user_pseudo` et `user_mail` ne sont pas déjà utilisés lors de
l’inscription ; des contraintes `UNIQUE` en base sont recommandées pour protéger
également contre les inscriptions concurrentes.

Les types, valeurs par défaut, contraintes et règles de nullabilité ne sont pas
définis par le code de l’API. Adaptez-les au schéma du projet et assurez-vous
que les champs lus par les routes ont des valeurs compatibles.

## Identifiants et mots de passe

Le serveur utilise les paramètres MySQL de `.env`. Les mots de passe des
utilisateurs sont hashés avec bcrypt avant insertion. La base ne doit donc
jamais contenir ni exposer le mot de passe en clair ; le champ requis par
l’application est `user_password_hash`.
