import { MulterError } from 'multer'

export default (error, req, res, next) => {
  if (error instanceof MulterError) {
    res.status(400).json({ error: error.message })
  }
}