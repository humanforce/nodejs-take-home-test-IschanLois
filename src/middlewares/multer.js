import { extname, normalize, join } from 'node:path'

import multer from 'multer'

const MAX_FILE_SIZE = 5_242_880 // 5MB

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, normalize(join(import.meta.dirname, '../../assets/')))
  },
  filename: (req, file, callback) => {
    callback(null, `${req.params.movieId}-${file.fieldname}-${Date.now()}${extname(file.originalname)}`)
  }
})

export default multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const fileExtname = filetypes.test(extname(file.originalname).toLowerCase())

    if (mimetype && fileExtname) {
      return cb(null, true)
    } else {
      cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
    }
  }
})
