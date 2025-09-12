import { compare, hash } from 'bcrypt'
import jwt from 'jsonwebtoken'

import ApiError from '../services/ApiError.js'
import { User } from '../models/index.js'

export const login = async (req, res, next) => {
  const { username, password } = req.body

  try {

    if (!username || !password) {
      return next(new ApiError('Username and password are required', 400))
    }

    const user = await User.findByUsername({ username, includePassword: true })

    if (!user) {
      return next(new ApiError('Invalid username or password', 401))
    }

    const matchingPassword = await compare(password, user.password)

    if (!matchingPassword) {
      return next(new ApiError('Invalid username or password', 401))
    }

    const jwtPayload = { username: user.username, role: user.role }
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: '24h',
      algorithm: 'HS256',
    })

    return res.status(200).json({ token })

  } catch (error) {

    next(error)

  }
}

export const signup = async (req, res, next) => {
  const { username, password, role = 'user' } = req.body

  if (!username || !password) {
    return next(new ApiError('Username and password are required', 400))
  }

  try {

    const user = await User.findByUsername({ username })

    if (user) {
      return next(new ApiError('Username already exists', 409))
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
    const passwordHash = await hash(password, saltRounds)
    const newUser = await User.create({ username, role, password: passwordHash })

    return res.status(201).json({ username: newUser.username })

  } catch (error){

    next(error)

  }
}
