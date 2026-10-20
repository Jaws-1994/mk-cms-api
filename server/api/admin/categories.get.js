import mysql from "mysql2/promise";
import { requireAdmin } from "../../utils/auth.js";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [categories] = await connection.execute(`
      SELECT id_genre, genre_name
      FROM genres
      ORDER BY genre_name ASC
    `);

    return { categories };
  } catch (error) {
    console.error("Erreur chargement des genres :", error);

    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Erreur inconnue",
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});
