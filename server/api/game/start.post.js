import mysql from 'mysql2/promise'
import { randomBytes, randomInt, randomUUID, createHash } from 'node:crypto'
import { getAuthenticatedUser } from '../../utils/auth'

const QUESTION_COUNT = 10
const QUESTION_TIME_LIMIT_MS = 30000
const POINTS_PER_ANSWER = 10
const GAME_DURATION_SECONDS = 3600

const shuffle = (items) => {
  const result = [...items]

  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')

  // Pas de header = partie découverte. Un header invalide n'est pas ignoré.
  const authorization = getHeader(event, 'authorization')
  const authenticatedUser = authorization === undefined
    ? null
    : getAuthenticatedUser(event)

  if (
    authenticatedUser &&
    (!Number.isSafeInteger(authenticatedUser.id) || authenticatedUser.id <= 0)
  ) {
    throw createError({ statusCode: 401, statusMessage: 'Token invalide' })
  }

  const body = await readBody(event)

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createError({ statusCode: 400, statusMessage: 'Paramètres invalides' })
  }

  if (Object.keys(body).some((key) => !['category', 'genre_ids'].includes(key))) {
    throw createError({ statusCode: 400, statusMessage: 'Paramètre non autorisé' })
  }

  const allCategories = body.category === 'all'

  // Choisir soit "all", soit une liste d'identifiants de genres.
  if (
    (allCategories && 'genre_ids' in body) ||
    (!allCategories && (
      'category' in body ||
      !Array.isArray(body.genre_ids) ||
      body.genre_ids.length === 0 ||
      body.genre_ids.length > 50 ||
      body.genre_ids.some((id) => !Number.isSafeInteger(id) || id <= 0)
    ))
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Utilisez category: all ou une liste genre_ids valide',
    })
  }

  if (!authenticatedUser && !allCategories) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Connectez-vous pour choisir les catégories',
    })
  }

  const genreIds = allCategories ? [] : [...new Set(body.genre_ids)]
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  try {
    if (authenticatedUser) {
      const [users] = await connection.query(
        'SELECT ID_user FROM users WHERE ID_user = ?',
        [authenticatedUser.id]
      )

      if (users.length === 0) {
        throw createError({ statusCode: 401, statusMessage: 'Compte introuvable' })
      }
    }

    let genres

    if (allCategories) {
      ;[genres] = await connection.query(
        'SELECT ID_genre, genre_name FROM genres ORDER BY genre_name ASC'
      )
    } else {
      const placeholders = genreIds.map(() => '?').join(', ')
      ;[genres] = await connection.query(
        `SELECT ID_genre, genre_name FROM genres
         WHERE ID_genre IN (${placeholders}) ORDER BY genre_name ASC`,
        genreIds
      )

      if (genres.length !== genreIds.length) {
        throw createError({ statusCode: 400, statusMessage: 'Catégorie introuvable' })
      }
    }

    // EXISTS évite de dupliquer une citation d'un film ayant plusieurs genres.
    const categoryFilter = allCategories ? '' : `
      AND EXISTS (
        SELECT 1 FROM movie_genres mg
        WHERE mg.ID_movie = q.ID_movie
          AND mg.ID_genre IN (${genreIds.map(() => '?').join(', ')})
      )`

    const [quotes] = await connection.query(
      `SELECT q.ID_quote, q.ID_movie, q.quote_text, q.quote_language,
              m.movie_title
       FROM quotes q
       JOIN movies m ON m.ID_movie = q.ID_movie
       WHERE q.quote_status = 'approved' ${categoryFilter}
       ORDER BY RAND()
       LIMIT ?`,
      [...genreIds, QUESTION_COUNT]
    )

    if (quotes.length < QUESTION_COUNT) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Pas assez de citations approuvées pour ces catégories',
      })
    }

    // Les distracteurs viennent du même ensemble de catégories.
    const movieFilter = allCategories ? '' : `
      WHERE EXISTS (
        SELECT 1 FROM movie_genres mg
        WHERE mg.ID_movie = m.ID_movie
          AND mg.ID_genre IN (${genreIds.map(() => '?').join(', ')})
      )`

    const [movies] = await connection.query(
      `SELECT m.ID_movie, m.movie_title FROM movies m ${movieFilter}`,
      genreIds
    )

    if (movies.length < 4) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Il faut au moins quatre films pour créer les propositions',
      })
    }

    const gameId = randomUUID()
    const gameToken = randomBytes(32).toString('hex')
    const gameTokenHash = createHash('sha256').update(gameToken).digest('hex')

    const questions = quotes.map((quote, index) => {
      const distractors = shuffle(
        movies.filter((movie) => movie.ID_movie !== quote.ID_movie)
      ).slice(0, 3)

      return {
        question_id: `q${index + 1}`,
        quote: {
          ID_quote: quote.ID_quote,
          quote_text: quote.quote_text,
          quote_language: quote.quote_language,
        },
        options: shuffle([
          { ID_movie: quote.ID_movie, movie_title: quote.movie_title },
          ...distractors,
        ]),
      }
    })

    const game = {
      game_id: gameId,
      genre: !allCategories && genres.length === 1
        ? genres[0]
        : {
          ID_genre: null,
          genre_name: allCategories
            ? 'Toutes les catégories'
            : 'Catégories sélectionnées',
        },
      // Ajout pour identifier toutes les catégories en cas de sélection multiple.
      genres,
      question_count: QUESTION_COUNT,
      question_time_limit_ms: QUESTION_TIME_LIMIT_MS,
      questions,
    }

    // Instantané privé : les changements de citations ne modifient pas le corrigé.
    const correction = {
      games: [{
        game_id: gameId,
        questions: quotes.map((quote, index) => ({
          question_id: `q${index + 1}`,
          ID_quote: quote.ID_quote,
          correct_movie_id: quote.ID_movie,
        })),
      }],
    }

    await connection.query(
      `INSERT INTO game_sessions (
        game_id, ID_user, game_token_hash, game_ranked,
        game_start, game_correction, game_points_per_answer,
        game_created_at, game_expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP(),
        TIMESTAMPADD(SECOND, ?, UTC_TIMESTAMP()))`,
      [
        gameId,
        authenticatedUser?.id ?? null,
        gameTokenHash,
        authenticatedUser ? 1 : 0,
        JSON.stringify(game),
        JSON.stringify(correction),
        POINTS_PER_ANSWER,
        GAME_DURATION_SECONDS,
      ]
    )

    // game_token sert uniquement à retrouver une partie visiteur sans compte.
    // Il n'est pas enregistré en clair en DB et ne contient pas le corrigé.
    return { ...game, game_token: gameToken }
  } finally {
    await connection.end()
  }
})
