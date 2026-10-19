import mysql from 'mysql2/promise'
import { createHash, timingSafeEqual } from 'node:crypto'
import { getAuthenticatedUser } from '../../utils/auth'

// MySQL peut renvoyer les JSON déjà décodés, MariaDB peut renvoyer du texte.
const parseJson = (value) => typeof value === 'string' ? JSON.parse(value) : value

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')

  const authorization = getHeader(event, 'authorization')
  const authenticatedUser = authorization === undefined
    ? null
    : getAuthenticatedUser(event)
  const body = await readBody(event)

  if (
    !body || typeof body !== 'object' || Array.isArray(body) ||
    typeof body.game_id !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(body.game_id) ||
    !Array.isArray(body.answers) || body.answers.length > 10
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Données de partie invalides' })
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  let transactionStarted = false

  try {
    await connection.beginTransaction()
    transactionStarted = true

    // Deux corrections simultanées attendent sur la même ligne.
    const [games] = await connection.query(
      `SELECT *, game_expires_at <= UTC_TIMESTAMP() AS game_expired
       FROM game_sessions WHERE game_id = ? FOR UPDATE`,
      [body.game_id]
    )

    if (games.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Partie introuvable' })
    }

    const game = games[0]

    if (game.ID_user !== null) {
      if (!authenticatedUser) {
        throw createError({ statusCode: 401, statusMessage: 'Connexion requise' })
      }

      if (authenticatedUser.id !== game.ID_user) {
        throw createError({ statusCode: 403, statusMessage: 'Cette partie ne vous appartient pas' })
      }
    } else {
      // Une connexion après le démarrage ne transforme pas une démo en partie classée.
      if (typeof body.game_token !== 'string' || !/^[0-9a-f]{64}$/.test(body.game_token)) {
        throw createError({ statusCode: 403, statusMessage: 'Accès à la partie refusé' })
      }

      const tokenHash = createHash('sha256').update(body.game_token).digest()
      const expectedHash = Buffer.from(game.game_token_hash, 'hex')

      if (expectedHash.length !== tokenHash.length || !timingSafeEqual(tokenHash, expectedHash)) {
        throw createError({ statusCode: 403, statusMessage: 'Accès à la partie refusé' })
      }
    }

    const correction = parseJson(game.game_correction)

    // Une nouvelle soumission renvoie le même corrigé, sans modifier les résultats.
    if (game.game_completed_at !== null) {
      await connection.commit()
      transactionStarted = false
      return correction
    }

    if (Number(game.game_expired) === 1) {
      throw createError({ statusCode: 410, statusMessage: 'Cette partie a expiré' })
    }

    const start = parseJson(game.game_start)
    const questions = new Map(start.questions.map((question) => [question.question_id, question]))
    const selectedAnswers = new Map()

    for (const answer of body.answers) {
      if (
        !answer || typeof answer !== 'object' || Array.isArray(answer) ||
        typeof answer.question_id !== 'string' ||
        !questions.has(answer.question_id) ||
        selectedAnswers.has(answer.question_id) ||
        (answer.selected_movie_id !== null && (
          !Number.isSafeInteger(answer.selected_movie_id) || answer.selected_movie_id <= 0
        ))
      ) {
        throw createError({ statusCode: 400, statusMessage: 'Réponse invalide ou question en double' })
      }

      const question = questions.get(answer.question_id)

      if (
        answer.selected_movie_id !== null &&
        !question.options.some((option) => option.ID_movie === answer.selected_movie_id)
      ) {
        throw createError({ statusCode: 400, statusMessage: 'Ce film ne fait pas partie des propositions' })
      }

      selectedAnswers.set(answer.question_id, answer.selected_movie_id)
    }

    // Les questions absentes de la soumission comptent comme sans réponse.
    const answers = start.questions.map((question) => ({
      question_id: question.question_id,
      selected_movie_id: selectedAnswers.get(question.question_id) ?? null,
    }))

    const correctCount = correction.games[0].questions.filter(
      (question) => selectedAnswers.get(question.question_id) === question.correct_movie_id
    ).length

    const awardedScore = Number(game.game_ranked) === 1
      ? correctCount * game.game_points_per_answer
      : 0

    if (Number(game.game_ranked) === 1) {
      const [result] = await connection.query(
        'UPDATE users SET user_score = user_score + ? WHERE ID_user = ?',
        [awardedScore, game.ID_user]
      )

      if (result.affectedRows === 0) {
        throw createError({ statusCode: 401, statusMessage: 'Compte introuvable' })
      }
    }

    await connection.query(
      `UPDATE game_sessions
       SET game_answers = ?, game_correct_count = ?, game_awarded_score = ?,
           game_completed_at = UTC_TIMESTAMP()
       WHERE game_id = ?`,
      [JSON.stringify(answers), correctCount, awardedScore, game.game_id]
    )

    await connection.commit()
    transactionStarted = false

    // Même structure que game-corrections.local.json.
    return correction
  } catch (error) {
    if (transactionStarted) {
      await connection.rollback()
    }

    throw error
  } finally {
    await connection.end()
  }
})
