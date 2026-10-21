import mysql from 'mysql2/promise'
import { requireCurrentAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const admin = await requireCurrentAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Identifiant invalide',
    })
  }

  if (
    !body ||
    typeof body.user_is_blocked !== 'boolean'
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'user_is_blocked doit être un booléen',
    })
  }

  if (id === admin.id && body.user_is_blocked) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Vous ne pouvez pas bloquer votre propre compte',
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
      'SELECT ID_user FROM users WHERE ID_user = ?',
      [id]
    )

    if (users.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Utilisateur introuvable',
      })
    }

    await connection.query(
      'UPDATE users SET user_is_blocked = ? WHERE ID_user = ?',
      [body.user_is_blocked ? 1 : 0, id]
    )

    return {
      success: true,
      user_is_blocked: body.user_is_blocked,
      message: body.user_is_blocked
        ? 'Utilisateur bloqué'
        : 'Utilisateur débloqué',
    }
  } finally {
    await connection.end()
  }
})