import { MovieReview } from '../models/index.js'

export const getMovieReviews = async (req, res, next) => {
 
}

export const createMovieReview = async (req, res, next) => {
  const { movieId } = req.params
  const payload = { ...req.body, movie_id: movieId }

  try {
    const review = await MovieReview.create(payload)
    return res.status(201).json(review)
  } catch (error) {
    next(error)
  }
}
