const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const userExtractor = async (req, res, next) => {
  const authorization = req.get('Authorization')
  // console.log(authorization)
  if (authorization && authorization.startsWith('bearer ')) {
    const token = authorization.replace('bearer ', '')
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    req.user = user

    next()
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
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
  userExtractor,
  unknownEndpoint,
  errorHandler
}