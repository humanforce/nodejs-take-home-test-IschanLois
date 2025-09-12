import { jest } from '@jest/globals'

import { MovieReview } from '../models'
import { createMovieReview } from './movie-reviews'

describe('movie-reviews controller', () => {
  let res = null
  let next = null

  const params = { movieId: 1 }
  const body = {
    rating: 5,
    heading: 'Awesome!',
    body: 'Best movie ever!',
    username: 'user1'
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