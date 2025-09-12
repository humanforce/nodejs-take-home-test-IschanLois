import { jest } from '@jest/globals'

import ApiError from '../services/ApiError'
import { MovieReview } from '../models'
import { createMovieReview, getMovieReviews } from './movie-reviews'

describe('movie-reviews controller', () => {
  let res = null
  let next = null

  const params = { movieId: 1 }
  const body = {
    rating: 5,
    heading: 'Awesome!',
    body: 'Best movie ever!',
  }

  beforeEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()

    next = jest.fn()
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  describe('getMovieReviews()', () => {
    it('should return movie reviews and rating', async () => {
      const req = { params }

      const mockRatingAndReviews = {
        movie_id: 1,
        average_rating: 4.5,
        title: "The Wolf of Wall Street",
        is_deleted: false,
        reviews: [
          { review_id: 1, movie_id: 1, rating: 5, heading: 'Great!', body: 'Loved it!', likes: 10, dislikes: 2 },
          { review_id: 2, movie_id: 1, rating: 4, heading: 'Good', body: 'Enjoyed it.', likes: 5, dislikes: 1 },
        ],
      }

      jest.spyOn(MovieReview, 'getMovieRatingAndReviews').mockResolvedValue(mockRatingAndReviews)

      await getMovieReviews(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockRatingAndReviews)
      expect(next).not.toHaveBeenCalled()
    })

    it('should return 404 if movie not found', async () => {
      const req = { params }

      jest.spyOn(MovieReview, 'getMovieRatingAndReviews').mockResolvedValue(null)

      await getMovieReviews(req, res, next)

      expect(next).toHaveBeenCalledWith(new ApiError('Movie not found', 404))
    })

    it('should handle errors', async () => {
      const req = { params }

      const mockError = new Error('Database error')

      jest.spyOn(MovieReview, 'getMovieRatingAndReviews').mockRejectedValue(mockError)

      await getMovieReviews(req, res, next)

      expect(next).toHaveBeenCalledWith(mockError)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
    })
  })

  describe('createMovieReview()', () => {
    it('should create a new movie review', async () => {
      const req = { params, body }

      const mockNewReview = {
        review_id: 3,
        movie_id: 1,
        rating: 5,
        heading: 'Awesome!',
        body: 'Best movie ever!',
        likes: 0,
        dislikes: 0,
        body: 'user1'
      }

      jest.spyOn(MovieReview, 'create').mockResolvedValue(mockNewReview)

      await createMovieReview(req, res, next)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(mockNewReview)
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle errors', async () => {
      const req = { params, body }

      const mockError = new Error('Validation error')

      jest.spyOn(MovieReview, 'create').mockRejectedValue(mockError)

      await createMovieReview(req, res, next)

      expect(next).toHaveBeenCalledWith(mockError)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
    })
  })
})