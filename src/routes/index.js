import express from 'express'

import moviesRouter from './movies.js'
import movieReviewsRouter from './movie-reviews.js'

const router = express.Router()

router.use('/movies', moviesRouter)
router.use('/movies/:movieId/reviews', movieReviewsRouter)

export default router
