import { beforeEach, describe, jest } from '@jest/globals'

import { createMovie } from './movies'
import { Movie } from '../models'

describe('movies controller', () => {
  let res = null
  let next = null

  const params = { movieId: 1 }
  const body = {
    title: 'Inception',
    director: 'Christopher Nolan',
    release_year: 2010,
  }

  beforeEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()

    next = jest.fn()
    res = {
      sendStatus: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  describe('createMovie()', () => {
    it('should create a new movie', async () => {
      const req = { params, body }

      const mockMovie = {
        movie_id: 1,
        title: 'Inception',
        director: 'Christopher Nolan',
        release_year: 2010,
      }

      jest.spyOn(Movie, 'create').mockResolvedValue(mockMovie)

      await createMovie(req, res, next)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(mockMovie)
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle errors', async () => {
      const req = { params, body }

      const mockError = new Error('Database error')

      jest.spyOn(Movie, 'create').mockRejectedValue(mockError)

      await createMovie(req, res, next)

      expect(next).toHaveBeenCalledWith(mockError)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
    })
  })
})