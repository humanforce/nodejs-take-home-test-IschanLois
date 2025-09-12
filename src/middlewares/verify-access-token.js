import ApiError from '../services/ApiError.js'

import jwt from 'jsonwebtoken'

export default (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError('Access token is missing', 401))
  }

  const token = authHeader.split(' ')[1]

  try {

    const { username } = jwt.verify(token, process.env.JWT_SECRET)
    req.user = username
    next()

  } catch {

    return next(new ApiError('Invalid access token', 401))

  }

}
