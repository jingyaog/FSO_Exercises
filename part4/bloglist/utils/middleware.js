const logger = require('./logger')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('bearer ')) {
    req.token = authorization.replace('bearer ', '')
  }

  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name ===  'JsonWebTokenError') {
    return res.status(401).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  tokenExtractor,
  unknownEndpoint,
  errorHandler
}