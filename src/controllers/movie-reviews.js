import ApiError from '../services/ApiError.js'
import { MovieReview } from '../models/index.js'

export const getMovieReviews = async (req, res, next) => {
  const { movieId } = req.params

  try {

    const result = await MovieReview.getMovieRatingAndReviews(movieId)

    if (!result || result.is_deleted) {
      return next(new ApiError('Movie not found', 404))
    }

    return res.status(200).json(result)

  } catch (error) {

    next(error)

  }
}

export const createMovieReview = async (req, res, next) => {
  const { movieId } = req.params
  const username = req.user
  const payload = { ...req.body, username, movie_id: movieId }

  try {

    const review = await MovieReview.create(payload)
    return res.status(201).json(review)

  } catch (error) {

    next(error)

  }
}
