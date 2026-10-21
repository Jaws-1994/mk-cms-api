import mysql from 'mysql2/promise'
import jwt from 'jsonwebtoken'

export const getAuthenticatedUser = async (event) => {
  const authorization = getHeader(event, 'authorization')

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token manquant',
    })
  }

  const token = authorization.slice(7)
  let decoded

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token invalide ou expiré',
    })
  }

  if (!Number.isSafeInteger(decoded.id) || decoded.id <= 0) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token invalide',
    })
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  try {
    const [users] = await connection.query(
      `SELECT
        ID_user,
        user_pseudo,
        user_role,
        user_is_blocked
       FROM users
       WHERE ID_user = ?
       LIMIT 1`,
      [decoded.id]
    )

    if (users.length === 0) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Compte introuvable',
      })
    }

    const user = users[0]

    if (Number(user.user_is_blocked) === 1) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Ce compte est bloqué',
      })
    }

    return {
      id: user.ID_user,
      pseudo: user.user_pseudo,
      role: user.user_role,
    }
  } finally {
    await connection.end()
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