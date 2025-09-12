import express from 'express'

import authRouter from './auth.js'
import moviesRouter from './movies.js'
import movieReviewsRouter from './movie-reviews.js'

const router = express.Router()

router.use('/auth', authRouter)

router.use('/movies', moviesRouter)
router.use('/movies/:movieId/reviews', movieReviewsRouter)

export default router
