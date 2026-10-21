import mysql from 'mysql2/promise'
import { getAuthenticatedUser, requireCurrentAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Vérifie le token avant d’ouvrir la connexion.
const authenticatedUser = await getAuthenticatedUser(event)

  const id = Number(getRouterParam(event, 'id'))

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Identifiant invalide',
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
    // Autorise la suppression selon le compte et le rôle actuels en base.
await requireCurrentAdmin(connection, authenticatedUser)
    const [result] = await connection.query(
      'DELETE FROM users WHERE ID_user = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Utilisateur introuvable',
      })
    }

    return {
      success: true,
      message: 'Utilisateur supprimé',
    }
  } finally {
    await connection.end()
  }
})