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
  const payload = req.body
  const { movieId } = req.params

  try {
    const [affectedRows] = await Movie.update(payload, {
      where: {
        movie_id: movieId,
        is_deleted: false,
      },
    })

    if (affectedRows === 0) {
      res.status(404).json({ error: 'Movie not found' })
      return
    }

    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export const deleteMovie = async (req, res, next) => {
  const { movieId } = req.params

  try {
    const [affectedRows] = await Movie.update({ is_deleted: true }, {
      where: { movie_id: movieId },
    })

    if (affectedRows === 0) {
      res.status(404).json({ error: 'Movie not found' })
      return
    }

    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export const getTopRatedMovies = async (req, res, next) => {

}
