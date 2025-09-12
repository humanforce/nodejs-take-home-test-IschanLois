import express from 'express'

import authRouter from './auth.js'
import moviesRouter from './movies.js'
import movieReviewsRouter from './movie-reviews.js'
import verifyAccessToken from '../middlewares/verify-access-token.js'

const router = express.Router()

router.use('/auth', authRouter)

router.use('/movies', verifyAccessToken, moviesRouter)
router.use('/movies/:movieId/reviews', verifyAccessToken, movieReviewsRouter)

export default router
