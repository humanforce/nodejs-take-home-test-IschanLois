import express from 'express'

import { moviesController } from '../controllers/index.js'

const router = express.Router()

router.get('/', moviesController.getTopRatedMovies)

router.post('/', moviesController.createMovie)

router.post('/images', moviesController.uploadCoverImage)

router.patch('/:movieId', moviesController.updateMovie)

router.delete('/:movieId', moviesController.deleteMovie)

export default router

