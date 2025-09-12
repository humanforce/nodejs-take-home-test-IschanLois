export default (error, req, res, next) => {
  const badUserInput = new Set([
    'SequelizeValidationError',
    'SequelizeUniqueConstraintError',
    'SequelizeForeignKeyConstraintError',
  ])

  let code = error.statusCode || 500

  if (badUserInput.has(error.name)) {
    code = 400
  }

  return res.status(code).json({ error: error.message })
}
