import { MulterError } from 'multer'
import { jest } from '@jest/globals'

import multerErrorHandler from './multer-error-handler.js'

describe('multerError middleware', () => {
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

  it('should respond with 400 if error is instance of MulterError', () => {
    const error = new MulterError('Multer error occurred')

    multerErrorHandler(error, null, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: error.message })
    expect(next).not.toHaveBeenCalled()
  })

  it('should call next with error if error is not instance of MulterError', () => {
    const error = new Error('Some other error')

    multerErrorHandler(error, null, res, next)

    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(error)
  })
})
