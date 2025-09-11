import Movie from '../models/Movie.js'

export const createMovie = async (req, res, next) => {
  const payload = req.body

  try {
    const movie = await Movie.create(payload)
    res.status(201).json(movie)
  } catch (error) {
    next(error)
  }
}

export const uploadCoverImage = async (req, res, next) => {

}

export const updateMovie = async (req, res, next) => {
  
}

export const deleteMovie = async (req, res, next) => {

}

export const getTopRatedMovies = async (req, res, next) => {

}
