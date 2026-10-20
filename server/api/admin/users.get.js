import mysql from 'mysql2/promise'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  // Bloque la requête avant de contacter la DB si l'utilisateur n'est pas admin
  requireAdmin(event)

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  try {
    const [users] = await connection.query(`
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
      ORDER BY user_pseudo ASC
    `)

    return { users }
  } finally {
    await connection.end()
  }
})