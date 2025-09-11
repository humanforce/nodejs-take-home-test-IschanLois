import express from 'express'

import { movieReviewsController } from '../controllers/index.js'

const router = express.Router({ mergeParams: true })

router.get('/', movieReviewsController.getMovieReviews)

router.post('/', movieReviewsController.createMovieReview)

export default router
