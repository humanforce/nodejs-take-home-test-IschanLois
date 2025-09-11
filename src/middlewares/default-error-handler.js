export default (error, req, res, next) => {
  const badUserInput = new Set([
    'SequelizeValidationError',
    'SequelizeUniqueConstraintError',
    'SequelizeForeignKeyConstraintError',
  ])

  if (badUserInput.has(error.name)) {
    res.status(400)
  } else {
    res.status(500)
  }

  return res.json({ error: error.message })
}
