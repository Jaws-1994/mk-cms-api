import mysql from 'mysql2/promise'
import { getAuthenticatedUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const authenticatedUser = await getAuthenticatedUser(event)
  const id = Number(getRouterParam(event, 'id'))

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Identifiant invalide',
    })
  }

  if (id !== authenticatedUser.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Vous pouvez uniquement modifier votre compte',
    })
  }

  const body = await readBody(event)

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Données invalides',
    })
  }

  const allowedFields = [
    'user_pseudo',
    'user_mail',
    'user_avatar_color',
    'user_avatar_emotion',
    'user_avatar_hat_id',
  ]

  const fields = Object.keys(body)

  if (
    fields.length === 0 ||
    fields.some((field) => !allowedFields.includes(field))
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Champs manquants ou non autorisés',
    })
  }

  // Un PATCH ne modifie que les champs présents dans la requête.
  if ('user_pseudo' in body) {
    if (
      typeof body.user_pseudo !== 'string' ||
      !body.user_pseudo.trim() ||
      body.user_pseudo.trim().length > 30
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Pseudo invalide : entre 1 et 30 caractères',
      })
    }

    body.user_pseudo = body.user_pseudo.trim()
  }

  if ('user_mail' in body) {
    if (
      typeof body.user_mail !== 'string' ||
      body.user_mail.trim().length > 191 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.user_mail.trim())
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Adresse email invalide',
      })
    }

    body.user_mail = body.user_mail.trim()
  }

  if (
    'user_avatar_color' in body &&
    !['blue', 'red', 'yellow'].includes(body.user_avatar_color)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Couleur invalide',
    })
  }

  if (
    'user_avatar_emotion' in body &&
    !['happy', 'neutral', 'sad', 'angry', 'surprised'].includes(
      body.user_avatar_emotion
    )
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Émotion invalide',
    })
  }

  if (
    'user_avatar_hat_id' in body &&
    body.user_avatar_hat_id !== null &&
    (
      !Number.isSafeInteger(body.user_avatar_hat_id) ||
      body.user_avatar_hat_id <= 0
    )
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Identifiant de chapeau invalide',
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

    // On vérifie que le chapeau demandé est débloqué.
    if (
      'user_avatar_hat_id' in body &&
      body.user_avatar_hat_id !== null
    ) {
      const [hats] = await connection.query(
        `SELECT ID_hat
         FROM user_hats
         WHERE ID_user = ? AND ID_hat = ?`,
        [id, body.user_avatar_hat_id]
      )

      if (hats.length === 0) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Ce chapeau n’est pas débloqué',
        })
      }
    }

    // Les noms de colonnes proviennent uniquement de la liste autorisée.
    // Toutes les valeurs passent par des paramètres SQL.
    const updates = fields.map((field) => `${field} = ?`).join(', ')
    const values = fields.map((field) => body[field])

    await connection.query(
      `UPDATE users SET ${updates} WHERE ID_user = ?`,
      [...values, id]
    )

    return {
      success: true,
      message: 'Profil mis à jour',
    }
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Ce pseudo ou cet email est déjà utilisé',
      })
    }

    throw error
  } finally {
    await connection.end()
  }
})