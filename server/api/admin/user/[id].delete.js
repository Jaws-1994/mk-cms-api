import mysql from 'mysql2/promise'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

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