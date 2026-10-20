import jwt from 'jsonwebtoken'

export const getAuthenticatedUser = (event) => {
  // Chaque requête protégée vérifie le jeton : aucune donnée utilisateur n'est
  // déduite d'un identifiant transmis par le navigateur.
  const authorization = getHeader(event, 'authorization')

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token manquant',
    })
  }

  const token = authorization.slice(7)

  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  }
  catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token invalide ou expiré',
    })
  }
}

// Reçoit l’utilisateur issu du token vérifié et la connexion déjà ouverte.
export const requireCurrentAdmin = async (connection, authenticatedUser) => {
  const userId = authenticatedUser?.id

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Session invalide',
    })
  }

  // Consulte le rôle actuel, plutôt que celui mémorisé dans le token.
  const [users] = await connection.query(
    'SELECT ID_user, user_role FROM users WHERE ID_user = ? LIMIT 1',
    [userId],
  )

  const user = users[0]

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Session invalide',
    })
  }

  if (user.user_role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Accès administrateur requis',
    })
  }

  return user
}
