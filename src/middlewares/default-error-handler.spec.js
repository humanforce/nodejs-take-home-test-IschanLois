import { ValidationError } from 'sequelize'
import { jest } from '@jest/globals'

import defaultErrorHandler from './default-error-handler.js'

describe('defaultErrorHandler middleware', () => {
  let res = null
  let next = null

  beforeEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
  })

  it('should respond with 400 for validation errors', () => {
    const mockError = new ValidationError()

    const req = {}

    defaultErrorHandler(mockError, req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Validation Error' })
  })

  it('should respond with 500 for other errors', () => {
    const mockError = new Error('Something went wrong')

    const req = {}

    defaultErrorHandler(mockError, req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Something went wrong' })
  })
})
