const {SECRET} = require('../utils/config')
const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
  if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.errors[0].message });
  }
  if (error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).json({ error: error.errors[0].message });
  }
  console.error(error)

  return response.status(500).json({
    error: 'internal server error'
  })
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch(error) {
      console.log('JWT Error:', error.message)
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = {errorHandler, tokenExtractor}