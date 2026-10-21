import mysql from 'mysql2/promise'

export default defineEventHandler(async () => {
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
        user_score
      FROM users
      WHERE user_is_blocked = 0
      ORDER BY user_score DESC, ID_user ASC
    `)

    return {
      leaderboard: users,
    }
  } finally {
    await connection.end()
  }
})