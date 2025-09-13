import { Sequelize } from 'sequelize'

import Artist from '../src/models/Artist.js'
import Movie from '../src/models/Movie.js'
import User from '../src/models/User.js'
import MovieReview from '../src/models/MovieReview.js'

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  retry: { max: 3 }
})

const createMoviePayloads = (movies) => movies.map((movie) => ({
  movie_id: movie.id,
  release_date: movie.release_date,
  title: movie.title,
  cover_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
  synopsis: movie.overview,
  is_deleted: false,
}))

const createMovieReviewsPayloads = (movieReviews) => movieReviews.flatMap(({ movieId, reviews }) => {

  return reviews.map((review) => {
    const [heading, body] = review.content.split('.', 2)

    return {
      movie_id: movieId,
      rating: Math.max(Math.ceil(review.author_details.rating / 2), 1), // Convert 10 scale to 5 scale
      heading: heading,
      body: body ?? null,
      username: review.author,
    }
  })
})

const processDirectorAndWriter = (movieCredits) => {
  return movieCredits.reduce((prev, credits) => {
    const tmdbDirector = credits.crew.find(crewMember => crewMember.job === 'Director')
    const [directorFirstName, directorLastName] = tmdbDirector.name.split(' ')
    const director = { movieId: credits.moviedId, first_name: directorFirstName, last_name: directorLastName}

    const tmdbWriter = credits.crew.find(crewMember => crewMember.job === 'Producer')
    const [writerFirstName, writerLastName] = tmdbWriter.name.split(' ')
    const writer = { movieId: credits.moviedId,first_name: writerFirstName, last_name: writerLastName }

    prev.writers.push(writer)
    prev.directors.push(director)
    
    return prev
  }, { writers: [], directors: [] })
}

export default async (movies, movieReviews, movieCredits) => {
  const { writers: writersPayload, directors: directorsPayload } = processDirectorAndWriter(movieCredits)
  const moviePayloads = createMoviePayloads(movies)
  const reviewsPayload = createMovieReviewsPayloads(movieReviews)

  const transaction = await sequelize.transaction()

  try {
    // Separating the creation for easy mapping of values to movies
    const createWritersQuery = Artist.bulkCreate(
      writersPayload,
      { transaction, returning: true }
    )

    const createDirectorsQuery = Artist.bulkCreate(
      directorsPayload,
      { transaction, returning: true }
    )

    const [writers, directors] = await Promise.all([createWritersQuery, createDirectorsQuery])

    for (let idx = 0; idx < writers.length; idx++) {
      moviePayloads[idx].writer_id = writers[idx].artist_id
      moviePayloads[idx].director_id = directors[idx].artist_id
    }

    await Movie.bulkCreate(
      moviePayloads,
      { transaction, returning: true }
    )

    await User.bulkCreate(
      reviewsPayload.map((review) => ({ username: review.username, password: 'password'})),
      { transaction, ignoreDuplicates: true }
    )

    await MovieReview.bulkCreate(
      reviewsPayload,
      { transaction }
    )

    await transaction.commit()
    sequelize.close()
  } catch (error) {

    console.error('Error during bulk create:', error)
    await transaction.rollback()
    throw error

  }
}
