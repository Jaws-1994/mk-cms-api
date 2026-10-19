import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { mail, password } = body || {};

  if (!mail || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email et mot de passe requis' });
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  try {
    // Seuls les champs nécessaires à la connexion sont lus. Le hash ne quitte
    // jamais le serveur et n'est utilisé que pour la comparaison bcrypt.
    const [users] = await connection.query(
      `SELECT ID_user, user_pseudo, user_role, user_score, user_password_hash
       FROM users
       WHERE user_mail = ?`,
      [mail]
    );

    if (users.length === 0) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Identifiants incorrects',
      })
    }

    const user = users[0]

    const isPasswordValid = await bcrypt.compare(
      password,
      user.user_password_hash
    )

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Identifiants incorrects',
      })
    }

    // Le jeton porte les informations minimales nécessaires aux routes protégées
    // et expire afin de ne pas laisser une session valide indéfiniment.
    const token = jwt.sign(
      {
        id: user.ID_user,
        pseudo: user.user_pseudo,
        role: user.user_role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    )

    return {
      token,
      user: {
        id: user.ID_user,
        pseudo: user.user_pseudo,
        role: user.user_role,
      },
    }
  }
  finally {
    await connection.end()
  }
})
