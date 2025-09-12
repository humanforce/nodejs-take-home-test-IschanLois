import { Movie } from '../models/index.js'

export const createMovie = async (req, res, next) => {
  const payload = req.body

  try {
    const movie = await Movie.create(payload)
    res.status(201).json(movie)
  } catch (error) {
    next(error)
  }
}

export const uploadCoverImage = async (req, res, next) => {

}

export const updateMovie = async (req, res, next) => {
  const payload = req.body
  const { movieId } = req.params

  try {
    const [affectedRows] = await Movie.update(payload, {
      where: {
        movie_id: movieId,
        is_deleted: false,
      },
    })

    if (affectedRows === 0) {
      res.status(404).json({ error: 'Movie not found' })
      return
    }

    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export const deleteMovie = async (req, res, next) => {
  const { movieId } = req.params

  try {
    const [affectedRows] = await Movie.update({ is_deleted: true }, {
      where: { movie_id: movieId },
    })

    if (affectedRows === 0) {
      res.status(404).json({ error: 'Movie not found' })
      return
    }

    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export const getTopRatedMovies = async (req, res, next) => {
  if (!req.query.limit || isNaN(req.query.limit)) {
    return res.status(400).json({ error: 'Invalid limit parameter' })
  }

  const { limit } = req.query

  if (limit < 1 || limit > 100) {
    return res.status(400).json({ error: 'Limit must be between 1 and 100' })
  }

  try {
    const response = await Movie.getTopMoviesByRating(limit)

    if (response.length === 0) {
      // request is valid, we just have insufficient data
      return res.status(200).json({ message: 'No movies with rating yet' })
    }

    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}
