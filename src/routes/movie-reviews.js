import express from 'express'

const router = express.Router({ mergeParams: true })

router.get('/', (req, res) => { res.status(200).send('Hello from movie reviews!') })

router.post('/', () => {})

export default router
