import mysql from 'mysql2/promise'
import { getAuthenticatedUser } from '../../utils/auth'
import { unlockAvailableHats } from '../../utils/hats.js'

export default defineEventHandler(async (event) => {
  const decoded = await getAuthenticatedUser(event)

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  try {
    await connection.beginTransaction()

    await unlockAvailableHats(connection, decoded.id)

    const [users] = await connection.query(
      `
        SELECT
          ID_user,
          user_pseudo,
          user_mail,
          user_score,
          user_role,
          user_avatar_color,
          user_avatar_emotion,
          user_avatar_hat_id
        FROM users
        WHERE ID_user = ?
        LIMIT 1
      `,
      [decoded.id]
    )

    if (users.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Utilisateur introuvable',
      })
    }

    const user = users[0]

    await connection.commit()

    return {
      ID_user: user.ID_user,
      user_pseudo: user.user_pseudo,
      user_mail: user.user_mail,
      user_score: user.user_score,
      user_role: user.user_role,
      user_avatar_color: user.user_avatar_color,
      user_avatar_emotion: user.user_avatar_emotion,
      user_avatar_hat_id: user.user_avatar_hat_id,
    }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    await connection.end()
  }
})