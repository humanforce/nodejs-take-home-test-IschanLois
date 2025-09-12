import express from 'express'

import { moviesController } from '../controllers/index.js'
import upload from '../middlewares/multer.js'
import multerErrorHandler from '../middlewares/multer-error-handler.js'

const router = express.Router()

router.get('/top-rated', moviesController.getTopRatedMovies)

router.post('/', moviesController.createMovie)

router.post('/:movieId/images', upload.single('cover'),  moviesController.uploadCoverImage, multerErrorHandler)

router.patch('/:movieId', moviesController.updateMovie)

router.delete('/:movieId', moviesController.deleteMovie)

export default router

