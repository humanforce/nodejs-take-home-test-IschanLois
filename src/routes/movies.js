import express from 'express'

const router = express.Router()

router.get('/', (req, res) => { res.status(200).send('Hello World!') })

router.post('/', () => {})

router.patch('/:movieId', () => {})

router.delete('/:movieId', () => {})

export default router

