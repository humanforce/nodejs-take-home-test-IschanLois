import { beforeEach, describe, jest } from '@jest/globals'
import jwt from 'jsonwebtoken'

import ApiError from '../services/ApiError.js'
import verifyAccessToken from './verify-access-token.js'

describe('verifyAccessToken Middleware', () => {
  let next = null
  let res = null

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()

    next = jest.fn()
    res = jest.fn()
  })

  it('should call next() if token is valid', async () => {
    const req = { headers: { authorization: 'Bearer token' } }

    jest.spyOn(jwt, 'verify').mockReturnValue({ user: 'user1' })

    await verifyAccessToken(req, res, next)

    expect(next).not.toHaveBeenCalledWith(expect.any(ApiError))
  })

  it('should return an error if no token is provided', async () => {
    const req = { headers: {} }

    await verifyAccessToken(req, res, next)

    expect(next).toHaveBeenCalledWith(new ApiError('Access token is missing', 401))
  })

  it('should return an error if token is invalid', async () => {
    const req = { headers: { authorization: 'Bearer token' } }

    jest.spyOn(jwt, 'verify').mockImplementation(() => { throw new Error('Invalid token') })

    await verifyAccessToken(req, res, next)

    expect(next).toHaveBeenCalledWith(new ApiError('Invalid access token', 401))
  })

})
