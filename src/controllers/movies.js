import { join } from 'node:path'

import ApiError from '../services/ApiError.js'
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
  if (!req.file) {
    return next(new ApiError('No file uploaded', 400))
  }

  res.status(201).json({ file_url: `https://${join('assets', req.file.filename)}` })
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
      return next(new ApiError('Movie not found', 404))
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
      return next(new ApiError('Movie not found', 404))
    }

    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export const getTopRatedMovies = async (req, res, next) => {
  if (!req.query.limit || isNaN(req.query.limit)) {
    return next(new ApiError('Limit query parameter is required and must be a number', 400))
  }

  const { limit } = req.query

  if (limit < 1 || limit > 100) {
    return next(new ApiError('Limit must be between 1 and 100', 400))
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
