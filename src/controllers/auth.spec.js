import { describe, jest } from '@jest/globals'
import bcrypt from 'bcrypt'

import ApiError from '../services/ApiError.js'
import User from '../models/User.js'
import { signup } from './auth.js'

describe('auth Controller', () => {
  let next = null

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()

    next = jest.fn()
  })

  describe('signup()', () => {

    it('should return 201 and username when signup is successful', async () => {
      const req = {
        body: {
          username: 'newuser',
          password: 'password123',
          role: 'user'
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      jest.spyOn(User, 'findByUsername').mockResolvedValue(null)
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword')
      jest.spyOn(User, 'create').mockResolvedValue({ username: 'newuser' })

      await signup(req, res, next)
  
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({ username: 'newuser' })
      expect(next).not.toHaveBeenCalled()
    })

    it('should handle missing username or password', async () => {
      const req = { body: {} }
      const res = {}

      await signup(req, res, next)

      expect(next).toHaveBeenCalledWith(new ApiError('Username and password are required', 400))
    })

    it('should handle existing username', async () => {
      const req = {
        body: {
          username: 'existinguser',
          password: 'password123'
        }
      }
      const res = {}

      jest.spyOn(User, 'findByUsername').mockResolvedValue({ username: 'existinguser' })

      await signup(req, res, next)

      expect(next).toHaveBeenCalledWith(new ApiError('Username already exists', 409))
    })

    it('should handle errors during signup', async () => {
      const req = {
        body: {
          username: 'newuser',
          password: 'password123'
        }
      }
      const res = {}

      jest.spyOn(User, 'findByUsername').mockRejectedValue(new Error('Database error'))

      await signup(req, res, next)

      expect(next).toHaveBeenCalledWith(new Error('Database error'))
    })

  })

})
