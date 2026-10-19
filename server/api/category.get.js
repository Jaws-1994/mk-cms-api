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
    const [categories] = await connection.query(`
      SELECT
        ID_genre,
        genre_name
      FROM genres
      ORDER BY genre_name ASC
    `)

    return {
      categories,
    }
  } finally {
    await connection.end()
  }
})