import express from 'express'

import defaultErrorHandler from './middlewares/default-error-handler.js'
import router from './routes/index.js' 

const app = express()

app.use(express.json())

app.use('/api/v1', router)

app.use(defaultErrorHandler)

export default app
