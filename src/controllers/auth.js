import { hash } from 'bcrypt'

import ApiError from '../services/ApiError.js'
import { User } from '../models/index.js'

export const login = (req, res, next) => {

}

export const signup = async (req, res, next) => {
  const { username, password, role = 'user' } = req.body

  if (!username || !password) {
    return next(new ApiError('Username and password are required', 400))
  }

  try {

    const user = await User.findUserByUsername(username)

    if (user) {
      return next(new ApiError('Username already exists', 409))
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
    const passwordHash = await hash(password, saltRounds)
    const newUser = await User.create({ username, user_role: role, user_password: passwordHash })

    return res.status(201).json({ username: newUser.username })

  } catch (error){

    next(error)

  }
}
